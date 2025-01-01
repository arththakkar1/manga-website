import { getPopularManga } from '@/lib/api';
import { Manga } from '@/types/manga';
import HomeClient from '@/components/HomeClient';

export default async function Home() {
  const data = await getPopularManga();
  const mangas: Manga[] = data.data;

  return (
    <div className="bg-black text-white">
      <HomeClient mangas={mangas} />
    </div>
  );
}