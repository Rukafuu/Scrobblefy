import React from 'react';
// Heroicons
const ActivityIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>);
const DiscIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM12.56 14.71a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM9.18 11.903a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM11.45 8.71a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>);
const BoltIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>);
import { useTranslation } from 'react-i18next';
import { Track } from '../types';

interface HeroNowPlayingProps {
  track: Track;
  isPlaying?: boolean;
  progressMs?: number;
  formatMs?: (ms: number) => string;
}

const HeroNowPlaying = ({ track, isPlaying = true, progressMs = 0, formatMs }: HeroNowPlayingProps) => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-zinc-900 aspect-[2/1] group">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 blur-3xl scale-110 transition-transform duration-[20s] ease-linear group-hover:scale-125"
        style={{ backgroundImage: `url(${track.albumArt})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/50 to-transparent" />

      <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col md:flex-row items-end gap-8">
        <div className="relative h-40 w-40 md:h-56 md:w-56 flex-shrink-0 shadow-2xl rounded-lg overflow-hidden">
          <img 
            src={track.albumArt} 
            alt={track.album} 
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-2 md:space-y-4 mb-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2">
            {isPlaying ? (
              <>
                <ActivityIcon className="h-3 w-3 animate-pulse text-spotify-green" />
                <span className="text-spotify-green">{t('nowPlaying')}</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-zinc-500" />
                <span className="text-zinc-500">Paused</span>
              </>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white line-clamp-2">
            {track.name}
          </h1>
          <div className="flex items-center gap-4">
            <h2 className="text-xl md:text-2xl text-zinc-300 font-medium">
              {track.artist.name}
            </h2>
            <span className="text-zinc-600 text-2xl">•</span>
            <h3 className="text-lg md:text-xl text-zinc-400 font-light">
              {track.album}
            </h3>
          </div>

          {track.features && (
            <div className="flex gap-4 mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2" title={t('energy')}>
                <BoltIcon className="h-4 w-4 text-zinc-500" />
                <span className="text-xs text-zinc-400 font-mono">
                  {(track.features.energy * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center gap-2" title={t('tempo')}>
                <DiscIcon className="h-4 w-4 text-zinc-500 animate-spin-slow" />
                <span className="text-xs text-zinc-400 font-mono">
                  {track.features.tempo} BPM
                </span>
              </div>
            </div>
          )}

          {/* Progress Mini Track */}
          {formatMs && (
            <div className="mt-6 space-y-2 max-w-md">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                <span>{formatMs(progressMs)}</span>
                <span>{formatMs(track.durationMs)}</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-spotify-green shadow-[0_0_10px_rgba(30,215,96,0.5)] transition-all duration-1000 ease-linear"
                  style={{ width: `${(progressMs / track.durationMs) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroNowPlaying;