import axios from 'axios';
import { Playlist, Track } from '../types';

const API_BASE = '/api/spotify';

export const spotifyService = {
  async getAuthUrl(): Promise<string> {
    const response = await axios.get('/api/auth/url');
    return response.data.url;
  },

  async checkAuthStatus(): Promise<boolean> {
    try {
      const response = await axios.get('/api/auth/status');
      return response.data.isAuthenticated;
    } catch { return false; }
  },

  async getUserProfile(): Promise<{ name: string; imageUrl?: string } | null> {
    try {
      const response = await axios.get(`${API_BASE}/me`);
      return {
        name: response.data.display_name || response.data.id,
        imageUrl: response.data.images?.[0]?.url,
      };
    } catch (e) {
      console.error('getUserProfile error:', e);
      return null;
    }
  },

  async getPlayerState(): Promise<{ track: Track | null; isPlaying: boolean; progressMs: number }> {
    try {
      const response = await axios.get(`${API_BASE}/me/player`);
      if (!response.data || !response.data.item) return { track: null, isPlaying: false, progressMs: 0 };

      const item = response.data.item;
      const track: Track = {
        id: item.id,
        name: item.name,
        album: item.album.name,
        artist: { id: item.artists[0].id, name: item.artists[0].name },
        albumArt: item.album.images[0]?.url || '',
        durationMs: item.duration_ms,
        isPlaying: response.data.is_playing,
        progressMs: response.data.progress_ms,
      };
      return {
        track,
        isPlaying: response.data.is_playing,
        progressMs: response.data.progress_ms,
      };
    } catch (error: any) {
      if (error.response?.status === 204) return { track: null, isPlaying: false, progressMs: 0 };
      console.error('Error fetching player state:', error);
      return { track: null, isPlaying: false, progressMs: 0 };
    }
  },

  async getCurrentTrack(): Promise<Track | null> {
    const { track } = await this.getPlayerState();
    return track;
  },

  async getRecentTracks(): Promise<Track[]> {
    try {
      const response = await axios.get(`${API_BASE}/me/player/recently-played?limit=20`);
      return response.data.items.map((item: any) => ({
        id: item.track.id,
        name: item.track.name,
        album: item.track.album.name,
        artist: { id: item.track.artists[0].id, name: item.track.artists[0].name },
        albumArt: item.track.album.images[0]?.url || '',
        durationMs: item.track.duration_ms,
        playedAt: item.played_at,
      }));
    } catch (error) {
      console.error('Error fetching recent tracks:', error);
      return [];
    }
  },

  async getUserPlaylists(): Promise<Playlist[]> {
    try {
      const [playlistsRes, likedRes] = await Promise.all([
        axios.get(`${API_BASE}/me/playlists?limit=50`),
        axios.get(`${API_BASE}/me/tracks?limit=1`), // just to get the count
      ]);

      const likedSongs: Playlist = {
        id: '__liked_songs__',
        name: '❤️ Músicas Curtidas',
        description: `${likedRes.data.total} faixas`,
        imageUrl: '',
        tracks: [],
      };

      const meRes = await axios.get(`${API_BASE}/me`);
      const playlists: Playlist[] = playlistsRes.data.items
        .filter((item: any) => item != null)
        .map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          imageUrl: item.images?.[0]?.url || '',
          ownerName: item.owner?.display_name || 'Spotify',
          tracks: [],
        }));

      likedSongs.imageUrl = 'https://misc.scdn.co/liked-songs/liked-songs-640.png';
      likedSongs.ownerName = meRes.data.display_name;

      return [likedSongs, ...playlists];
    } catch (error) {
      console.error('Error fetching playlists:', error);
      return [];
    }
  },

  async getPlaylistTracks(playlistId: string): Promise<Track[]> {
    try {
      const isLiked = playlistId === '__liked_songs__';
      let allTracks: Track[] = [];
      let url = isLiked
        ? `${API_BASE}/me/tracks?limit=50`
        : `${API_BASE}/playlists/${playlistId}/tracks?limit=100`;

      while (url) {
        const response = await axios.get(url);
        const items = response.data.items;

        const valid = items
          .filter((item: any) => item?.track?.id)
          .map((item: any) => {
            const track = item.track;
            return {
              id: track.id,
              name: track.name,
              album: track.album.name,
              artist: { id: track.artists[0].id, name: track.artists[0].name },
              albumArt: track.album.images[0]?.url || '',
              durationMs: track.duration_ms,
            };
          });

        allTracks = [...allTracks, ...valid];
        if (allTracks.length >= 100) break;

        const next = response.data.next;
        url = next ? next.replace('https://api.spotify.com/v1', API_BASE) : null;
      }

      return allTracks;
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
      return [];
    }
  },

  async createPlaylist(name: string, description: string, trackUris: string[]): Promise<string | null> {
    try {
      const meResponse = await axios.get(`${API_BASE}/me`);
      const userId = meResponse.data.id;

      const createResponse = await axios.post(
        `/api/spotify/users/${userId}/playlists`,
        { name, description, public: false }
      );
      const playlistId = createResponse.data.id;

      for (let i = 0; i < trackUris.length; i += 100) {
        const chunk = trackUris.slice(i, i + 100);
        await axios.post(`/api/spotify/playlists/${playlistId}/tracks`, { uris: chunk });
      }

      return playlistId;
    } catch (error) {
      console.error('Error creating playlist:', error);
      return null;
    }
  },

  async search(query: string, type: string = 'track,album,artist'): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE}/search`, { params: { q: query, type, limit: 12 } });
      return response.data;
    } catch { return null; }
  },

  async getTopItems(type: 'tracks' | 'artists', timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term'): Promise<any[]> {
    try {
      const response = await axios.get(`${API_BASE}/me/top/${type}`, { params: { time_range: timeRange, limit: 20 } });
      return response.data.items;
    } catch { return []; }
  },

  async getRecommendations(seed_tracks?: string[], seed_artists?: string[], seed_genres?: string[], options: any = {}): Promise<Track[]> {
    try {
      const params: any = { limit: 12, ...options };
      if (seed_tracks?.length) params.seed_tracks = seed_tracks.join(',');
      if (seed_artists?.length) params.seed_artists = seed_artists.join(',');
      if (seed_genres?.length) params.seed_genres = seed_genres.join(',');
      
      const response = await axios.get(`${API_BASE}/recommendations`, { params });
      return (response.data.tracks || []).map((track: any) => ({
        id: track.id,
        name: track.name,
        album: track.album.name,
        artist: { id: track.artists[0].id, name: track.artists[0].name },
        albumArt: (track.album.images && track.album.images[0]) ? track.album.images[0].url : '',
        durationMs: track.duration_ms,
      }));
    } catch { return []; }
  },

  async saveTracks(trackIds: string[]): Promise<void> {
    try {
      await axios.put(`${API_BASE}/me/tracks`, { ids: trackIds });
    } catch (error) {
      console.error('Error saving tracks:', error);
    }
  },

  async play(): Promise<void> {
    try { await axios.put(`${API_BASE}/me/player/play`); } catch {}
  },

  async pause(): Promise<void> {
    try { await axios.put(`${API_BASE}/me/player/pause`); } catch {}
  },

  async next(): Promise<void> {
    try { await axios.post(`${API_BASE}/me/player/next`); } catch {}
  },

  async previous(): Promise<void> {
    try { await axios.post(`${API_BASE}/me/player/previous`); } catch {}
  },

  async logout(): Promise<void> {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
};
