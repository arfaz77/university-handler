import { Hono, Context } from "hono";
import { handle } from "hono/vercel";
import University from "@/models/University"; // Adjust the import path as needed
import { fileUploadMiddleware } from "../../../../middleware/upload"; // Adjust the import path as needed
import { HTTPException } from "hono/http-exception";
import dbConnect from "@/lib/mongoose";
import mongoose   from "mongoose";

import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
// Custom interfaces

import path from "path";



// Define error types for better error handling
enum ErrorType {
  VALIDATION_ERROR = "ValidationError",
  RESOURCE_NOT_FOUND = "ResourceNotFound",
  DATABASE_ERROR = "DatabaseError",
  SERVER_ERROR = "ServerError",
  FILE_UPLOAD_ERROR = "FileUploadError"
}

const app = new Hono();

// Error handler middleware
const errorHandler = async (err: Error, c: Context) => {
  console.error("Error:", err);
  
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  
  if (err.name === "CastError" || err.message.includes("not found")) {
    return c.json({
      type: ErrorType.RESOURCE_NOT_FOUND,
      message: err.message
    }, 404);
  }
  
  if (err.name === "MongoError" || err.name === "MongoServerError") {
    return c.json({
      type: ErrorType.DATABASE_ERROR,
      message: err.message
    }, 500);
  }
  
  return c.json({
    type: ErrorType.SERVER_ERROR,
    message: err.message || "An unexpected error occurred"
  }, 500);
};

// Apply error handler to all routes
app.onError(errorHandler);

async function saveFile(file: File, fieldName: string): Promise<string> {
  const ext = path.extname(file.name);
  const filename = `${fieldName}-${uuidv4()}${ext}`;
  const filepath = path.join(process.cwd(), 'public/uploads', filename);
  
  const buffer = await file.arrayBuffer();
  await fs.writeFile(filepath, Buffer.from(buffer));
  
  return `/uploads/${filename}`;
}

// Function to remove file
async function removeFile(filePath: string | null): Promise<void> {
  if (!filePath) return;
  
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    await fs.access(fullPath); // Check if file exists
    await fs.unlink(fullPath);
  } catch (error) {
    // File doesn't exist or can't be accessed, ignore
  }
}

app.use("*", async (c, next) => {
  try {
    await dbConnect();
    return await next();
  } catch (error) {
    console.error("Database connection error:", error);
    return c.json({
      type: ErrorType.DATABASE_ERROR,
      message: "Failed to connect to database"
    }, 500);
  }
});
// Utility function to safely parse JSON
// const safeJsonParse = (str: string | null | undefined, fallback: any = null) => {
//   if (!str) return fallback;
//   try {
//     return JSON.parse(str);
//   } catch (e) {
//     throw new Error("Invalid JSON format");
//   }
// };

// Validation function
// const validateUniversityName = (name: string): boolean => {
//   return typeof name === 'string' && name.length >= 2;
// };

// Define the base path for your API
const basePath = "/api/universities";
// 📌 Create University
app.post(basePath, async (c) => {
  try {
    const body = await c.req.json();
    const { university_name, university_image, established_year, approved_by, type, NAAC_grade, ranked_by, categories } = body;

    if (!university_name || university_name.length < 2) {
      return c.json({ success: false, message: 'University name must be at least 2 characters' }, 400);
    }

    // if (!university_image) {
    //   return c.json({ success: false, message: 'University image is required' }, 400);
    // }

    if (!established_year) {
      return c.json({ success: false, message: 'Established year is required' }, 400);
    }

    if (!approved_by) {
      return c.json({ success: false, message: 'Approved by is required' }, 400);
    }

    if (!type) {
      return c.json({ success: false, message: 'University type is required' }, 400);
    }

    const formattedCategories = categories?.map(category => ({
      category_name: category.category_name,
      category_pdf: null,
      show_pdf: false,
      courses: category.courses?.map(course => ({
        course_name: course.course_name,
        course_pdf: null,
        show_pdf: false
      })) || []
    })) || [];

    const newUniversity = new University({
      university_name,
      university_image,
      established_year,
      approved_by,
      type,
      NAAC_grade: NAAC_grade || null,
      ranked_by: ranked_by || null,
      university_pdf: null,
      show_pdf: false,
      categories: formattedCategories
    });

    await newUniversity.save();
    return c.json({ success: true, data: newUniversity }, 201);
  } catch (error) {
    return c.json({ success: false, message: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
});

// 📌 Get All Universities (with pagination and search)
app.get(basePath, async (c) => {
  try {
    const { page = '1', limit = '10', search = '' } = c.req.query();
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const query = search ? { university_name: { $regex: search, $options: 'i' } } : {};
    const universities = await University.find(query).limit(limitNum).skip(skip);
    const total = await University.countDocuments(query);

    return c.json({
      success: true,
      data: universities,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) }
    });
  } catch (error) {
    return c.json({ success: false, message: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
});

// 📌 Get University by ID
app.get(`${basePath}/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const university = await University.findById(id);
    if (!university) {
      return c.json({ success: false, message: 'University not found' }, 404);
    }
    return c.json({ success: true, data: university });
  } catch (error) {
    return c.json({ success: false, message: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
});

// 📌 Edit University
app.put(`${basePath}/:id`, async (c: Context) => {
  try {
    const { id } = c.req.param();
    
    // Get form data including files
    const formData = await c.req.formData();
    const body: Record<string, string> = {};
    
    // File paths
    let university_pdf_path: string | undefined;
    let university_image_path: string | undefined;
    
    // Process form data
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (key === 'university_pdf') {
          university_pdf_path = await saveFile(value, 'university_pdf');
        } else if (key === 'university_image') {
          university_image_path = await saveFile(value, 'university_image');
        }
      } else {
        body[key] = value;
      }
    }
    
    // Find university
    let university = await University.findById(id);
    if (!university) return c.json({ error: 'University not found' }, 404);
    
    // Remove old files if new ones are uploaded
    if (university_pdf_path) await removeFile(university.university_pdf);
    if (university_image_path) await removeFile(university.university_image);
    
    // Update university fields with proper type conversion
    if (body.university_name) university.university_name = body.university_name;
    if (body.established_year) university.established_year = parseInt(body.established_year, 10);
    if (body.approved_by) university.approved_by = body.approved_by;
    if (body.type) university.type = body.type;
    if (body.NAAC_grade) university.NAAC_grade = body.NAAC_grade;
    if (body.ranked_by) university.ranked_by = body.ranked_by;
    if (body.show_pdf) university.show_pdf = body.show_pdf === 'true';
    
    // Update file paths
    if (university_pdf_path) university.university_pdf = university_pdf_path;
    if (university_image_path) university.university_image = university_image_path;
    
    // Save the updated university
    await university.save();
    
    return c.json({ 
      message: 'University updated successfully', 
      university 
    });
    
  } catch (error) {
    console.error("Update error:", error);
    return c.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, 500);
  }
});

// 📌 Delete University
app.delete(`${basePath}/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const university = await University.findById(id);
    if (!university) {
      return c.json({ success: false, message: 'University not found' }, 404);
    }
    await University.findByIdAndDelete(id);
    return c.json({ success: true, message: 'University deleted successfully' });
  } catch (error) {
    return c.json({ success: false, message: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
});

// 📌 Add Category to a University
app.put(`${basePath}/:id/categories/:categoryId`, fileUploadMiddleware, async (c) => {
  try {
    const { id, categoryId } = c.req.param();
    const body = await c.req.parseBody();
    const category_name = body.category_name as string | undefined;
    const show_pdf = body.show_pdf === "true"; // Convert string to boolean
    const filePath = ((c.req as unknown) as CustomHonoRequest).file?.path as string | undefined;

    const university = await University.findById(id);
    if (!university) {
      throw new HTTPException(404, { message: "University not found" });
    }

    const category = university.categories.find((cat: any) => cat._id.toString() === categoryId);
    if (!category) {
      throw new HTTPException(404, { message: "Category not found" });
    }

    // Update category properties if provided
    if (category_name) {
      if (category_name.length < 2) {
        throw new HTTPException(400, { message: "Category name must be at least 2 characters" });
      }
      category.category_name = category_name;
    }

    if (filePath) {
      category.category_pdf = filePath;
    }

    category.show_pdf = show_pdf; // Update show_pdf field

    await university.save();

    return c.json({
      success: true,
      data: university
    });
  } catch (error) {
    throw error;
  }
});

// pu cat
app.put('/:universityId/category/:categoryId', async (c) => {
  const { universityId, categoryId } = c.req.param();
  const body = await c.req.json();

  try {
    let university = await University.findById(universityId);
    if (!university) return c.json({ error: 'University not found' }, 404);

    let category = university.categories.id(categoryId);
    if (!category) return c.json({ error: 'Category not found' }, 404);

    category.category_name = body.category_name || category.category_name;
    category.category_pdf = body.category_pdf || category.category_pdf;
    category.show_pdf = body.show_pdf ?? category.show_pdf;

    await university.save();
    return c.json({ message: 'Category updated', university });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// The rest of your routes follow the same pattern...
// 📌 Delete Category
app.delete(`${basePath}/:id/categories/:categoryId`, async (c) => {
  try {
    const { id, categoryId } = c.req.param();
    
    const university = await University.findById(id);
    if (!university) {
      throw new HTTPException(404, { message: "University not found" });
    }

    const categoryIndex = university.categories.findIndex(cat => cat._id.toString() === categoryId);
    if (categoryIndex === -1) {
      throw new HTTPException(404, { message: "Category not found" });
    }

    university.categories.splice(categoryIndex, 1);
    await university.save();
    
    return c.json({
      success: true,
      message: "Category deleted successfully",
      data: university
    });
  } catch (error) {
    throw error;
  }
});

// 📌 Add Course to a Category
app.post(`${basePath}/:id/categories/:categoryId/courses`, fileUploadMiddleware, async (c) => {
  try {
    const { id, categoryId } = c.req.param();
    const body = await c.req.parseBody();
    const course_name = body.course_name as string;
    
    // Validate course name
    if (!course_name || course_name.length < 2) {
      throw new HTTPException(400, { message: "Course name must be at least 2 characters" });
    }
    
    const filePath = ((c.req as unknown) as CustomHonoRequest).file?.path as string | undefined;

    const university = await University.findById(id);
    if (!university) {
      throw new HTTPException(404, { message: "University not found" });
    }

    const category = university.categories.find(cat => cat._id.toString() === categoryId);
    if (!category) {
      throw new HTTPException(404, { message: "Category not found" });
    }

    // Check for duplicate course name
    const isDuplicate = category.courses.some(course => 
      course.course_name.toLowerCase() === course_name.toLowerCase()
    );
    
    if (isDuplicate) {
      throw new HTTPException(400, { message: "Course with this name already exists in the category" });
    }

    category.courses.push({ 
      course_name, 
      course_pdf: filePath || null 
    });
    
    await university.save();
    
    return c.json({
      success: true,
      data: university
    });
  } catch (error) {
    throw error;
  }
});

// 📌 Update Course
app.put('/:universityId/category/:categoryId/course/:courseId', async (c) => {
  const { universityId, categoryId, courseId } = c.req.param();
  const body = await c.req.json();

  try {
    let university = await University.findById(universityId);
    if (!university) return c.json({ error: 'University not found' }, 404);

    let category = university.categories.id(categoryId);
    if (!category) return c.json({ error: 'Category not found' }, 404);

    let course = category.courses.id(courseId);
    if (!course) return c.json({ error: 'Course not found' }, 404);

    course.course_name = body.course_name || course.course_name;
    course.course_pdf = body.course_pdf || course.course_pdf;
    course.show_pdf = body.show_pdf ?? course.show_pdf;

    await university.save();
    return c.json({ message: 'Course updated', university });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// 📌 Delete Course
app.delete(`${basePath}/:id/categories/:categoryId/courses/:courseId`, async (c) => {
  try {
    const { id, categoryId, courseId } = c.req.param();

    const university = await University.findById(id);
    if (!university) {
      throw new HTTPException(404, { message: "University not found" });
    }

    const category = university.categories.find(cat => cat._id.toString() === categoryId);
    if (!category) {
      throw new HTTPException(404, { message: "Category not found" });
    }

    const courseIndex = category.courses.findIndex(course => course._id.toString() === courseId);
    if (courseIndex === -1) {
      throw new HTTPException(404, { message: "Course not found" });
    }

    category.courses.splice(courseIndex, 1);
    await university.save();
    
    return c.json({
      success: true,
      message: "Course deleted successfully",
      data: university
    });
  } catch (error) {
    throw error;
  }
});

// 📌 Search universities, categories and courses
app.get("/search", async (c) => {
  try {
    const { query = "" } = c.req.query();
    
    if (!query || query.length < 2) {
      throw new HTTPException(400, { message: "Search query must be at least 2 characters" });
    }
    
    // Search universities by name
    const universities = await University.find({
      university_name: { $regex: query, $options: 'i' }
    });
    
    // Search within categories and courses
    const categoriesAndCourses = await University.find({
      $or: [
        { "categories.category_name": { $regex: query, $options: 'i' } },
        { "categories.courses.course_name": { $regex: query, $options: 'i' } }
      ]
    });
    
    // Combine unique results
    const allResults = [...universities];
    
    for (const uni of categoriesAndCourses) {
      if (!allResults.some(u => u._id.toString() === uni._id.toString())) {
        allResults.push(uni);
      }
    }
    
    return c.json({
      success: true,
      count: allResults.length,
      data: allResults
    });
  } catch (error) {
    throw error;
  }
});

// 📌 Health check endpoint
app.get(`${basePath}/health`, async (c) => {
  try {
    // Check database connection
    await dbConnect();
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    
    return c.json({
      status: "ok",
      database: dbStatus,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return c.json({
      status: "error",
      database: "error",
      message: error instanceof Error ? error.message : "Unknown database error",
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Export the handlers
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);