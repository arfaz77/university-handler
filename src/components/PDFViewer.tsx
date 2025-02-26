import React, { useState } from 'react';
import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen';
import { printPlugin } from '@react-pdf-viewer/print';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import '@react-pdf-viewer/full-screen/lib/styles/index.css';
import '@react-pdf-viewer/print/lib/styles/index.css';

interface PDFViewerModalProps {
  buttonText?: string;
  buttonClassName?: string;
  pdfUrl?: string | null;
  modalTitle?: string;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

const PDFViewerModal: React.FC<PDFViewerModalProps> = ({
  buttonText = 'View PDF',
  buttonClassName = 'px-4 py-2 bg-blue-600 text-white border-none cursor-pointer rounded hover:bg-blue-700 transition-colors',
  pdfUrl: initialPdfUrl = '',
  modalTitle = 'PDF Document',
  isOpen: initialIsOpen = false,
  onOpen,
  onClose,
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(initialPdfUrl || null);
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize plugins
  const toolbarPluginInstance = toolbarPlugin();
  const zoomPluginInstance = zoomPlugin();
  const fullScreenPluginInstance = fullScreenPlugin();
  const printPluginInstance = printPlugin();
  
  const { ZoomIn, ZoomOut } = zoomPluginInstance;
  const { EnterFullScreen } = fullScreenPluginInstance;
  const { Print } = printPluginInstance;

  const openModal = (url: string | null = initialPdfUrl) => {
    // if (!url) {
    //   setError('No PDF URL provided');
    //   return;
    // }
    
    setIsLoading(true);
    setPdfUrl(url);
    setIsOpen(true);
    setError(null);
    
    if (onOpen) onOpen();
  };

  const closeModal = () => {
    setIsOpen(false);
    setError(null);
    
    if (onClose) onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      {!initialIsOpen && (
        <button 
          onClick={() => openModal()} 
          className={buttonClassName}
          disabled={!initialPdfUrl}
        >
          {buttonText}
        </button>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4 backdrop-blur-sm transition-opacity duration-200"
          onClick={handleBackdropClick}
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
                onClick={closeModal} 
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
              {error ? (
                <div className="h-full flex items-center justify-center text-red-500 p-4 text-center">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p className="text-lg">{error}</p>
                  </div>
                </div>
              ) : (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                  {/* Toolbar */}
                  <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex gap-2 items-center">
                      <ZoomOut>
                        {(props) => (
                          <button 
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600" 
                            aria-label="Zoom out"
                            {...props}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="11" cy="11" r="8"></circle>
                              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                              <line x1="8" y1="11" x2="14" y2="11"></line>
                            </svg>
                          </button>
                        )}
                      </ZoomOut>
                      <ZoomIn>
                        {(props) => (
                          <button 
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600" 
                            aria-label="Zoom in"
                            {...props}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="11" cy="11" r="8"></circle>
                              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                              <line x1="11" y1="8" x2="11" y2="14"></line>
                              <line x1="8" y1="11" x2="14" y2="11"></line>
                            </svg>
                          </button>
                        )}
                      </ZoomIn>
                      <EnterFullScreen>
                        {(props) => (
                          <button 
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600" 
                            aria-label="Full screen"
                            {...props}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                            </svg>
                          </button>
                        )}
                      </EnterFullScreen>
                      <Print>
                        {(props) => (
                          <button 
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600" 
                            aria-label="Print"
                            {...props}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 6 2 18 2 18 9"></polyline>
                              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                              <rect x="6" y="14" width="12" height="8"></rect>
                            </svg>
                          </button>
                        )}
                      </Print>
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

                  {/* PDF Viewer */}
                  <div className="h-full">
                    {pdfUrl && (
                      <Viewer
                        fileUrl={pdfUrl}
                        plugins={[
                          toolbarPluginInstance,
                          zoomPluginInstance,
                          fullScreenPluginInstance,
                          printPluginInstance
                        ]}
                        defaultScale={SpecialZoomLevel.PageFit}
                        onDocumentLoad={() => setIsLoading(false)}
                        renderError={(error) => {
                          setIsLoading(false);
                          setError(`Failed to load PDF: ${error.message || 'Unknown error'}`);
                          return (
                            <div className="h-full flex items-center justify-center text-red-500 p-4 text-center">
                              <div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="12" y1="8" x2="12" y2="12"></line>
                                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                <p className="text-lg">Failed to load PDF</p>
                                <p className="text-sm mt-2">Error: {error.message || 'Unknown error'}</p>
                              </div>
                            </div>
                          );
                        }}
                        renderLoader={(percentages) => (
                          <div className="h-full flex items-center justify-center">
                            <div className="w-32 text-center">
                              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-600 transition-all duration-300" 
                                  style={{ width: `${Math.min(percentages, 100)}%` }}
                                ></div>
                              </div>
                              <p className="text-sm text-gray-600 mt-2">
                                Loading: {Math.round(percentages)}%
                              </p>
                            </div>
                          </div>
                        )}
                      />
                    )}
                  </div>
                </Worker>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PDFViewerModal;