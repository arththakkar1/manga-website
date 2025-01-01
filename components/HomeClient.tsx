'use client';

import { useState, useMemo, useEffect } from 'react';
import MangaGrid from '@/components/manga-grid';
import { Manga } from '@/types/manga';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CarouselPlugin } from '@/components/carousel-plugin';

interface HomeClientProps {
  mangas: Manga[];
}

const FavManga:any = [
  
  "801513ba-a712-498c-8f57-cae55b38cc92",
  "d1a9fdeb-f713-407f-960c-8326b586e6fd",
  "5d1fc77e-706a-4fc5-bea8-486c9be0145d",
  "c52b2ce3-7f95-469c-96b0-479524fb7a1a",
  "0d545e62-d4cd-4e65-a65c-a5c46b794918",
  "74753c8f-70de-4f52-b7f0-67eccdbd0a2f"

]

export default function HomeClient({ mangas }: HomeClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const uniqueTags = useMemo(() => {
    return Array.from(
      new Set(
        mangas.flatMap((manga) =>
          manga.attributes.tags.map((tag) => tag.attributes.name.en)
        )
      )
    ).map((tag) => ({ value: tag, label: tag }));
  }, [mangas]);

  const toggleTagSelection = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  return (
    <main className="container mx-auto">
      <div className="relative w-full h-[400px] px-5 max-w-full">
        <CarouselPlugin mangaIds={FavManga} />
      </div>
      <div className='text-white w-full  text-3xl my-5 sm:text-6xl p-8 mb-4 font-bold flex justify-center items-center'>
        Popular Mangas
      </div>
      <div className="mb-6 flex px-3 justify-between">
        <h2 className="text-2xl font-bold mb-2">Tags</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={selectedTags.length > 0}
              className="w-[200px] justify-between bg-black"
            >
              {selectedTags.length > 0
                ? selectedTags.join(', ')
                : "Select tags..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] bg-black p-0">
            <Command>
              <CommandInput placeholder="Search tags..." />
              <CommandList>
                <CommandEmpty>No tags found.</CommandEmpty>
                <CommandGroup>
                  {uniqueTags.map((tag) => (
                    <CommandItem
                      key={tag.value}
                      value={tag.value}
                      onSelect={() => toggleTagSelection(tag.value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedTags.includes(tag.value) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {tag.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <MangaGrid
        mangas={mangas.filter((manga) =>
          selectedTags.length > 0
            ? selectedTags.every((selectedTag) =>
                manga.attributes.tags.some((tag) => tag.attributes.name.en === selectedTag)
              )
            : true
        )}
        searchQuery={debouncedSearchQuery}
        selectedTags={selectedTags}
      />
    </main>
  );
}
