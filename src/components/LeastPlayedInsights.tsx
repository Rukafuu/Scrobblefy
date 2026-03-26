import React, { useState, useMemo, useEffect, useRef } from 'react';
// Heroicons
const ClockIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>);
const ChartIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>);
const ArrowUpIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" /></svg>);
const ArrowDownIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" /></svg>);
const RefreshIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>);
const PlusIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>);
const ChevronDownIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>);
const ListPlusIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15m7.5-7.5V4.5m0 15V12" /><path d="M12 9h9m-9 6h9" /></svg>);
import { Playlist, Track } from '../types';
import { spotifyService } from '../services/spotifyService';
import { lastfmService } from '../services/lastfmService';
import { useTranslation } from 'react-i18next';

interface LeastPlayedInsightsProps {
  playlists: Playlist[];
  lastfmUsername?: string;
  selectedId?: string;
  onSelectId?: (id: string) => void;
}

type SortCriteria = 'plays' | 'name' | 'artist';
type SortOrder = 'asc' | 'desc';

const LeastPlayedInsights = ({ 
  playlists: initialPlaylists, 
  lastfmUsername, 
  selectedId: externalId, 
  onSelectId 
}: LeastPlayedInsightsProps) => {
  const { t } = useTranslation();
  const [internalId, setInternalId] = useState<string>('');
  
  // Use external ID if provided, otherwise internal
  const selectedPlaylistId = externalId || internalId;

  const [loadedTracks, setLoadedTracks] = useState<Track[]>([]);
  const [sortBy, setSortBy] = useState<SortCriteria>('plays');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncingToSpotify, setIsSyncingToSpotify] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const fetchIdRef = useRef(0);

  // When playlists arrive, select the first one if nothing is selected
  useEffect(() => {
    if (initialPlaylists.length > 0 && !selectedPlaylistId) {
      if (onSelectId) onSelectId(initialPlaylists[0].id);
      else setInternalId(initialPlaylists[0].id);
    }
  }, [initialPlaylists]);

  // Load tracks whenever selected playlist OR lastfmUsername changes
  useEffect(() => {
    if (!selectedPlaylistId) return;
    // Increment ID so any in-flight request knows it's cancelled
    const fetchId = ++fetchIdRef.current;
    setIsLoading(true);
    setLoadedTracks([]);

    (async () => {
      try {
        const rawTracks = await spotifyService.getPlaylistTracks(selectedPlaylistId);
        if (fetchId !== fetchIdRef.current) return; // stale, discard

        let tracks: Track[];
        if (lastfmUsername && rawTracks.length > 0) {
          const promises = rawTracks.slice(0, 50).map(async (track) => {
            const count = await lastfmService.getUserPlayCount(track.artist.name, track.name, lastfmUsername);
            return { ...track, playCounts: { plays: count, lastfm: true as const } };
          });
          tracks = await Promise.all(promises);
          if (rawTracks.length > 50) {
            tracks = [...tracks, ...rawTracks.slice(50).map(t => ({ ...t, playCounts: { plays: 0 } }))];
          }
        } else {
          tracks = rawTracks.map(t => ({ ...t, playCounts: { plays: 0 } }));
        }

        if (fetchId !== fetchIdRef.current) return; // stale
        setLoadedTracks(tracks);
      } catch (e) {
        console.error('LeastPlayedInsights load error:', e);
      } finally {
        if (fetchId === fetchIdRef.current) setIsLoading(false);
      }
    })();
  }, [selectedPlaylistId, lastfmUsername]);

  const handlePlaylistChange = (id: string) => {
    if (id === selectedPlaylistId) return;
    if (onSelectId) onSelectId(id);
    else setInternalId(id);
  };

  const sortedTracks = useMemo(() => {
    return [...loadedTracks].sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'plays') cmp = (a.playCounts?.plays ?? 0) - (b.playCounts?.plays ?? 0);
      else if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortBy === 'artist') cmp = a.artist.name.localeCompare(b.artist.name);
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [loadedTracks, sortBy, sortOrder]);

  const displayedTracks = useMemo(() => sortedTracks.slice(0, 10), [sortedTracks]);

  const selectedPlaylist = useMemo(
    () => initialPlaylists.find(p => p.id === selectedPlaylistId),
    [initialPlaylists, selectedPlaylistId]
  );

  const minPlays = useMemo(
    () => displayedTracks.length > 0 ? Math.min(...displayedTracks.map(t => t.playCounts?.plays ?? 0)) : 0,
    [displayedTracks]
  );

  const formatDuration = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const syncToSpotify = async () => {
    if (sortedTracks.length === 0 || isSyncingToSpotify) return;
    setIsSyncingToSpotify(true);
    setSyncSuccess(false);
    try {
      const uris = sortedTracks.slice(0, 50).map(t => `spotify:track:${t.id}`);
      const name = `🎵 Forgotten Gems — ${selectedPlaylist?.name || 'Playlist'}`;
      await spotifyService.createPlaylist(name, `Least played tracks from "${selectedPlaylist?.name}" · Scrobblefy`, uris);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 4000);
    } catch (e) {
      console.error('Sync to Spotify failed:', e);
    } finally {
      setIsSyncingToSpotify(false);
    }
  };

  const sortLabels: Record<SortCriteria, string> = {
    plays: t('playCount'),
    name: t('trackName'),
    artist: t('artistName'),
  };

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-spotify-green/10 rounded-lg flex-shrink-0">
            <ChartIcon className="h-5 w-5 text-spotify-green" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{t('leastPlayedAnalysis')}</h3>
            <p className="text-[11px] text-zinc-500">{t('discoverTracks')}</p>
          </div>
        </div>

        {/* Playlist selector */}
        <div className="relative flex-shrink-0 max-w-xs w-full sm:w-auto">
          <select
            value={selectedPlaylistId}
            onChange={e => handlePlaylistChange(e.target.value)}
            className="w-full appearance-none bg-zinc-800 border border-zinc-700 text-sm text-white pl-4 pr-10 py-2.5 rounded-full focus:outline-none focus:ring-1 focus:ring-spotify-green cursor-pointer truncate"
          >
            {initialPlaylists.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
        </div>
      </div>

      {/* Sort controls */}
      <div className="flex items-center justify-between px-2 py-2 bg-zinc-950/40 rounded-lg border border-zinc-800/50 gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider whitespace-nowrap">{t('sortBy')}</span>
          <div className="flex gap-1.5">
            {(['plays', 'name', 'artist'] as SortCriteria[]).map(c => (
              <button
                key={c}
                onClick={() => setSortBy(c)}
                className={`text-[11px] px-3 py-1 rounded-full transition-colors ${sortBy === c ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}
              >
                {sortLabels[c]}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
          className="flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-white bg-zinc-800 px-3 py-1.5 rounded-full transition-colors flex-shrink-0"
        >
          {sortOrder === 'asc' ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
          <span className="uppercase font-bold">{sortOrder}</span>
        </button>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_auto] px-3 text-[10px] text-zinc-600 uppercase font-bold tracking-widest border-b border-zinc-800/50 pb-2">
        <div>{t('trackDetails')}</div>
        <div className="flex items-center gap-8">
          <div className="hidden sm:block w-14">{t('duration')}</div>
          <div className="w-16 text-right">{lastfmUsername ? 'Last.fm' : t('plays')}</div>
        </div>
      </div>

      {/* Track list */}
      <div className="space-y-1.5 min-h-[120px]">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center gap-3 text-zinc-600">
            <RefreshIcon className="h-7 w-7 animate-spin opacity-40" />
            <span className="text-sm italic">{lastfmUsername ? 'Buscando no Last.fm…' : t('syncingData')}</span>
          </div>
        ) : displayedTracks.length > 0 ? (
          displayedTracks.map((track, i) => {
            const plays = track.playCounts?.plays ?? 0;
            const isLowest = plays === minPlays;
            return (
              <div
                key={track.id}
                className={`group grid grid-cols-[1fr_auto] items-center p-3 rounded-xl transition-all border ${
                  isLowest
                    ? 'bg-spotify-green/5 border-spotify-green/20'
                    : 'hover:bg-white/5 border-transparent hover:border-zinc-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-zinc-600 w-5 flex-shrink-0">{i + 1}</span>
                  <div className="h-10 w-10 rounded overflow-hidden bg-zinc-800 flex-shrink-0">
                    <img src={track.albumArt} alt={track.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">{track.name}</span>
                      {isLowest && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-spotify-green text-black uppercase flex-shrink-0">
                          {t('lowest')}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-500 truncate">{track.artist.name} · {track.album}</div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="hidden sm:flex items-center gap-1 text-zinc-500 w-14">
                    <ClockIcon className="h-3 w-3" />
                    <span className="text-[10px] font-mono">{formatDuration(track.durationMs)}</span>
                  </div>
                  <div className={`w-16 text-right text-sm font-bold ${isLowest ? 'text-spotify-green' : 'text-white'}`}>
                    {plays} <span className="text-[10px] font-normal text-zinc-500">{t('playsCount')}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 flex flex-col items-center gap-2 text-zinc-600">
            <ClockIcon className="h-7 w-7 opacity-30" />
            <span className="text-sm">{t('noData')}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-zinc-800/50 flex items-center justify-between gap-3">
        <div className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold flex-shrink-0">{t('insightsSummary')}</div>
        <div className="flex items-center gap-3 min-w-0">
          {displayedTracks.length > 0 && (
            <span className="text-[10px] text-zinc-500 italic hidden md:block truncate">
              {displayedTracks.length} faixas menos ouvidas em "{selectedPlaylist?.name}"
            </span>
          )}
          <button
            onClick={syncToSpotify}
            disabled={isSyncingToSpotify || displayedTracks.length === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex-shrink-0 ${
              syncSuccess
                ? 'bg-spotify-green text-black'
                : 'bg-zinc-800 text-zinc-300 hover:bg-spotify-green hover:text-black disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {isSyncingToSpotify ? <RefreshIcon className="h-3.5 w-3.5 animate-spin" /> : <ListPlusIcon className="h-3.5 w-3.5" />}
            {syncSuccess ? 'Playlist criada! ✓' : 'Salvar no Spotify'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeastPlayedInsights;
