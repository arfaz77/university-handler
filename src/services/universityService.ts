// services/universityService.ts

export interface Category {
    _id?: string;
    category_name: string;
    category_pdf: string | null;
    courses: Course[];
  }
  
  export interface Course {
    _id?: string;
    course_name: string;
    course_pdf: string | null;
  }
  
  export interface University {
    _id?: string;
    university_name: string;
    university_pdf: string | null;
    categories: Category[];
  }
  
  export interface PaginationParams {
    page?: number;
    limit?: number;
    search?: string;
  }
  
  export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  }
  
  const BASE_URL = '/api/universities';
  
  // Get all universities with pagination and search
  export const getUniversities = async (params: PaginationParams = {}): Promise<PaginatedResponse<University>> => {
    const { page = 1, limit = 10, search = '' } = params;
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    if (search) queryParams.append('search', search);
    
    const response = await fetch(`${BASE_URL}?${queryParams.toString()}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch universities');
    }
    
    return response.json();
  };
  
  // Get university by ID
  export const getUniversityById = async (id: string): Promise<{ success: boolean; data: University }> => {
    const response = await fetch(`${BASE_URL}/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch university');
    }
    
    return response.json();
  };
  
  // Create university
  export const createUniversity = async (data: Partial<University>): Promise<{ success: boolean; data: University }> => {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create university');
    }
    
    return response.json();
  };
  
  // Update university
  export const updateUniversity = async (id: string, data: Partial<University>): Promise<{ success: boolean; data: University }> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update university');
    }
    
    return response.json();
  };
  
  // Delete university
  export const deleteUniversity = async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete university');
    }
    
    return response.json();
  };
  
  // Add category to university
  export const addCategory = async (universityId: string, formData: FormData): Promise<{ success: boolean; data: University }> => {
    const response = await fetch(`${BASE_URL}/${universityId}/categories`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add category');
    }
    
    return response.json();
  };
  
  // More methods for other endpoints can be added similarly