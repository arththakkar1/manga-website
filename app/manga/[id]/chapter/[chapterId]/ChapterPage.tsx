'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { getChapterPages, getChaptersList } from '@/lib/api'; // Assuming getChaptersList fetches the list of chapters
import { ChapterData } from '@/types/manga';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { id: string, chapterId: string } }) {
  const { chapterId } = await params;
  return { title: `Manga Chapter ${chapterId}` };
}

export default function ChapterPage({ params }: { params: { id: string, chapterId: string } }) {
  const { id, chapterId } = params;
  const [chapterData, setChapterData] = useState<ChapterData | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<number, boolean>>({});
  const [chapters, setChapters] = useState<any[]>([]); // Store list of chapters
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number | null>(null);
  const [isVertical, setIsVertical] = useState(false); // New state to track display mode

  const chapterCache = useRef<Record<string, ChapterData>>({});

  useEffect(() => {
    const fetchChapter = async () => {
      if (chapterCache.current[chapterId]) {
        setChapterData(chapterCache.current[chapterId]);
        return;
      }
      try {
        const data = await getChapterPages(chapterId);
        chapterCache.current[chapterId] = data;
        setChapterData(data);
      } catch (err) {
        setError('Failed to load chapter. Please try again later.');
      }
    };
    fetchChapter();
  }, [chapterId]);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const chapterList = await getChaptersList(id); 
        setChapters(chapterList);
        const currentIndex: number = chapterList.findIndex((chapter: { id: string }) => chapter.id === chapterId);
        setCurrentChapterIndex(currentIndex);
      } catch (err) {
        setError('Failed to load chapters. Please try again later.');
      }
    };
    fetchChapters();
  }, [id, chapterId]);

  const memoizedPages = chapterData?.chapter.data || [];
  const baseUrl = chapterData?.baseUrl || '';

  useEffect(() => {
    if (chapterData) {
      const preloadImages = (pageIndex: number) => {
        if (pageIndex >= 0 && pageIndex < memoizedPages.length) {
          const url = `${baseUrl}/data/${chapterData.chapter.hash}/${memoizedPages[pageIndex]}`;
          const img = new window.Image();
          img.src = url;
        }
      };
      preloadImages(currentPage + 1);
      preloadImages(currentPage + 2);
      preloadImages(currentPage + 3);
    }
  }, [chapterData, currentPage, memoizedPages, baseUrl]);

  const handleImageLoad = (pageIndex: number) => {
    setImageLoadingStates((prevState) => ({
      ...prevState,
      [pageIndex]: false,
    }));
  };

  const updatePage = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const goToNextChapter = () => {
    if (currentChapterIndex !== null && currentChapterIndex < chapters.length - 1) {
      const nextChapterId = chapters[currentChapterIndex + 1].id;
      window.location.href = `/manga/${id}/chapter/${nextChapterId}`;
    }
  };

  const goToPrevChapter = () => {
    if (currentChapterIndex !== null && currentChapterIndex > 0) {
      const prevChapterId = chapters[currentChapterIndex - 1].id;
      window.location.href = `/manga/${id}/chapter/${prevChapterId}`;
    }
  };

  const toggleDisplayMode = () => {
    setIsVertical((prev) => !prev);
  };

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!chapterData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentPageUrl = chapterData && memoizedPages[currentPage] 
    ? `${baseUrl}/data/${chapterData.chapter.hash}/${memoizedPages[currentPage]}`
    : '';

  return (
    <div className="min-h-screen bg-black flex flex-col pt-2">
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-10 bg-background/40 backdrop-blur-sm rounded-full px-4 py-2">
        <span className="text-sm font-medium text-black">
          Page {currentPage + 1} of {memoizedPages.length}
        </span>
      </div>

      <div className="flex-1 flex items-center flex-col justify-center p-4 relative">
        <div className="relative max-w-4xl w-full mx-auto flex justify-center items-center">
          
          {imageLoadingStates[currentPage] && (
            <div className="absolute inset-0 flex justify-center items-center bg-black/50 z-10">
              <span className="text-white">Loading...</span>
            </div>
          )}

          <Image
            key={currentPage}
            src={currentPageUrl}
            alt={`Page ${currentPage + 1}`}
            width="0"
            height="0"
            sizes="100vw"
            style={{ width: '500px', height: 'auto' }}
            priority
            onLoad={() => handleImageLoad(currentPage)}
            onError={(e) => {
              e.currentTarget.src = '/path/to/placeholder-image.jpg'; 
            }}
          />

          {/* Only show navigation buttons if not in vertical mode */}
          {!isVertical && currentPage > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
              onClick={() => updatePage(currentPage - 1)}
            >
              <ChevronLeft className="h-8 w-8 text-black sm:hover:text-black sm:text-white" />
            </Button>
          )}

          {!isVertical && currentPage < memoizedPages.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
              onClick={() => updatePage(currentPage + 1)}
            >
              <ChevronRight className="h-8 w-8 text-black sm:hover:text-black sm:text-white" />
            </Button>
          )}
        </div>

        {/* Toggle Display Mode Button */}
        <Button
          onClick={toggleDisplayMode}
          className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-full"
        >
          Switch to {isVertical ? 'Horizontal' : 'Vertical'} View
        </Button>

        {/* Image Display Mode */}
        <div
          className={`flex ${isVertical ? 'flex-col' : 'flex-row'} items-center justify-center mt-4`}
        >
          {memoizedPages.map((page, index) => (
            <div key={index} className="relative w-full max-w-full mt-4">
              <Image
                src={`${baseUrl}/data/${chapterData.chapter.hash}/${page}`}
                alt={`Page ${index + 1}`}
                width="500"
                height={0}
                priority
                onLoad={() => handleImageLoad(index)}
                onError={(e) => {
                  e.currentTarget.src = '/path/to/placeholder-image.jpg';
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-5 w-full px-4 py-2">
          {currentChapterIndex !== 0 && (
            <button
              onClick={goToPrevChapter}
              className='flex justify-center items-center text-sm sm:text-base p-2 sm:p-4 sm:border-none rounded-full bg-transparent border border-gray-300'
            >
              <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8 sm:hover:text-black text-white" />
              <span className="hidden sm:inline-block ml-2">Go to Previous Chapter</span>
            </button>
          )}

          <Link href={`/manga/${id}`}>
            <button className='flex hover:bg-white hover:text-black p-2 px-4 rounded-full justify-center items-center mt-3'>
              Back to Manga Details
            </button>
          </Link>

          {currentChapterIndex !== null && currentChapterIndex < chapters.length - 1 && (
            <button
              onClick={goToNextChapter}
              className='flex justify-center sm:border-none items-center text-sm sm:text-base p-2 sm:p-4 rounded-full bg-transparent border border-gray-300 '
            >
              <span className="hidden sm:inline-block mr-2">Go to Next Chapter</span>
              <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8 sm:hover:text-black text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
