import axios from 'axios';

const API_BASE = '/api/lastfm';

export const lastfmService = {
  async getTrackInfo(artist: string, track: string, username: string): Promise<any> {
    try {
      const response = await axios.get(API_BASE, {
        params: {
          method: 'track.getInfo',
          artist: artist,
          track: track,
          user: username
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Last.fm track info:', error);
      return null;
    }
  },

  async getUserPlayCount(artist: string, track: string, username: string): Promise<number> {
    const info = await this.getTrackInfo(artist, track, username);
    if (info && info.track && info.track.userplaycount) {
      return parseInt(info.track.userplaycount, 10);
    }
    return 0;
  },

  async getSimilarTracks(artist: string, track: string, limit: number = 10): Promise<any[]> {
    try {
      const response = await axios.get(API_BASE, {
        params: {
          method: 'track.getSimilar',
          artist: artist,
          track: track,
          limit: limit
        }
      });
      return response.data?.similartracks?.track || [];
    } catch (error) {
      console.error('Error fetching Last.fm similar tracks:', error);
      return [];
    }
  },

  async getSimilarArtists(artist: string, limit: number = 10): Promise<any[]> {
    try {
      const response = await axios.get(API_BASE, {
        params: {
          method: 'artist.getSimilar',
          artist: artist,
          limit: limit
        }
      });
      return response.data?.similarartists?.artist || [];
    } catch (error) {
      console.error('Error fetching Last.fm similar artists:', error);
      return [];
    }
  },

  scrobble: async (artist: string, track: string, album?: string) => {
    try {
      const response = await axios.post('/api/lastfm/scrobble', {
        artist,
        track,
        album,
        timestamp: Math.floor(Date.now() / 1000)
      });
      return response.data;
    } catch (error) {
      console.error('Error scrobbling to Last.fm:', error);
      return null;
    }
  },

  updateNowPlaying: async (artist: string, track: string, album?: string) => {
    try {
      await axios.post('/api/lastfm/nowplaying', { artist, track, album });
    } catch (error) {
      // Non-critical, ignore
    }
  },

  getAuthUrl: async () => {
    const response = await axios.get('/api/auth/lastfm/url');
    return response.data.url;
  },

  checkAuthStatus: async () => {
    try {
      const response = await axios.get('/api/auth/lastfm/status');
      return response.data;
    } catch (error) {
      return { isConnected: false, username: null };
    }
  }
};
