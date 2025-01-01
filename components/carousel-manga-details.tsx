import Image from 'next/image';
import { Manga } from '@/types/manga';
import { getCoverImage } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from './ui/button';

export default function MangaDetails({ manga }: { manga: Manga }) {
  interface Relationship {
    type: string;
    attributes?: {
      fileName?: string;
    };
  }

  interface MangaDetailsProps {
    manga: Manga;
  }

  const coverFile: string | undefined = manga.relationships?.find(
    (rel: Relationship) => rel.type === 'cover_art'
  )?.attributes?.fileName;

  return (
    <div className="flex flex-row gap-8  ">
      <div className="w-full my-5 md:w-1/3 lg:w-1/4">
        {coverFile && (
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
            <Image
              src={getCoverImage(manga.id, coverFile)}
              alt={manga.attributes.title.en}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
        )}
      </div>
      
      <div className="flex-1 flex gap-y-3 justify-center flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-bold">{manga.attributes.title.en}</h1>

        <p className="text-gray-200 hidden whitespace-pre-line lg:flex">
          {manga.attributes.description.en.slice(0, 200)}...
        </p>

        <Link 
          href={`/manga/${manga.id}`}>
            <Button
            variant={"carousel"}
            className='bg-white text-[12px]'
            >
            Read Manga Now

            </Button>
        </Link>
      </div>
    </div>
  );
}