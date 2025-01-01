import { getAllMangaIds, getMangaChapters } from '@/lib/api';
import ChapterPage from './ChapterPage';

// This function is required for static generation with "output: export"
export async function generateStaticParams() {
  const mangaIds = await getAllMangaIds(); // Get all manga IDs

  // Fetch chapters for all manga IDs in parallel
  interface Chapter {
    id: string;
  }

  interface MangaChapters {
    data: Chapter[];
  }

  const chaptersData: MangaChapters[] = await Promise.all(
    mangaIds.map((mangaId: string) => getMangaChapters(mangaId))
  );

  const params = chaptersData.flatMap((chapters, index) => {
    const mangaId = mangaIds[index];
    return chapters.data.map((chapter: { id: string }) => ({
      id: mangaId,
      chapterId: chapter.id,
    }));
  });

  return params.map(({ id, chapterId }) => ({
    params: { id, chapterId },
  }));
}

interface StaticChapterPageProps {
  params: {
    id: any;
    chapterId: any;
  };
}
// @ts-ignore
export default function StaticChapterPage({
  params,
}: {
  params: any;
}) {
  const { id, chapterId } = params;
  return <ChapterPage params={{ id, chapterId }} />;
}
