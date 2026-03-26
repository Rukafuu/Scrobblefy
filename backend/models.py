from datetime import datetime
from sqlalchemy import create_engine, Column, String, Integer, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Artist(Base):
    __tablename__ = 'artists'
    id = Column(String, primary_key=True)  # Spotify ID
    name = Column(String, nullable=False)
    genres = Column(String)  # Stored as comma-separated string for simplicity
    
    tracks = relationship("Track", back_populates="artist")

class Track(Base):
    __tablename__ = 'tracks'
    id = Column(String, primary_key=True)  # Spotify ID
    name = Column(String, nullable=False)
    artist_id = Column(String, ForeignKey('artists.id'))
    album_name = Column(String)
    duration_ms = Column(Integer)
    image_url = Column(String)
    
    # Audio Features
    danceability = Column(Float)
    energy = Column(Float)
    key = Column(Integer)
    loudness = Column(Float)
    mode = Column(Integer)
    speechiness = Column(Float)
    acousticness = Column(Float)
    instrumentalness = Column(Float)
    liveness = Column(Float)
    valence = Column(Float)
    tempo = Column(Float)
    
    artist = relationship("Artist", back_populates="tracks")
    scrobbles = relationship("PlayHistory", back_populates="track")

class PlayHistory(Base):
    __tablename__ = 'play_history'
    id = Column(Integer, primary_key=True, autoincrement=True)
    track_id = Column(String, ForeignKey('tracks.id'))
    played_at = Column(DateTime, default=datetime.utcnow)
    duration_played_ms = Column(Integer)  # How long user actually listened
    context_uri = Column(String, nullable=True) # e.g. playlist URI
    
    track = relationship("Track", back_populates="scrobbles")

# Init DB Helper
def init_db(db_url='sqlite:///scrobblefy.db'):
    engine = create_engine(db_url)
    Base.metadata.create_all(engine)
    return engine