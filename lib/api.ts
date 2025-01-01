const BASE_URL = 'https://api.mangadex.org';


export async function getAllMangaIds() {
  const response = await fetch('https://api.mangadex.org/manga?limit=100&contentRating[]=safe&contentRating[]=suggestive');
  const data = await response.json();
  return data.data.map((manga: { id: string }) => manga.id);
}

export async function getChapterPagesForDownload(chapterId: string) {
  try {
    const response = await fetch(`${BASE_URL}/at-home/server/${chapterId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching chapter pages:', error);
    throw error;
  }
}



export const getChaptersList = async (mangaId: string) => {
  try {
    const response = await fetch(`https://api.mangadex.org/manga/${mangaId}/feed?limit=500&translatedLanguage[]=en`);
    if (!response.ok) {
      throw new Error('Failed to fetch chapters');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching chapters:', error);
    throw error;
  }
};

export async function getRandomManga() {
  const response=await fetch('https://api.mangadex.org/manga/random');
  return response.json();
}

export const fetchTagList = async () => {
  const response = await fetch("https://api.mangadex.org/manga/tag");
  return response.json();
};

export async function getPopularManga(limit = 20) {
  const response = await fetch(
    `${BASE_URL}/manga?limit=${limit}&order[followedCount]=desc&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive`
  );
  return response.json();
}

export async function getMangaDetails(id: string) {
  const response = await fetch(
    `${BASE_URL}/manga/${id}?includes[]=cover_art&includes[]=author&includes[]=artist`
  );
  return response.json();
}

export async function getMangaChapters(mangaId: string) {
  const response = await fetch(`https://api.mangadex.org/chapter?manga=${mangaId}&translatedLanguage[]=en&limit=100`);
  const data = await response.json();
  return data;
}

export async function getChapterPages(chapterId: string) {
  try {
    const response = await fetch(`${BASE_URL}/at-home/server/${chapterId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching chapter pages:', error);
    throw error;
  }
}

export function getCoverImage(mangaId: string, filename: string) {
  return `https://uploads.mangadex.org/covers/${mangaId}/${filename}`;
}

export async function searchManga(query: string, limit = 50) {
  const response = await fetch(
    `${BASE_URL}/manga?title=${query}&limit=${limit}&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive`
  );
  const data = await response.json();
  return data.data;
}