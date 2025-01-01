
import Link from 'next/link';
import { Chapter } from '@/types/manga';

export default function ChapterList({
  chapters,
  mangaId,
}: {
  chapters: Chapter[];
  mangaId: string;
}) {

  const chapter = chapters.sort((a, b) => {
    const chapterA = parseInt(a.attributes.chapter ?? '0', 10);
    const chapterB = parseInt(b.attributes.chapter ?? '0', 10);
    return chapterA - chapterB;
  });
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Chapters</h2>
      <div className="grid gap-2">
        {chapter.map((chapter) => (
          <Link
            key={chapter.id}
            href={`/manga/${mangaId}/chapter/${chapter.id}`}
            className="flex items-center justify-between p-4 text-white bg-black border-gray-500 rounded-lg"
          >
            <div>
              <span className="font-semibold">
                Chapter {chapter.attributes.chapter}
              </span>
              {chapter.attributes.title && (
                <span className="ml-2 text-muted-foreground">
                  - {chapter.attributes.title}
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {new Date(chapter.attributes.publishAt).toLocaleDateString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}