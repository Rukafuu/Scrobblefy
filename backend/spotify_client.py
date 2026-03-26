import time
import os
import spotipy
from spotipy.oauth2 import SpotifyOAuth

class SpotifyClient:
    def __init__(self):
        # Ensure environment variables are set:
        # SPOTIPY_CLIENT_ID, SPOTIPY_CLIENT_SECRET, SPOTIPY_REDIRECT_URI
        scope = "user-read-currently-playing user-read-playback-state user-read-recently-played"
        
        self.auth_manager = SpotifyOAuth(scope=scope, open_browser=False)
        self.sp = spotipy.Spotify(auth_manager=self.auth_manager)
        
    def refresh_if_needed(self):
        token_info = self.auth_manager.get_cached_token()
        if self.auth_manager.is_token_expired(token_info):
            self.auth_manager.refresh_access_token(token_info['refresh_token'])
            self.sp = spotipy.Spotify(auth_manager=self.auth_manager)

    def get_current_playing(self):
        self.refresh_if_needed()
        try:
            return self.sp.current_user_playing_track()
        except Exception as e:
            print(f"API Error: {e}")
            return None

    def get_audio_features(self, track_id):
        self.refresh_if_needed()
        try:
            return self.sp.audio_features([track_id])[0]
        except Exception as e:
            print(f"Features Error: {e}")
            return None

    def get_track_info(self, track_id):
        self.refresh_if_needed()
        return self.sp.track(track_id)

    def get_artist_info(self, artist_id):
        self.refresh_if_needed()
        return self.sp.artist(artist_id)