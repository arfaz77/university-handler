import React from 'react';
import Link from 'next/link';
import { ArrowRight,  Award, Calendar, BookOpen, Building, Star } from 'lucide-react';
import type { University } from '@/types';

interface UniversityCardProps {
  university: University;
}

export default function UniversityCard({ university }: UniversityCardProps) {
  return (
    <Link href={`/university/${university._id}`}>
      <div className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer">
        {/* Card Header with Image Overlay */}
        <div className="relative h-40 bg-gradient-to-br from-indigo-600 to-purple-700">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute bottom-0 left-0 p-5 w-full">
            <div className="flex items-center gap-2 text-white mb-1">
              <Award className="h-4 w-4" />
              <span className="text-sm font-medium">{university?.NAAC_grade} Grade</span>
            </div>
            <h3 className="text-xl font-bold text-white">{university.university_name}</h3>
            {/* <div className="flex items-center gap-2 text-white opacity-90 mt-1">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{university?.location}</span>
            </div> */}
          </div>
        </div>
        
        {/* Card Content */}
        <div className="p-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-indigo-500 mt-1" />
              <div>
                <p className="text-xs font-semibold text-gray-500">Est Year</p>
                <p className="font-medium">{university?.established_year}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Building className="h-4 w-4 text-indigo-500 mt-1" />
              <div>
                <p className="text-xs font-semibold text-gray-500">Type</p>
                <p className="font-medium">{university?.type}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 col-span-2">
              <BookOpen className="h-4 w-4 text-indigo-500 mt-1" />
              <div>
                <p className="text-xs font-semibold text-gray-500">Approved By</p>
                <p className="font-medium text-sm">{university?.approved_by}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 col-span-2">
              <Star className="h-4 w-4 text-indigo-500 mt-1" />
              <div>
                <p className="text-xs font-semibold text-gray-500">Ranked By</p>
                <p className="font-medium">{university?.ranked_by}</p>
              </div>
            </div>
          </div>
          
          {/* View Button */}
          <div className="mt-5">
            <button className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all group">
              <span className="font-medium">View Details</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
