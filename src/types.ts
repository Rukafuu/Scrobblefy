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
  artist: Artist;
  albumArt: string;
  durationMs: number;
  progressMs?: number;
  isPlaying?: boolean;
  playedAt?: string;
  features?: AudioFeatures;
  playCounts?: {
    '1m'?: number;
    '3m'?: number;
    '6m'?: number;
    '1y'?: number;
    plays?: number;
    lastfm?: boolean;
  };
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  ownerName?: string;
  tracks: Track[];
}

export interface Insight {
  id: string;
  type: 'curation' | 'stat' | 'alert';
  content: string;
  icon: string;
}

export interface PlayerState {
  track: Track | null;
  isPlaying: boolean;
  progressMs: number;
  durationMs: number;
}
