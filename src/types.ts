export interface University {
  _id: string;
  university_name: string;
  university_image: string | null;
  established_year: number;
  approved_by: string;
  type: string;
  NAAC_grade: string;
  ranked_by: string;
  university_pdf: string | null;
  show_pdf: boolean;
  categories: Category[];
}

export interface Category {
  category_name: string;
  category_pdf: string | null;
  show_pdf: boolean;
  courses: Course[];
}

export interface Course {
  course_name: string;
  course_pdf: string | null;
  show_pdf: boolean;
}