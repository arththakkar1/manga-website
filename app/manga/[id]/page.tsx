import { getAllMangaIds, getMangaDetails, getMangaChapters } from '@/lib/api';
import ChapterList from '@/components/chapter-list';
import MangaDetails from '@/components/manga-details';

// This function is required for static generation with "output: export"
export async function generateStaticParams() {
  const mangaIds = await getAllMangaIds();

  const additionalIds = ['801513ba-a712-498c-8f57-cae55b38cc92'];
  const uniqueIds = Array.from(new Set([...mangaIds, ...additionalIds]));

  return uniqueIds.map((id: string) => ({ params: { id } }));
}

// Type for params
type tParams = Promise<{ id: string }>;

export default async function MangaPage({
  params,
}: {
  params: tParams;
}) {
  // Await params to resolve the promise
  const { id } = await params;

  // Fetch manga and chapters data during server-side rendering
  const [mangaData, chaptersData] = await Promise.all([
    getMangaDetails(id),
    getMangaChapters(id),
  ]);

  const manga = mangaData?.data || null;
  const chapters = chaptersData?.data || null;

  return (
    <div className="container mx-auto px-4 py-8">
      <MangaDetails manga={manga} />
      <ChapterList chapters={chapters} mangaId={id} />
    </div>
  );
}
