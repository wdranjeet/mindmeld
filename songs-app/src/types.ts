export interface Song {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  url: string;
  duration?: string;
  artist?: string;
  album?: string;
}

export interface SearchResult {
  songs: Song[];
  total: number;
}

export interface JioSaavnImage {
  link: string;
}

export interface JioSaavnDownloadUrl {
  link: string;
}

export interface JioSaavnAlbum {
  name: string;
}

export interface JioSaavnSong {
  id: string;
  name?: string;
  title?: string;
  primaryArtists?: string;
  subtitle?: string;
  image?: JioSaavnImage[];
  downloadUrl?: JioSaavnDownloadUrl[];
  url?: string;
  duration?: string;
  artist?: string;
  album?: JioSaavnAlbum;
}

export interface JioSaavnApiResponse {
  data: {
    results: JioSaavnSong[];
    total: number;
  };
}
