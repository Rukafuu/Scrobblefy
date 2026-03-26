export interface AudioFeatures {
  energy: number;
  valence: number;
  tempo: number;
  danceability: number;
  instrumentalness: number;
}

export interface Artist {
  id: string;
  name: string;
}

export interface Track {
  id: string;
  name: string;
  album: string;
  albumArt: string;
  artist: Artist;
  durationMs: number;
  playedAt?: string; // ISO date string
  features?: AudioFeatures;
}

export interface Insight {
  id: string;
  type: 'curation' | 'stat' | 'mood';
  content: string;
  icon?: string;
}