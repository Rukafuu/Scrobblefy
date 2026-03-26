
export const currentTrack = {
  id: '1',
  name: 'Soviet Loli Anthem',
  album: 'Memes of Production',
  artist: { id: 'a1', name: 'Slander' },
  albumArt: 'https://picsum.photos/600/600?grayscale', // Using grayscale for that moody vibe
  durationMs: 215000,
  features: {
    energy: 0.85,
    valence: 0.45,
    tempo: 128,
    danceability: 0.72,
    instrumentalness: 0.02
  }
};

export const recentTracks = [
  {
    id: '1',
    name: 'Soviet Loli Anthem',
    album: 'Memes of Production',
    artist: { id: 'a1', name: 'Slander' },
    albumArt: 'https://picsum.photos/600/600?grayscale',
    durationMs: 215000,
    playedAt: new Date().toISOString(),
    features: { energy: 0.85, valence: 0.45, tempo: 128, danceability: 0.72, instrumentalness: 0.02 }
  },
  {
    id: '2',
    name: 'Midnight City',
    album: 'Hurry Up, We\'re Dreaming',
    artist: { id: 'a2', name: 'M83' },
    albumArt: 'https://picsum.photos/id/10/50/50',
    durationMs: 243000,
    playedAt: '2023-10-27T10:30:00Z',
    features: { energy: 0.7, valence: 0.6, tempo: 105, danceability: 0.6, instrumentalness: 0.1 }
  },
  {
    id: '3',
    name: 'After Dark',
    album: 'Total',
    artist: { id: 'a3', name: 'Mr. Kitty' },
    albumArt: 'https://picsum.photos/id/20/50/50',
    durationMs: 250000,
    playedAt: '2023-10-27T10:15:00Z',
    features: { energy: 0.55, valence: 0.3, tempo: 110, danceability: 0.5, instrumentalness: 0.0 }
  },
  {
    id: '4',
    name: 'Resonance',
    album: 'Home',
    artist: { id: 'a4', name: 'Home' },
    albumArt: 'https://picsum.photos/id/30/50/50',
    durationMs: 212000,
    playedAt: '2023-10-27T09:55:00Z',
    features: { energy: 0.6, valence: 0.8, tempo: 95, danceability: 0.7, instrumentalness: 0.8 }
  },
  {
    id: '5',
    name: 'Gosh',
    album: 'In Colour',
    artist: { id: 'a5', name: 'Jamie xx' },
    albumArt: 'https://picsum.photos/id/40/50/50',
    durationMs: 291000,
    playedAt: '2023-10-27T09:40:00Z',
    features: { energy: 0.8, valence: 0.5, tempo: 130, danceability: 0.8, instrumentalness: 0.6 }
  },
  {
    id: '6',
    name: 'Nightcall',
    album: 'OutRun',
    artist: { id: 'a6', name: 'Kavinsky' },
    albumArt: 'https://picsum.photos/id/50/50/50',
    durationMs: 258000,
    playedAt: '2023-10-27T09:32:00Z',
    features: { energy: 0.4, valence: 0.2, tempo: 90, danceability: 0.4, instrumentalness: 0.05 }
  }
];

export const playlists = [
  {
    id: 'p1',
    name: 'Liked Songs',
    tracks: [
      {
        id: '2',
        name: 'Midnight City',
        album: 'Hurry Up, We\'re Dreaming',
        artist: { id: 'a2', name: 'M83' },
        albumArt: 'https://picsum.photos/id/10/50/50',
        durationMs: 243000,
        features: { energy: 0.7, valence: 0.6, tempo: 105, danceability: 0.6, instrumentalness: 0.1 },
        playCounts: { '1m': 5, '3m': 15, '6m': 30, '1y': 50 }
      },
      {
        id: '3',
        name: 'After Dark',
        album: 'Total',
        artist: { id: 'a3', name: 'Mr. Kitty' },
        albumArt: 'https://picsum.photos/id/20/50/50',
        durationMs: 250000,
        features: { energy: 0.55, valence: 0.3, tempo: 110, danceability: 0.5, instrumentalness: 0.0 },
        playCounts: { '1m': 2, '3m': 8, '6m': 12, '1y': 20 }
      },
      {
        id: '4',
        name: 'Resonance',
        album: 'Home',
        artist: { id: 'a4', name: 'Home' },
        albumArt: 'https://picsum.photos/id/30/50/50',
        durationMs: 212000,
        features: { energy: 0.6, valence: 0.8, tempo: 95, danceability: 0.7, instrumentalness: 0.8 },
        playCounts: { '1m': 10, '3m': 25, '6m': 45, '1y': 80 }
      }
    ]
  },
  {
    id: 'p2',
    name: 'Synthwave Essentials',
    tracks: [
      {
        id: '6',
        name: 'Nightcall',
        album: 'OutRun',
        artist: { id: 'a6', name: 'Kavinsky' },
        albumArt: 'https://picsum.photos/id/50/50/50',
        durationMs: 258000,
        features: { energy: 0.4, valence: 0.2, tempo: 90, danceability: 0.4, instrumentalness: 0.05 },
        playCounts: { '1m': 1, '3m': 3, '6m': 5, '1y': 10 }
      },
      {
        id: '7',
        name: 'Turbo Killer',
        album: 'The Uncanny Valley',
        artist: { id: 'a7', name: 'Carpenter Brut' },
        albumArt: 'https://picsum.photos/id/60/50/50',
        durationMs: 208000,
        features: { energy: 0.9, valence: 0.4, tempo: 160, danceability: 0.6, instrumentalness: 0.7 },
        playCounts: { '1m': 12, '3m': 40, '6m': 70, '1y': 120 }
      }
    ]
  }
];

export const liraInsights = [
  {
    id: 'i1',
    type: 'curation',
    content: 'Your listening patterns suggest a gravitation towards high-energy electronic tracks in the morning. "Soviet Loli Anthem" shares a 92% audio profile similarity with your top track this week.',
    icon: 'sparkles'
  },
  {
    id: 'i2',
    type: 'stat',
    content: 'You have listened to Slander for 42 minutes today.',
    icon: 'chart'
  }
];
