import React from 'react';
// Heroicons
const ClockIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>);
import { useTranslation } from 'react-i18next';
import { Track } from '../types';

interface RecentTracksProps {
  tracks: Track[];
  currentTrackId?: string;
}

const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
};

const formatTimeAgo = (isoString?: string) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const RecentTracks = ({ tracks, currentTrackId }: RecentTracksProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-lg font-bold text-white tracking-tight">{t('recentHistory')}</h3>
        <button className="text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-wider font-semibold">
          {t('viewAll')}
        </button>
      </div>
      
      <div className="flex flex-col">
        <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-2 border-b border-zinc-800 text-xs text-zinc-500 font-medium uppercase tracking-wider">
          <div className="w-8">#</div>
          <div>{t('title')}</div>
          <div className="hidden md:block">{t('album')}</div>
          <div className="flex items-center justify-end">
            <ClockIcon className="h-4 w-4" />
          </div>
        </div>

        {tracks.map((track, index) => {
          const isPlaying = track.id === currentTrackId;
          return (
            <div 
              key={track.id} 
              className={`group grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-3 rounded-md hover:bg-zinc-800/40 transition-colors items-center cursor-default ${isPlaying ? 'bg-white/5' : ''}`}
            >
              <div className="w-8 text-sm font-mono flex items-center justify-center">
                {isPlaying ? (
                  <div className="flex items-end gap-[2px] h-3 w-3">
                    <div className="w-1 bg-spotify-green animate-soundwave" style={{ animationDelay: '0s' }}></div>
                    <div className="w-1 bg-spotify-green animate-soundwave" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 bg-spotify-green animate-soundwave" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                ) : (
                  <span className="text-zinc-600 group-hover:text-white">{index + 1}</span>
                )}
              </div>
              
              <div className="flex items-center gap-4 min-w-0">
                <img 
                  src={track.albumArt} 
                  alt={track.album} 
                  className="h-10 w-10 rounded shadow-sm object-cover"
                />
                <div className="flex flex-col min-w-0">
                  <span className={`text-sm font-medium truncate group-hover:text-white ${isPlaying ? 'text-spotify-green' : 'text-zinc-200'}`}>
                    {track.name}
                  </span>
                  <span className="text-xs text-zinc-500 truncate group-hover:text-zinc-400">
                    {track.artist.name}
                  </span>
                </div>
              </div>

              <div className="hidden md:flex items-center min-w-0">
                <span className="text-sm text-zinc-500 truncate group-hover:text-zinc-300">
                  {track.album}
                </span>
              </div>

              <div className="flex flex-col items-end gap-1">
                 <span className={`text-sm font-mono ${isPlaying ? 'text-spotify-green' : 'text-zinc-400'}`}>
                  {formatDuration(track.durationMs)}
                </span>
                <span className="text-[10px] text-zinc-600 group-hover:text-zinc-500">
                  {formatTimeAgo(track.playedAt)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentTracks;