import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure worker for react-pdf - using local file copied to public folder
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PDFSlideshowProps {
    pdfUrl: string;
    interval?: number;
    className?: string;
}

const PDFSlideshow: React.FC<PDFSlideshowProps> = ({
    pdfUrl,
    interval = 3000,
    className = ""
}) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [loadError, setLoadError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number>(300);

    // Measure container width for responsive scaling
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    // Handle PDF load success
    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        console.log('[PDFSlideshow] Loaded PDF with', numPages, 'pages');
        setNumPages(numPages);
        setCurrentPage(1);
        setStatus('ready');
    };

    // Handle PDF load error
    const onDocumentLoadError = (error: Error) => {
        console.error('[PDFSlideshow] Failed to load PDF:', error);
        setLoadError(error.message);
        setStatus('error');
    };

    // Slideshow interval logic - 10s for first slide, 2s for others
    useEffect(() => {
        if (numPages <= 1 || status !== 'ready') return;

        const getDelay = () => currentPage === 1 ? 10000 : 2000;

        const timer = setTimeout(() => {
            setCurrentPage((prev) => (prev >= numPages ? 1 : prev + 1));
        }, getDelay());

        return () => clearTimeout(timer);
    }, [numPages, status, currentPage]);

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden bg-ink/5 flex items-center justify-center ${className}`}
        >
            {status === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-10">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-ink/40 animate-pulse">Loading Preview...</p>
                </div>
            )}

            {status === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50/20 z-10 p-4 text-center">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-red-500 mb-1">Preview Unavailable</p>
                    <p className="text-[8px] text-red-400 opacity-70 line-clamp-2">{loadError}</p>
                </div>
            )}

            <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={null}
                error={null}
                className="flex items-center justify-center w-full"
            >
                <Page
                    pageNumber={currentPage}
                    width={containerWidth}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="shadow-lg transition-opacity duration-300"
                    loading={null}
                />
            </Document>

            {/* Page indicator */}
            {status === 'ready' && numPages > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                    {Array.from({ length: numPages }, (_, i) => (
                        <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i + 1 === currentPage ? 'bg-accent w-3' : 'bg-ink/20'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PDFSlideshow;
