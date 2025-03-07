"use client"
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Award, Building, Calendar, FileText } from 'lucide-react';
import { University } from "@/types";
import dynamic from 'next/dynamic';

// Dynamically import the PDF viewer component to avoid SSR issues
const PDFViewer = dynamic(() => import('./PDFViewer'), { ssr: false });

export function UniversityClientComponent({ university }: { university: University }) {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState<string>("PDF Document");
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenPdf = (url: string | null, title: string) => {
    if (url) {
      setPdfUrl(url);
      setModalTitle(title);
      setIsLoading(true);
      setShowPdfModal(true);
      
      // Reset loading state after a short delay
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft size={14} />
            Back to Universities
          </Link>
          <span>/</span>
          <span className="text-gray-700">{university.university_name}</span>
        </div>
        <div className="bg-white rounded-xl overflow-hidden shadow-md mb-8">
          <div className="relative h-64 bg-blue-600">
            {university.university_image ? (
              <Image
                src={university.university_image}
                alt={university.university_name}
                width={800}
                height={300}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">No Image</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
            <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center gap-1">
              <Award className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">{university.NAAC_grade}</span>
            </div>
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <h1 className="text-3xl font-bold text-white mb-2">
                {university.university_name}
                {university.university_pdf && (
                  <button
                    onClick={() => handleOpenPdf(university.university_pdf, `${university.university_name} PDF`)}
                    className="ml-2 inline-flex items-center justify-center bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-1.5 transition-colors"
                    title="View University PDF"
                  >
                    <FileText className="h-5 w-5 text-white" />
                  </button>
                )}
              </h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-white">
                  <Building className="h-4 w-4" />
                  <span>{university.type}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="h-4 w-4" />
                  <span>Est. {university.established_year}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Available Courses</h2>
            <div className="space-y-6">
              {university.categories.map((category, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-blue-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-blue-800">{category.category_name.toUpperCase()}</h3>
                    {category.show_pdf && category.category_pdf && (
                      <button
                        onClick={() => handleOpenPdf(category.category_pdf, `${category.category_name} PDF`)}
                        className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded p-1.5 transition-colors"
                        title="View Category PDF"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-gray-200">
                    {category.courses.map((course, courseIndex) => (
                      <div key={courseIndex} className="px-6 py-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                        <h4 className="text-lg font-medium text-gray-800">{course.course_name}</h4>
                        {course.show_pdf && course.course_pdf && (
                          <button
                            onClick={() => handleOpenPdf(course.course_pdf, `${course.course_name} PDF`)}
                            className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded p-1.5 transition-colors"
                            title="View Course PDF"
                          >
                            <FileText className="h-4 w-4" />
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

      {/* PDF Modal */}
      {showPdfModal && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4 backdrop-blur-sm transition-opacity duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPdfModal(false);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pdf-modal-title"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 id="pdf-modal-title" className="text-lg font-semibold text-gray-800 dark:text-white">
                {modalTitle}
              </h3>
              <button 
                onClick={() => setShowPdfModal(false)} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden">
              {/* Toolbar with controls */}
              <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 border-b border-gray-200 dark:border-gray-600">
                <div className="flex gap-2 items-center">
                  {/* Zoom controls could go here */}
                </div>
                
                <div>
                  {pdfUrl && (
                    <a 
                      href={pdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      download 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Download
                    </a>
                  )}
                </div>
              </div>

              {/* PDF Content Area */}
              <div className="h-full relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-2 text-gray-700">Loading PDF...</p>
                    </div>
                  </div>
                )}
                {pdfUrl && <PDFViewer url={pdfUrl} title={modalTitle} />}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}