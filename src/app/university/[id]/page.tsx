'use client'
import { useState, useEffect } from 'react';
import type { University } from '@/types';
import { ArrowLeft, Award, Building, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import PDFViewerModal from '@/components/PDFViewer';

interface UniversityPageProps {
  params: { id: string };
}

export default function UniversityPage({ params }: UniversityPageProps) {
  const { id } = params;
  const [university, setUniversity] = useState<University | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/universities/${id}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setUniversity(data?.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!university) return <div>University not found</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft size={14} />
            Back to Universities
          </Link>
          <span>/</span>
          <span className="text-gray-700">{university?.university_name}</span>
        </div>
        <div className="bg-white rounded-xl overflow-hidden shadow-md mb-8">
          <div className="relative h-64 bg-blue-600">
            {university?.university_image ? (
              <Image src={university.university_image} alt={university.university_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">No Image</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
            <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center gap-1">
              <Award className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">{university?.NAAC_grade}</span>
            </div>
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <h1 className="text-3xl font-bold text-white mb-2">{university?.university_name}</h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-white">
                  <Building className="h-4 w-4" />
                  <span>{university?.type}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="h-4 w-4" />
                  <span>Est. {university?.established_year}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            {university.university_pdf && (
              <button onClick={() => { setPdfUrl(university.university_pdf); setShowPdfModal(true); }} className="block bg-blue-500 text-white text-center py-2 rounded-lg mb-4 hover:bg-blue-600">
                View University PDF
              </button>
            )}
            <h2 className="text-xl font-bold text-gray-800 mb-4">Available Courses</h2>
            <div className="space-y-6">
              {university.categories.map((category, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-blue-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-blue-800">{category.category_name.toUpperCase()}</h3>
                    {category.show_pdf && category.category_pdf && (
  <button 
    onClick={() => { setPdfUrl(category.category_pdf); setShowPdfModal(true); }} 
    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
  >
    View Category PDF
  </button>
)}
                  </div>
                  <div className="divide-y divide-gray-200">
                    {category.courses.map((course, courseIndex) => (
                      <div key={courseIndex} className="px-6 py-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                        <h4 className="text-lg font-medium text-gray-800">{course.course_name}</h4>
                        {course.show_pdf && course.course_pdf && (
  <button 
    onClick={() => { setPdfUrl(course.course_pdf); setShowPdfModal(true); }} 
    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
  >
    View Course PDF
  </button>
)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
           
          </div>
        </div>
      </main>
      <PDFViewerModal isOpen={showPdfModal} onClose={() => setShowPdfModal(false)} pdfUrl={pdfUrl} />
    </div>
  );
}
