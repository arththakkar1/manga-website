export interface Manga {
  relationships: any;
  id: string;
  type: string;
  attributes: {
    title: {
      en: string;
      [key: string]: string;
    };
    description: {
      en: string;
      [key: string]: string;
    };
    year: number | null;
    status: string;
    contentRating: string;
    tags: Array<{
      id: string;
      type: string;
      attributes: {
        name: {
          en: string;
        };
      };
    }>;
    originalLanguage: string;
    coverArt?: string;
  };
}

export interface Chapter {
  id: string;
  type: string;
  attributes: {
    volume: string | null;
    chapter: string | null;
    title: string | null;
    translatedLanguage: string;
    pages: number;
    publishAt: string;
  };
  relationships: Array<{
    id: string;
    type: string;
  }>;
}

export interface ChapterData {
  baseUrl: string;
  chapter: {
    hash: string;
    data: string[];
    dataSaver: string[];
  };
}