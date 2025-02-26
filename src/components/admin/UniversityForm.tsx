'use client'
import { useState, FormEvent, ChangeEvent } from 'react'

// Reusable Components
const InputField = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder = "" 
}: { 
  label: string; 
  type?: string; 
  value: string | number; 
  onChange: (e: ChangeEvent<HTMLInputElement>) => void; 
  placeholder?: string;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

const SelectField = ({ 
  label, 
  value, 
  onChange, 
  options 
}: { 
  label: string; 
  value: string; 
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void; 
  options: string[];
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const CheckboxField = ({ 
  label, 
  checked, 
  onChange 
}: { 
  label: string; 
  checked: boolean; 
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex items-center mb-4">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
    />
    <label className="ml-2 block text-sm text-gray-700">{label}</label>
  </div>
);

const Button = ({ 
  type = "button", 
  onClick, 
  className, 
  children 
}: { 
  type?: "button" | "submit" | "reset"; 
  onClick?: () => void; 
  className?: string; 
  children: React.ReactNode;
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
  >
    {children}
  </button>
);

interface UniversityFormProps {
  onSuccess?: () => void;
}

interface Course {
  course_name: string;
  show_pdf: boolean;
}

interface Category {
  category_name: string;
  show_pdf: boolean;
  courses: Course[];
}

interface FormData {
  university_name: string;
  established_year: number;
  approved_by: string;
  type: string;
  NAAC_grade?: string;
  ranked_by?: string;
  show_pdf: boolean;
  categories: Category[];
}

export default function UniversityForm({ onSuccess }: UniversityFormProps) {
  const [formData, setFormData] = useState<FormData>({
    university_name: '',
    established_year: new Date().getFullYear(),
    approved_by: '',
    type: '',
    NAAC_grade: '',
    ranked_by: '',
    show_pdf: false,
    categories: [{
      category_name: '',
      show_pdf: false,
      courses: []
    }]
  });

  const universityTypes = ["Public", "Private", "Deemed", "Central", "State"];
  const naacGrades = ["A++", "A+", "A", "B++", "B+", "B", "C"];
  const rankingBodies = ["NIRF", "QS World Rankings", "THE World University Rankings"];

  const handleCategoryChange = (index: number, field: keyof Category, value: any) => {
    const updatedCategories = [...formData.categories];
    updatedCategories[index] = { ...updatedCategories[index], [field]: value };
    setFormData({ ...formData, categories: updatedCategories });
  };

  const handleCourseChange = (catIndex: number, courseIndex: number, field: keyof Course, value: any) => {
    const updatedCategories = [...formData.categories];
    updatedCategories[catIndex].courses[courseIndex] = { 
      ...updatedCategories[catIndex].courses[courseIndex], 
      [field]: value 
    };
    setFormData({ ...formData, categories: updatedCategories });
  };

  const addCategory = () => {
    setFormData({ 
      ...formData, 
      categories: [
        ...formData.categories, 
        { 
          category_name: '', 
          show_pdf: false, 
          courses: [] 
        }
      ] 
    });
  };

  const removeCategory = (index: number) => {
    const updatedCategories = [...formData.categories];
    updatedCategories.splice(index, 1);
    setFormData({ ...formData, categories: updatedCategories });
  };

  const addCourse = (catIndex: number) => {
    const updatedCategories = [...formData.categories];
    updatedCategories[catIndex].courses.push({ 
      course_name: '', 
      show_pdf: false 
    });
    setFormData({ ...formData, categories: updatedCategories });
  };

  const removeCourse = (catIndex: number, courseIndex: number) => {
    const updatedCategories = [...formData.categories];
    updatedCategories[catIndex].courses.splice(courseIndex, 1);
    setFormData({ ...formData, categories: updatedCategories });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/universities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setFormData({
          university_name: '',
          established_year: new Date().getFullYear(),
          approved_by: '',
          type: '',
          NAAC_grade: '',
          ranked_by: '',
          show_pdf: false,
          categories: [{
            category_name: '',
            show_pdf: false,
            courses: []
          }]
        });
        
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Error creating university:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">University Information</h2>
      
      {/* University Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField 
          label="University Name" 
          value={formData.university_name} 
          onChange={(e) => setFormData({ ...formData, university_name: e.target.value })}
        />
        
        <InputField 
          label="Established Year" 
          type="number" 
          value={formData.established_year} 
          onChange={(e) => setFormData({ ...formData, established_year: parseInt(e.target.value) })}
        />
        
        <InputField 
          label="Approved By" 
          value={formData.approved_by} 
          onChange={(e) => setFormData({ ...formData, approved_by: e.target.value })}
        />
        
        <SelectField 
          label="University Type" 
          value={formData.type} 
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          options={universityTypes}
        />
        
        <SelectField 
          label="NAAC Grade" 
          value={formData.NAAC_grade || ''} 
          onChange={(e) => setFormData({ ...formData, NAAC_grade: e.target.value })}
          options={naacGrades}
        />
        
        <SelectField 
          label="Ranked By" 
          value={formData.ranked_by || ''} 
          onChange={(e) => setFormData({ ...formData, ranked_by: e.target.value })}
          options={rankingBodies}
        />
        
        <div className="col-span-1 md:col-span-2">
          <CheckboxField 
            label="Show PDF on university page" 
            checked={formData.show_pdf} 
            onChange={(e) => setFormData({ ...formData, show_pdf: e.target.checked })}
          />
        </div>
      </div>
      
      {/* Categories Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Program Categories</h2>
          <Button 
            onClick={addCategory} 
            className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
          >
            + Add Category
          </Button>
        </div>
        
        {formData.categories.map((category, catIndex) => (
          <div key={catIndex} className="mb-6 p-5 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Category #{catIndex + 1}</h3>
              {catIndex > 0 && (
                <button
                  type="button"
                  onClick={() => removeCategory(catIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField 
                label="Category Name" 
                value={category.category_name} 
                onChange={(e) => handleCategoryChange(catIndex, 'category_name', e.target.value)}
              />
              
              <div>
                <CheckboxField 
                  label="Show PDF on category page" 
                  checked={category.show_pdf} 
                  onChange={(e) => handleCategoryChange(catIndex, 'show_pdf', e.target.checked)}
                />
              </div>
            </div>
            
            {/* Courses Section */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium">Courses</h4>
                <Button 
                  onClick={() => addCourse(catIndex)} 
                  className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                >
                  + Add Course
                </Button>
              </div>
              
              {category.courses.map((course, courseIndex) => (
                <div key={courseIndex} className="mb-3 p-3 border border-gray-200 rounded-md bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-sm font-medium">Course #{courseIndex + 1}</h5>
                    <button
                      type="button"
                      onClick={() => removeCourse(catIndex, courseIndex)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputField 
                      label="Course Name" 
                      value={course.course_name} 
                      onChange={(e) => handleCourseChange(catIndex, courseIndex, 'course_name', e.target.value)}
                    />
                    
                    <div>
                      <CheckboxField 
                        label="Show PDF on course page" 
                        checked={course.show_pdf} 
                        onChange={(e) => handleCourseChange(catIndex, courseIndex, 'show_pdf', e.target.checked)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {category.courses.length === 0 && (
                <div className="text-center py-4 text-gray-500 italic">
                  No courses added yet. Click "Add Course" to create one.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Button 
          type="submit" 
          className="bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 w-full md:w-auto"
        >
          Create University
        </Button>
      </div>
    </form>
  );
}