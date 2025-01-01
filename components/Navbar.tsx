"use client"

import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/lib/logo.png';

function Navbar() {
  const fetchRandomManga = async () => {
    try {
      const response = await fetch('https://api.mangadex.org/manga/random');
      const data = await response.json();
      const randomMangaId = data.data.id;
      window.location.href = `/manga/${randomMangaId}`;
    } catch (error) {
      console.error('Failed to fetch random manga:', error);
    }
  };

  return (
    <div>
      <div className='flex p-5 flex-col sm:flex-row justify-between items-center w-full mb-8'>
        <Link
        href={'/'}
        
        className="text-4xl font-bold text-center sm:text-left mb-4 sm:mb-0">
          <Image
          src={logo}
          alt='MangaDex'
          width={130}
          height={100}
          />
            
        </Link>
        <div className='flex gap-x-4 text-black sm:text-white sm:gap-x-8'>
          <Button
            onClick={fetchRandomManga} 
            variant={'ghost'}
          >
            Random Manga
          </Button>
          <Link href="/search">
            <Button variant={'ghost'}>
              Search
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;