import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import { getCoverImage, getMangaDetails } from "@/lib/api";
import MangaDetails from "./carousel-manga-details";

import { Manga } from "@/types/manga";

interface CarouselProps {
  mangaIds: string[];
}

export function CarouselPlugin({ mangaIds }: CarouselProps) {
  const [mangas, setMangas] = React.useState<Manga[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchMangas = async () => {
      try {
        const mangaDetails = await Promise.all(
          mangaIds.map((id) => getMangaDetails(id))
        );
        setMangas(mangaDetails.map((manga) => manga.data));
        setLoading(false);
      } catch (err) {
        setError("Failed to load manga details");
        setLoading(false);
      }
    };

    fetchMangas();
  }, [mangaIds]);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Carousel
      plugins={[plugin.current]}
      className="relative w-full h-[400px] px-5 max-w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselPrevious className="absolute left-[-30px] top-[220px] -translate-y-1/2 z-10" />

      <CarouselContent>
        {mangas.map((manga) => {
          const title = manga?.attributes?.title?.en || "Untitled Manga";

          interface Relationship {
            type: string;
            attributes: {
              fileName: string;
            };
          }

          interface MangaAttributes {
            title: {
              en: string;
            };
          }

          interface MangaData {
            id: string;
            attributes: MangaAttributes;
            relationships: Relationship[];
          }

          const coverFile: string | undefined =
            (manga as MangaData)?.relationships?.find((rel: Relationship) => rel.type === "cover_art")
              ?.attributes?.fileName;
          const coverImageUrl = coverFile
            ? getCoverImage(manga.id, coverFile)
            : "/path/to/placeholder-image.jpg";

          return (
            <CarouselItem key={manga.id}>
              <div className="relative">
                <Card className="overflow-hidden relative">
                  <CardContent
                    className={`flex w-full relative bg-cover bg-center h-[400px] items-center justify-center`}
                    style={{ backgroundImage: `url(${coverImageUrl})` }}
                  >
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className="absolute text-white p-4">
                      <MangaDetails manga={manga} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>

      <CarouselNext className="absolute right-[-57px] top-[220px] -translate-y-1/2 z-10" />
    </Carousel>
  );
}
