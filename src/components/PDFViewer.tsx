"use client"
import React from 'react';

export default function PDFViewer({ url, title }) {
  // On some platforms/browsers, directly embedding PDF might not work well
  // Add a fallback link for download
  return (
    <div className="h-full flex flex-col">
      <iframe 
        src={`${url}#toolbar=0`} 
        title={title}
        className="w-full h-full border-0" 
        style={{ minHeight: "500px" }}
      />
      <div className="p-2 text-center bg-gray-100">
        <p className="text-sm text-gray-500">
          If the PDF isn't displaying correctly, 
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 ml-1 underline"
          >
            download it directly
          </a>.
        </p>
      </div>
    </div>
  );
}