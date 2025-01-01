import Image from 'next/image';
import { Manga } from '@/types/manga';
import { getCoverImage } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

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
    <div className="flex flex-col md:flex-row gap-8 mb-8">
      <div className="w-full md:w-1/3 lg:w-1/4">
        {coverFile && (
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
            <Image
              src={getCoverImage(manga.id, coverFile)}
              alt={manga.attributes.title.en|| 'Manga Cover'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-4">{manga.attributes.title.en}</h1>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {manga.attributes.tags.map((tag) => (
            <Badge key={tag.id} className='cursor-pointer' variant="secondary">
              {tag.attributes.name.en}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-muted-foreground">Status:</span>
            <span className="ml-2 capitalize">{manga.attributes.status}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Year:</span>
            <span className="ml-2">{manga.attributes.year || 'N/A'}</span>
          </div>
        </div>

        <p className="text-muted-foreground whitespace-pre-line">
          {manga.attributes.description.en}
        </p>
      </div>
    </div>
  );
}