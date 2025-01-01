import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Manga } from '@/types/manga';
import { getCoverImage } from '@/lib/api';
import Loading from './Loading';

interface MangaGridProps {
  mangas: Manga[];
  searchQuery: string;
  selectedTags: string[];
}

interface Relationship {
  type: string;
  attributes: {
    fileName?: string;
  };
}

export default function MangaGrid({ mangas, searchQuery, selectedTags }: MangaGridProps) {
  const filteredMangas = mangas.filter((manga) => { 
    const title =
    manga.attributes.title.en ||
    'Untitled Manga';

    
    const matchesSearchQuery = title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.every((tag) =>
      manga.attributes.tags.some((mangaTag) => mangaTag.attributes.name.en === tag)
    );
    return matchesSearchQuery && matchesTags;
  });

  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>(
    filteredMangas.reduce((acc, manga) => {
      acc[manga.id] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const handleImageLoad = (mangaId: string) => {
    setImageLoadingStates((prevState) => ({
      ...prevState,
      [mangaId]: false,
    }));
  };

  if (filteredMangas.length === 0) {
    return <p className="text-center text-gray-500">No mangas found matching your criteria.</p>;
  }

  return (
    <div className="grid px-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {filteredMangas.map((manga) => {
        const coverFile: string | undefined = manga.relationships?.find(
          (rel: Relationship) => rel.type === 'cover_art'
        )?.attributes?.fileName;

        const title = manga.attributes.title.en || 'Untitled Manga';
        const altText = `Cover image for ${title}`;
        const coverImageUrl = coverFile ? getCoverImage(manga.id, coverFile) : '';
        const imageLoading = imageLoadingStates[manga.id];

        return (
          <Link
            key={manga.id}
            href={`/manga/${manga.id}`}
            className="group relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
          >
            <div className="aspect-[2/3] relative">
              {coverFile ? (
                <>
                  {imageLoading && (
                    <div className="w-full h-full bg-gray-300 flex justify-center items-center absolute inset-0 z-10">
                      <span className="text-white"><Loading/></span>
                    </div>
                  )}
                  <Image
                    src={coverImageUrl || '/path/to/placeholder-image.jpg'} 
                    alt={altText}
                    fill
                    className="object-cover"
                    priority
                    onLoad={() => handleImageLoad(manga.id)}
                    onError={(e) => {
                      e.currentTarget.src = '/path/to/placeholder-image.jpg'; 
                    }}
                  />
                </>
              ) : (
                <div className="w-full h-full bg-gray-300 flex justify-center items-center">
                  <span>Image not available</span>
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 text-black bg-background/20 backdrop-blur-sm bg-opacity-50 p-2 text-center">
              {imageLoading ? 'Loading...' : title.length > 30 ? `${title.slice(0, 30)}...` : title}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
