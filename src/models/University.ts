// models/University.ts

import mongoose, { Schema, Document, Model } from 'mongoose';

// Course Interface and Schema
interface ICourse extends Document {
  course_name: string;
  course_pdf: string | null;
  show_pdf: boolean;
}

const CourseSchema = new Schema<ICourse>({
  course_name: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
    minlength: [2, 'Course name must be at least 2 characters']
  },
  course_pdf: {
    type: String,
    default: null
  },
  show_pdf: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Category Interface and Schema
interface ICategory extends Document {
  category_name: string;
  category_pdf: string | null;
  show_pdf: boolean;
  courses: ICourse[];
}

const CategorySchema = new Schema<ICategory>({
  category_name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    minlength: [2, 'Category name must be at least 2 characters']
  },
  category_pdf: {
    type: String,
    default: null
  },
  show_pdf: {
    type: Boolean,
    default: false
  },
  courses: [CourseSchema]
}, { timestamps: true });

// University Interface and Schema
export interface IUniversity extends Document {
  university_name: string;
  university_image: string;
  established_year: number;
  approved_by: string;
  type: string;
  NAAC_grade: string | null;
  ranked_by: string | null;
  university_pdf: string | null;
  show_pdf: boolean;
  categories: ICategory[];
}

const UniversitySchema = new Schema<IUniversity>({
  university_name: {
    type: String,
    required: [true, 'University name is required'],
    trim: true,
    minlength: [2, 'University name must be at least 2 characters']
  },
  university_image: {
    type: String,
    default: null
  },
  established_year: {
    type: Number,
    required: [true, 'Established year is required']
  },
  approved_by: {
    type: String,
    required: [true, 'Approving authority is required']
  },
  type: {
    type: String,
    required: [true, 'University type is required']
  },
  NAAC_grade: {
    type: String,
    default: null
  },
  ranked_by: {
    type: String,
    default: null
  },
  university_pdf: {
    type: String,
    default: null
  },
  show_pdf: {
    type: Boolean,
    default: false
  },
  categories: [CategorySchema]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Fix for "OverwriteModelError: Cannot overwrite 'University' model once compiled"
let University: Model<IUniversity>;

try {
  University = mongoose.model<IUniversity>('University');
} catch {
  University = mongoose.model<IUniversity>('University', UniversitySchema);
}

export default University;
