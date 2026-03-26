import time
import logging
from datetime import datetime
from sqlalchemy.orm import sessionmaker
from models import init_db, Track, Artist, PlayHistory
from spotify_client import SpotifyClient

# Setup Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Setup DB
engine = init_db('postgresql://user:pass@localhost:5432/scrobblefy') # Adjust connection string
Session = sessionmaker(bind=engine)
session = Session()

# Setup Client
client = SpotifyClient()

def enrich_and_save_track(track_data):
    """Fetches Deep Audio Features and saves to DB if new."""
    t_id = track_data['item']['id']
    
    # Check if exists
    existing_track = session.query(Track).filter_by(id=t_id).first()
    if existing_track:
        return existing_track

    logger.info(f"Enriching new track: {track_data['item']['name']}")
    
    # Artist handling
    artist_data = track_data['item']['artists'][0]
    artist_id = artist_data['id']
    existing_artist = session.query(Artist).filter_by(id=artist_id).first()
    
    if not existing_artist:
        full_artist = client.get_artist_info(artist_id)
        existing_artist = Artist(
            id=artist_id,
            name=artist_data['name'],
            genres=",".join(full_artist.get('genres', []))
        )
        session.add(existing_artist)
        session.commit()

    # Features
    feats = client.get_audio_features(t_id)
    if not feats:
        feats = {} # Fallback

    new_track = Track(
        id=t_id,
        name=track_data['item']['name'],
        artist_id=artist_id,
        album_name=track_data['item']['album']['name'],
        duration_ms=track_data['item']['duration_ms'],
        image_url=track_data['item']['album']['images'][0]['url'] if track_data['item']['album']['images'] else None,
        danceability=feats.get('danceability'),
        energy=feats.get('energy'),
        key=feats.get('key'),
        valence=feats.get('valence'),
        tempo=feats.get('tempo'),
        instrumentalness=feats.get('instrumentalness')
    )
    
    session.add(new_track)
    session.commit()
    return new_track

def main_loop():
    logger.info("Scrobbler Daemon Started 📡")
    
    current_track_id = None
    start_time = None
    last_check_time = None
    
    while True:
        try:
            current = client.get_current_playing()
            now = time.time()
            
            # Logic: If nothing playing
            if not current or not current.get('is_playing'):
                # Reset state if we were tracking something
                if current_track_id:
                     logger.info("Playback stopped.")
                     current_track_id = None
                time.sleep(30)
                continue

            item = current['item']
            if not item: 
                # Can happen during ads or podcasts sometimes
                time.sleep(30)
                continue

            t_id = item['id']
            
            # Case 1: Same song playing
            if t_id == current_track_id:
                # Just keep looping, maybe update a "last seen" timestamp in memory
                pass
                
            # Case 2: New song detected
            else:
                # 2a. Process the PREVIOUS song (Smart Scrobble Logic)
                if current_track_id and start_time:
                    duration_listened = now - start_time
                    # Need previous track duration. Since we don't have it in variable easily without query, 
                    # we assume if it played for > 50% of typical song (or > 2 mins)
                    # For strict correctness, we'd query the DB for the previous track's total duration.
                    
                    if duration_listened > 120: # Simple rule: 2 minutes
                        logger.info(f"✅ Scrobbling previous track. Listened for {int(duration_listened)}s")
                        history = PlayHistory(
                            track_id=current_track_id,
                            duration_played_ms=int(duration_listened * 1000)
                        )
                        session.add(history)
                        session.commit()
                    else:
                        logger.info(f"❌ Skipped scrobble. Only listened for {int(duration_listened)}s")

                # 2b. Start tracking NEW song
                logger.info(f"Now Playing: {item['name']} - {item['artists'][0]['name']}")
                
                # Ensure it exists in Data Lake
                enrich_and_save_track(current)
                
                current_track_id = t_id
                start_time = now
            
            time.sleep(30)
            
        except Exception as e:
            logger.error(f"Daemon Loop Error: {e}")
            time.sleep(60) # Backoff

if __name__ == "__main__":
    main_loop()