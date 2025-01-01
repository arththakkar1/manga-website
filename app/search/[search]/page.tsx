// File: search/[search]/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Manga } from '@/types/manga';

import MangaGrid from '@/components/manga-grid';
import Loading from '@/components/Loading';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { fetchTagList, searchManga } from '@/lib/api';

export default function SearchPage() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Manga[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<{ attributes: { name: { en: string } } }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await fetchTagList();
        setTags(data.data);
      } catch (err) {
        console.error('Failed to fetch tags', err);
        setError('Failed to fetch tags. Please try again later.');
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    const pathParts = pathname.split('/');
    const query = pathParts[2] || ''; // The search query is in the 3rd part of the URL
    const tagString = pathParts[3] || ''; // Tags are in the 4th part of the URL

    const tagsArray = tagString.split(',').filter(Boolean); // Split tags by comma and filter empty values
    setSearchQuery(query);
    setSelectedTags(tagsArray);

    if (query) {
      fetchSearchResults(query, tagsArray);
    }
  }, [pathname]);

  const fetchSearchResults = async (query: string, tags: string[]) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchManga(query);

      const filteredResults = results.filter((manga: Manga) => {
        const mangaTags = manga.attributes.tags.map(
          (mangaTag) => mangaTag.attributes.name.en
        );

        if (mangaTags.includes("Doujinshi")) {
          return false;
        }

        return tags.every((tag) => mangaTags.includes(tag));
      });

      setSearchResults(filteredResults);
      setError(null);
    } catch (err) {
      setError("Failed to fetch search results. Please try again.");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateURL = (query: string, tags: string[]) => {
    const newURL = `/search/${query}${tags.length > 0 ? `/${tags.join(',')}` : ''}`;
    window.history.pushState({}, '', newURL); // Update the URL without reloading the page
  };

  const handleSearch = () => {
    updateURL(searchQuery, selectedTags);
    fetchSearchResults(searchQuery, selectedTags);
  };

  const handleTagClick = (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updatedTags);
    updateURL(searchQuery, updatedTags);
    fetchSearchResults(searchQuery, updatedTags);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="justify-center items-center mb-16 flex flex-col sm:flex-row">
        <input
          type="text"
          placeholder="Search manga..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
          className="w-full h-[40px] bg-transparent p-2 outline-none"
        />
        <div className="mb-4">
          <button
            onClick={handleSearch}
            className="mt-2 p-2 bg-white sm:px-20 text-black rounded-full px-4"
          >
            Search
          </button>
        </div>
      </div>

      <div className="mb-4 flex justify-between">
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
                  {tags.map((tag) => (
                    <CommandItem
                      key={tag.attributes.name.en}
                      value={tag.attributes.name.en}
                      onSelect={() => handleTagClick(tag.attributes.name.en)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedTags.includes(tag.attributes.name.en) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {tag.attributes.name.en}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {isLoading ? (
        <div className="text-center">
          <Loading />
        </div>
      ) : (
        searchResults.length > 0 && (
          <MangaGrid mangas={searchResults} searchQuery={searchQuery} selectedTags={selectedTags} />
        )
      )}
    </main>
  );
}
