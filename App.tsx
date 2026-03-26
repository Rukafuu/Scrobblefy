import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from './src/i18n';
import HeroNowPlaying from './src/components/HeroNowPlaying';
import LiraInsightCard from './src/components/LiraInsightCard';
import RecentTracks from './src/components/RecentTracks';
import LeastPlayedInsights from './src/components/LeastPlayedInsights';
import SettingsModal from './src/components/SettingsModal';
import TasteAnalysis from './src/components/TasteAnalysis';
import HelpModal from './src/components/HelpModal';
import { spotifyService } from './src/services/spotifyService';
import { lastfmService } from './src/services/lastfmService';
import { Playlist, Track } from './src/types';

// Heroicons (Outline)
const HomeIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>);
const SearchIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>);
const LibraryIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" /></svg>);
const ChartIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>);
const PlayIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653Z" /></svg>);
const PauseIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" /></svg>);
const SidebarIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" /></svg>);
const SkipBackIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .857-.917 1.396-1.667.986l-7.243-3.98s-1.116-.628-1.116-1.817c0-1.189 1.116-1.817 1.116-1.817l7.243-3.98c.75-.413 1.667.126 1.667.983V16.811ZM11.25 16.811c0 .857-.917 1.396-1.667.986l-7.243-3.98s-1.116-.628-1.116-1.817c0-1.189 1.116-1.817 1.116-1.817l7.243-3.98c.75-.413 1.667.126 1.667.983V16.811Z" /></svg>);
const SkipForwardIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.811c0 .857.917 1.396 1.667.986l7.243-3.98s1.116-.628 1.116-1.817c0-1.189-1.116-1.817-1.116-1.817l-7.243-3.98C3.917 5.754 3 6.293 3 7.15v9.661ZM12.75 16.811c0 .857.917 1.396 1.667.986l7.243-3.98s1.116-.628 1.116-1.817c0-1.189-1.116-1.817-1.116-1.817l-7.243-3.98c-.75-.413-1.667.126-1.667.983v9.661Z" /></svg>);
const VolumeIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /></svg>);
const SettingsIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774a1.125 1.125 0 0 1 .12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738a1.125 1.125 0 0 1-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.45.12l-.737-.527c-.35-.25-.806-.272-1.204-.107-.397.165-.71.505-.78.93l-.15.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527a1.125 1.125 0 0 1-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15a1.125 1.125 0 0 1-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.774-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.401-.167.711-.505.781-.929l.149-.894Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>);
const PlusIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>);
const ClockIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>);
const MenuIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" /></svg>);
const QuestionIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>);
const UserIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>);
const LogInIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>);
const MusicIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l.31-.088a2.25 2.25 0 0 0 1.632-2.163V6.574c0-.59.401-1.107.98-1.226l.39-.08a1.503 1.503 0 0 1 1.772 1.474v2.793c0 .59-.401 1.107-.98 1.226l-.39.08a1.503 1.503 0 0 1-1.772-1.474V9z" /></svg>);
const XIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>);
const RefreshIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>);
const MicIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" /></svg>);
const SparklesIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.456-2.454L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>);
const SparklePlusIcon = (props: any) => (<svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zM19 13l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zM7 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z"/></svg>);
const GlobeIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>);
const CheckIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>);


// ─── Helpers ──────────────────────────────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'goodMorning';
  if (h < 18) return 'goodAfternoon';
  return 'goodEvening';
};

const formatMs = (ms: number) => {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const SidebarItem = ({ icon: Icon, label, active = false, isCollapsed = false }: { icon: any; label: string; active?: boolean; isCollapsed?: boolean }) => (
  <div 
    className={`group flex items-center rounded-xl cursor-pointer transition-all duration-300 relative ${
      active 
        ? 'bg-spotify-green/10 text-spotify-green shadow-sm' 
        : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'
    } ${isCollapsed ? 'justify-center h-12 w-12 mx-auto' : 'gap-4 px-4 py-3'}`}
    title={isCollapsed ? label : ''}
  >
    <Icon className={`h-6 w-6 flex-shrink-0 transition-transform ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
    {!isCollapsed && <span className="font-bold text-sm truncate tracking-tight">{label}</span>}
    {isCollapsed && active && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-spotify-green rounded-r-full shadow-[0_0_8px_rgba(29,185,84,0.5)]" />
    )}
  </div>
);

// ─── Lira Insights (generated from real data) ─────────────────────────────────
const generateInsights = (recentTracks: Track[], currentTrack: Track | null) => {
  const insights = [];
  if (currentTrack) {
    insights.push({ id: 'np', type: 'stat' as const, icon: 'chart', content: `Tocando agora: "${currentTrack.name}" de ${currentTrack.artist.name}.` });
  }
  if (recentTracks.length > 0) {
    const artists = recentTracks.map(t => t.artist.name);
    const freq: Record<string, number> = {};
    artists.forEach(a => { freq[a] = (freq[a] || 0) + 1; });
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
    if (top) insights.push({ id: 'top', type: 'stat' as const, icon: 'sparkles', content: `Você ouviu ${top[0]} ${top[1]} vez${top[1] > 1 ? 'es' : ''} hoje.` });
  }
  if (insights.length === 0) {
    insights.push({ id: 'idle', type: 'curation' as const, icon: 'sparkles', content: 'Conecte o Spotify e comece a ouvir para ver seus insights aqui!' });
  }
  return insights;
};

// ─── Listening Clock (real hour distribution from recent tracks) ───────────────
const buildListeningClock = (tracks: Track[]) => {
  const hours = new Array(12).fill(0);
  tracks.forEach(t => {
    if (t.playedAt) {
      const h = new Date(t.playedAt).getHours();
      hours[Math.floor(h / 2)]++;
    }
  });
  const max = Math.max(...hours, 1);
  return hours.map(v => Math.round((v / max) * 100));
};

// ─── App ───────────────────────────────────────────────────────────────────────
const SunIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M3 12h2.25m.386-6.364 1.591 1.591M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>);
const MoonIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>);
const TranslateIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138A44.45 44.45 0 0 0 8.184 9.24m1.21 6.466C8.212 14.518 6.026 11.903 4.135 9" /></svg>);

const ExternalLinkIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>);

const App = () => {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [recentTracks, setRecentTracks] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressMs, setProgressMs] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; imageUrl?: string } | null>(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isLastfmConnected, setIsLastfmConnected] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [lastfmUsername, setLastfmUsername] = useState<string | null>(null);
  const [isLastfmError, setIsLastfmError] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'search' | 'taste'>('dashboard');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Scrobble tracking refs
  const scrobbledIds = useRef<Set<string>>(new Set());
  const nowPlayingRef = useRef<string | null>(null);
  const analysisRef = useRef<HTMLDivElement>(null);

  // Global selection for Analysis component
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');
  const [sortType, setSortType] = useState<'Recentes' | 'Alfabético' | 'Criador'>('Recentes');

  const cycleSortType = () => {
    const types: ('Recentes' | 'Alfabético' | 'Criador')[] = ['Recentes', 'Alfabético', 'Criador'];
    const idx = types.indexOf(sortType);
    setSortType(types[(idx + 1) % types.length]);
  };

  const handlePlaylistClick = (id: string) => {
    setSelectedPlaylistId(id);
    // Smooth scroll to analysis section
    setTimeout(() => {
      analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // ── Theme sync ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') { root.classList.add('dark'); root.classList.remove('light'); }
    else if (theme === 'light') { root.classList.add('light'); root.classList.remove('dark'); }
    else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
      root.classList.toggle('light', !isDark);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // ── Boot ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    checkAuth();
    checkLastfmAuth();
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'OAUTH_AUTH_SUCCESS') checkAuth();
      if (e.data?.type === 'LASTFM_AUTH_SUCCESS') checkLastfmAuth();
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // ── Player polling (every 5s) ───────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;
    const poll = async () => {
      const state = await spotifyService.getPlayerState();
      setIsPlaying(state.isPlaying);
      setProgressMs(state.progressMs);
      if (state.track) {
        setCurrentTrack(prev => {
          if (prev?.id !== state.track!.id) nowPlayingRef.current = null;
          return state.track;
        });
      } else {
        setCurrentTrack(null);
      }
    };
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, [isAuthenticated]);

  // ── Last.fm scrobble side effect ────────────────────────────────────────────
  useEffect(() => {
    if (!currentTrack || !isLastfmConnected) return;
    if (nowPlayingRef.current !== currentTrack.id) {
      nowPlayingRef.current = currentTrack.id;
      lastfmService.updateNowPlaying(currentTrack.artist.name, currentTrack.name, currentTrack.album);
    }
    if (
      isPlaying &&
      !scrobbledIds.current.has(currentTrack.id) &&
      (progressMs >= currentTrack.durationMs * 0.5 || progressMs >= 4 * 60 * 1000)
    ) {
      scrobbledIds.current.add(currentTrack.id);
      lastfmService.scrobble(currentTrack.artist.name, currentTrack.name, currentTrack.album);
      console.log(`✅ Scrobbled: ${currentTrack.name}`);
    }
  }, [currentTrack, isPlaying, progressMs, isLastfmConnected]);

  // ── Auth ────────────────────────────────────────────────────────────────────
  const checkAuth = async () => {
    const authStatus = await spotifyService.checkAuthStatus();
    setIsAuthenticated(authStatus);
    setIsLoading(false);
    if (authStatus) fetchInitialData();
  };

  const checkLastfmAuth = async () => {
    try {
      const { isConnected, username } = await lastfmService.checkAuthStatus();
      setIsLastfmConnected(isConnected);
      setLastfmUsername(username);
      setIsLastfmError(false);
    } catch (e) {
      setIsLastfmError(true);
    }
  };

  // ── Search Logic ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      const results = await spotifyService.search(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // ── Hotkeys ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD+K to search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setActiveTab('search');
        document.getElementById('search-input')?.focus();
      }
      // Space to toggle play/pause (if not typing)
      if (e.code === 'Space' && e.target instanceof HTMLBodyElement) {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
      // H to open help
      if (e.key.toLowerCase() === 'h' && e.target instanceof HTMLBodyElement) {
        e.preventDefault();
        setIsHelpOpen(true);
      }
      // CTRL+S to toggle settings
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        setIsSettingsOpen(v => !v);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const fetchInitialData = async () => {
    const [recent, userPlaylists, me] = await Promise.all([
      spotifyService.getRecentTracks(),
      spotifyService.getUserPlaylists(),
      spotifyService.getUserProfile(),
    ]);
    setRecentTracks(recent);
    setPlaylists(userPlaylists);
    setUserProfile(me);
  };

  const handleConnect = async () => {
    const url = await spotifyService.getAuthUrl();
    window.open(url, 'spotify_oauth', 'width=600,height=700');
  };

  const handleLogout = async () => {
    await spotifyService.logout();
    setIsAuthenticated(false);
    setIsSettingsOpen(false);
    setPlaylists([]); setCurrentTrack(null); setRecentTracks([]);
    setUserProfile(null);
  };

  const handleConnectLastfm = async () => {
    const url = await lastfmService.getAuthUrl();
    window.open(url, 'lastfm_oauth', 'width=600,height=700');
  };

  // ── Derived data ─────────────────────────────────────────────────────────────
  const insights = generateInsights(recentTracks, currentTrack);
  const clockData = buildListeningClock(recentTracks);
  const progressPercent = currentTrack ? Math.min((progressMs / currentTrack.durationMs) * 100, 100) : 0;

  // Search filter (applies to recent tracks)
  const filteredRecent = searchQuery.trim()
    ? recentTracks.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.album.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recentTracks;

  // ── Loading screen ───────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-spotify-green border-t-transparent rounded-full" />
      </div>
    );
  }

  // ── Login screen ─────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center p-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-spotify-green/20 rounded-full blur-[120px] animate-blob" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        </div>
        <div className="relative z-10 w-full max-w-lg">
          <div className="glass rounded-[40px] p-10 md:p-16 flex flex-col items-center text-center space-y-10 shadow-2xl border border-white/10">
            <div className="h-20 w-20 overflow-hidden rounded-3xl flex items-center justify-center shadow-xl shadow-spotify-green/10 hover:rotate-6 transition-transform duration-500">
              <img src="/logo.png" className="h-full w-full object-cover" alt="logo" />
            </div>
            <div>
              <h1 className="text-6xl font-black tracking-tighter uppercase text-white">Scrobblefy</h1>
              <p className="text-zinc-500 text-sm mt-1">Spotify × Last.fm — unified</p>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">{t('connectDesc')}</p>
            <button onClick={handleConnect} className="w-full bg-spotify-green text-black py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-spotify-green/20">
              <LogInIcon className="h-6 w-6" />{t('connectSpotify')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main app ─────────────────────────────────────────────────────────────────
  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 ${
      theme === 'light' 
        ? 'bg-zinc-100 text-zinc-900 selection:bg-indigo-100' 
        : 'bg-black text-white selection:bg-indigo-500/30'
    }`}>
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={`${isSidebarCollapsed ? 'w-[72px]' : 'w-[280px]'} hidden md:flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${
        theme === 'light' ? 'bg-zinc-50' : 'bg-black'
      }`}>
        <div className="p-4 space-y-4">
          <div className={`flex items-center gap-3 px-2 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <img src="/logo.png" alt="Scrobblefy" className="h-8 w-8 object-contain rounded-md" />
            {!isSidebarCollapsed && <span className={`font-black text-xl tracking-tight ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>Scrobblefy</span>}
          </div>

          <nav className="space-y-1">
            <div onClick={() => setActiveTab('dashboard')}>
              <SidebarItem icon={HomeIcon} label={t('dashboard')} active={activeTab === 'dashboard'} isCollapsed={isSidebarCollapsed} />
            </div>
            <div onClick={() => setActiveTab('search')}>
              <SidebarItem icon={SearchIcon} label={t('search')} active={activeTab === 'search'} isCollapsed={isSidebarCollapsed} />
            </div>
            <div onClick={() => setActiveTab('taste')}>
              <SidebarItem icon={ChartIcon} label={t('tasteAnalysis')} active={activeTab === 'taste'} isCollapsed={isSidebarCollapsed} />
            </div>
          </nav>
        </div>

        <div className={`flex-1 m-2 mt-0 rounded-xl flex flex-col overflow-hidden ${theme === 'light' ? 'bg-white shadow-sm' : 'bg-zinc-900/20'}`}>
          <div className={`p-4 pb-2 space-y-4 ${isSidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
            <header className={`flex items-center justify-between ${isSidebarCollapsed ? 'flex-col gap-4' : 'px-2'}`}>
              <div 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className={`flex items-center gap-3 text-zinc-500 hover:text-white transition-all cursor-pointer group p-2 rounded-lg hover:bg-zinc-800/40 ${isSidebarCollapsed ? 'justify-center' : ''}`}
                title={isSidebarCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
              >
                <SidebarIcon className={`h-6 w-6 transition-all duration-300 ${isSidebarCollapsed ? '' : 'rotate-180'} group-hover:scale-110 shadow-sm`} />
                {!isSidebarCollapsed && <span className="font-bold text-sm tracking-tight">Sua Biblioteca</span>}
              </div>
              
              <div className={`flex items-center gap-1 ${isSidebarCollapsed ? 'flex-col' : ''}`}>
                <button 
                  className="h-8 w-8 rounded-full hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white group transition-all"
                  title="Criar playlist"
                >
                  <PlusIcon className="h-5 w-5 group-hover:scale-110" />
                </button>
                {isSidebarCollapsed && (
                  <button 
                    className="h-8 w-8 rounded-full hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white group transition-all"
                    title="Buscar na biblioteca"
                    onClick={() => { setIsSidebarCollapsed(false); setActiveTab('search'); }}
                  >
                    <SearchIcon className="h-5 w-5 group-hover:scale-110" />
                  </button>
                )}
              </div>
            </header>

            {!isSidebarCollapsed && (
              <>
                <div className="flex gap-2 px-2 overflow-x-auto no-scrollbar scroll-smooth">
                  <button 
                    onClick={() => setSelectedPlaylistId('')}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[11px] font-bold transition-all border ${
                      !selectedPlaylistId 
                        ? (theme === 'light' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-spotify-green border-spotify-green text-black')
                        : (theme === 'light' ? 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200' : 'bg-zinc-800/80 border-transparent text-white hover:bg-zinc-700')
                    }`}
                  >
                    {t('playlists')}
                  </button>
                  <button 
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[11px] font-bold transition-all border ${
                      theme === 'light' ? 'bg-transparent border-zinc-300 text-zinc-600 hover:bg-zinc-100' : 'bg-transparent border-zinc-800 text-zinc-500 hover:text-white hover:bg-white/5 hover:border-zinc-700'
                    }`}
                  >
                    {t('criadasPorVoce') || 'Criadas por você'}
                  </button>
                </div>

                <div className="flex items-center justify-between px-2 text-zinc-500 pt-2 border-t border-zinc-800/30">
                  <SearchIcon className="h-4 w-4 hover:text-white cursor-pointer transition-colors" title="Buscar na biblioteca" />
                  <div className="relative">
                    <div 
                      onClick={cycleSortType}
                      className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 hover:text-white cursor-pointer transition-colors group px-2 py-1 rounded-lg hover:bg-white/5"
                    >
                      {sortType} <MenuIcon className="h-3 w-3 group-hover:scale-110 transition-transform opacity-30" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar px-2 space-y-0.5">
            {playlists
              .slice()
              .sort((a, b) => {
                if (sortType === 'Alfabético') return a.name.localeCompare(b.name);
                if (sortType === 'Criador') return (a.ownerName || '').localeCompare(b.ownerName || '');
                return 0; // 'Recentes' keeps natural order
              })
              .map(pl => (
              <button
                key={pl.id}
                onClick={() => handlePlaylistClick(pl.id)}
                className={`flex items-center gap-3 w-full p-2 rounded-lg transition-all group ${
                  selectedPlaylistId === pl.id ? 'bg-white/10' : 'hover:bg-white/5'
                } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                title={isSidebarCollapsed ? pl.name : ''}
              >
                <div className={`${isSidebarCollapsed ? 'h-12 w-12' : 'h-12 w-12'} rounded-md overflow-hidden flex-shrink-0 shadow-lg bg-zinc-800 transition-all`}>
                  {pl.imageUrl ? <img src={pl.imageUrl} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center bg-zinc-800 text-zinc-600"><MusicIcon className="h-6 w-6" /></div>}
                </div>
                {!isSidebarCollapsed && (
                  <div className="flex-1 min-w-0 text-left">
                    <div className={`text-sm font-bold truncate transition-colors ${
                      selectedPlaylistId === pl.id ? 'text-spotify-green' : theme === 'light' ? 'text-zinc-800' : 'text-white'
                    }`}>
                      {pl.name}
                    </div>
                    <div className="text-[11px] font-medium text-zinc-500 truncate flex items-center gap-1">
                      {pl.id === '__liked_songs__' ? 'Playlist • ' : 'Playlist • '}{pl.ownerName}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Library Footer Stats ────────────────────────────────── */}
        <div className="p-4 mt-auto">
          {!isSidebarCollapsed && (
            <div className="flex items-center justify-between text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-2 group cursor-default">
              <span>{playlists.length} Playlists</span>
              <div className="h-1 w-1 rounded-full bg-zinc-800 group-hover:bg-spotify-green transition-colors" />
              <span>Personal Library</span>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className={`flex-1 overflow-y-auto no-scrollbar pb-32 transition-colors duration-300 ${
          theme === 'light' ? 'bg-white' : 'bg-gradient-to-b from-zinc-900 via-black to-black'
        }`}>
          <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">

            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4 py-2">
              <div className="flex-shrink-0">
                <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-0.5">{t(getGreeting())}{userProfile ? `, ${userProfile.name.split(' ')[0]}` : ''}</h2>
                <h1 className="text-2xl font-black text-white tracking-tight">{t('dashboard')}</h1>
              </div>

              {/* Central Upgrade Card (Aba Elegante Centralizada) */}
              <div className="flex-1 flex justify-center min-w-0">
                <button 
                  onClick={() => setIsUpgradeOpen(true)}
                  className="group relative flex items-center gap-3 px-4 md:px-6 py-2.5 bg-gradient-to-r from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative h-7 w-7 md:h-8 md:w-8 rounded-full bg-white flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                    <SparklePlusIcon className="h-4 w-4 md:h-5 md:w-5 text-indigo-600" />
                  </div>
                  <div className="relative text-left flex flex-col items-start leading-tight min-w-0">
                    <span className="text-[10px] md:text-[11px] font-black uppercase text-white tracking-widest text-glow-indigo truncate w-full">Plus</span>
                    <span className="hidden lg:block text-[9px] font-medium text-zinc-500 group-hover:text-indigo-300 transition-colors">Analítica avançada</span>
                  </div>
                </button>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsHelpOpen(true)}
                    className={`h-10 w-10 rounded-full flex items-center justify-center border transition-all ${
                      theme === 'light' ? 'bg-zinc-100 border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                    }`}
                    title="Ajuda e atalhos"
                  >
                    <QuestionIcon className="h-5 w-5" />
                  </button>
                  {/* Profile button */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(v => !v)}
                      className="h-10 w-10 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors overflow-hidden ring-2 ring-transparent hover:ring-indigo-500/20"
                    >
                      {userProfile?.imageUrl
                        ? <img src={userProfile.imageUrl} className="h-full w-full object-cover" alt="profile" />
                        : <UserIcon className="h-5 w-5 text-zinc-400 m-auto" />
                      }
                    </button>
                    {isProfileOpen && (
                      <div className={`absolute right-0 top-12 border rounded-2xl p-1.5 w-56 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xl ${
                        theme === 'light' ? 'bg-white/95 border-zinc-200' : 'bg-zinc-900/95 border-zinc-800'
                      }`}>
                        <div className={`px-4 py-3 border-b mb-1 ${theme === 'light' ? 'border-zinc-100' : 'border-zinc-800'}`}>
                          <div className={`text-sm font-black truncate ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>{userProfile?.name || 'Spotify User'}</div>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Scrobblefy Plus</div>
                        </div>

                        <div className="space-y-0.5">
                          <button className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between group ${
                            theme === 'light' ? 'text-zinc-700 hover:bg-zinc-100' : 'text-zinc-300 hover:bg-white/5'
                          }`}>
                            <span>Conta</span>
                            <ExternalLinkIcon className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                          <button className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold text-left transition-all ${
                            theme === 'light' ? 'text-zinc-700 hover:bg-zinc-100' : 'text-zinc-300 hover:bg-white/5'
                          }`}>
                            Perfil
                          </button>
                          <button className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between group ${
                            theme === 'light' ? 'text-zinc-700 hover:bg-zinc-100' : 'text-zinc-300 hover:bg-white/5'
                          }`}>
                            <span>Suporte</span>
                            <ExternalLinkIcon className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                          <button 
                            onClick={() => { setActiveTab('settings'); setIsProfileOpen(false); }}
                            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold text-left transition-all ${
                              theme === 'light' ? 'text-zinc-700 hover:bg-zinc-100' : 'text-zinc-300 hover:bg-white/5'
                            }`}
                          >
                            Configurações
                          </button>
                          
                          <div className={`h-1 w-full my-1 border-t ${theme === 'light' ? 'border-zinc-100' : 'border-zinc-800'}`} />
                          
                          <button onClick={handleLogout} className="w-full py-2.5 px-3 rounded-xl text-xs text-red-400 hover:bg-red-500/10 font-bold text-left transition-colors">
                            Sair da conta
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Search Bar Section (Separate) ─────────────────────────────── */}
            <div className="px-4">
              <div className="max-w-xl mx-auto relative group">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors pointer-events-none" />
                <input
                  type="text"
                  id="search-input"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    if (activeTab === 'dashboard') setActiveTab('search');
                  }}
                  onFocus={() => {
                    if (activeTab === 'dashboard') setActiveTab('search');
                  }}
                  placeholder={t('searchPlaceholder')}
                  className={`w-full border rounded-2xl py-3 pl-12 pr-4 text-sm transition-all focus:outline-none focus:ring-2 ${
                    theme === 'light' 
                      ? 'bg-zinc-100 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:ring-indigo-500/20 focus:bg-white' 
                      : 'bg-zinc-900/60 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-indigo-500/20 focus:bg-zinc-900'
                  }`}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                    <XIcon className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* ── Settings Tab ──────────────────────────────────────────────── */}
            {activeTab === 'settings' && (
              <div className="flex-1 p-8 max-w-2xl mx-auto space-y-12 animate-in slide-in-from-bottom-4 duration-500 pb-24 no-scrollbar scroll-smooth">
                <header className="space-y-2">
                  <h2 className={`text-4xl font-black tracking-tighter ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>{t('settings')}</h2>
                  <p className="text-zinc-500 text-sm">Personalize sua experiência no Scrobblefy</p>
                </header>

                <div className="space-y-8">
                  <section className="space-y-4">
                    <label className={`text-[11px] font-black uppercase tracking-widest ${theme === 'light' ? 'text-zinc-500' : 'text-zinc-400'}`}>Aparência</label>
                    <div className={`p-6 rounded-3xl border flex items-center justify-between group transition-all ${
                      theme === 'light' ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-900/40 border-zinc-800'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${
                          theme === 'light' ? 'bg-indigo-50 text-indigo-600' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {theme === 'light' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className={`font-bold ${theme === 'light' ? 'text-zinc-900' : 'text-zinc-200'}`}>Modo Claro</p>
                          <p className="text-xs text-zinc-500">Alternar entre temas do sistema</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        className={`w-14 h-7 rounded-full relative transition-all duration-500 ${
                          theme === 'light' ? 'bg-indigo-600' : 'bg-zinc-800'
                        }`}
                      >
                        <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-xl transition-all duration-500 ease-spring ${
                          theme === 'light' ? 'left-8 scale-110 shadow-indigo-200' : 'left-1 scale-90 opacity-60'
                        }`} />
                      </button>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <label className={`text-[11px] font-black uppercase tracking-widest ${theme === 'light' ? 'text-zinc-500' : 'text-zinc-400'}`}>Idioma</label>
                    <div className={`p-6 rounded-3xl border flex items-center justify-between ${
                      theme === 'light' ? 'bg-white border-zinc-200 shadow-sm' : 'bg-zinc-900/40 border-zinc-800'
                    }`}>
                      <div className="flex items-center gap-4">
                         <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${
                          theme === 'light' ? 'bg-indigo-50 text-indigo-600' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          <TranslateIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className={`font-bold ${theme === 'light' ? 'text-zinc-900' : 'text-zinc-200'}`}>Language</p>
                          <p className="text-xs text-zinc-500">Alterar idioma da interface</p>
                        </div>
                      </div>
                      <select 
                        value={i18n.language}
                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border outline-none transition-all ${
                          theme === 'light' ? 'bg-zinc-50 border-zinc-200 text-zinc-900' : 'bg-zinc-800 border-zinc-700 text-white'
                        }`}
                      >
                        <option value="pt">Português</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </section>
                </div>
              </div>
            )}

            {/* ── Tabs Content ─────────────────────────────────────────────── */}
            {activeTab === 'dashboard' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <section>
                  {currentTrack
                    ? <HeroNowPlaying track={currentTrack} isPlaying={isPlaying} progressMs={progressMs} formatMs={formatMs} />
                    : (
                      <div className="h-64 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-zinc-600 gap-3">
                        <MicIcon className="h-10 w-10 opacity-20" />
                        <p className="italic text-sm">{t('noTrackPlaying')}</p>
                        <p className="text-xs">Abra o Spotify e toque uma música</p>
                      </div>
                    )
                  }
                </section>

                {/* ── Least Played Insights ────────────────────────────────────── */}
                <section ref={analysisRef}>
                  <LeastPlayedInsights 
                    playlists={playlists} 
                    lastfmUsername={lastfmUsername || undefined} 
                    selectedId={selectedPlaylistId}
                    onSelectId={setSelectedPlaylistId}
                  />
                </section>

                {/* ── Lira Insights + Recent ───────────────────────────────────── */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white tracking-tight">{t('liraInsights')}</h3>
                    <div className="flex flex-col gap-3">
                      {insights.map((insight) => (
                        <LiraInsightCard key={insight.id} insight={insight} />
                      ))}
                    </div>

                    {/* Listening Clock */}
                    <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-950/50">
                      <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-4">{t('listeningClock')}</div>
                      <div className="h-28 flex items-end justify-between gap-1">
                        {clockData.map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-sm transition-all hover:opacity-80 cursor-default"
                            style={{
                              height: `${Math.max(h, 4)}%`,
                              background: h > 50 ? '#1DB954' : h > 20 ? '#1DB95480' : '#27272a'
                            }}
                            title={`${i * 2}h–${i * 2 + 2}h`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Dashboard Footer (Feedback & Community) */}
                    <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800/50 shadow-inner group relative overflow-hidden mt-8 transition-all hover:border-zinc-700">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
                      <div className="flex items-center justify-between mb-3 px-1 relative z-10">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">{t('supportAndCommunity') || 'Suporte & Comunidade'}</span>
                        <div className="flex gap-2">
                           <div className="h-1 w-1 rounded-full bg-spotify-green animate-pulse" />
                           <div className="h-1 w-1 rounded-full bg-indigo-500 animate-pulse delay-75" />
                        </div>
                      </div>
                      <div 
                        onClick={() => setIsHelpOpen(true)}
                        className="h-32 bg-zinc-950 rounded-xl flex flex-col items-center justify-center border border-white/5 relative group-hover:border-indigo-500/20 transition-all duration-500 overflow-hidden cursor-pointer shadow-2xl"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <SparklesIcon className="h-6 w-6 text-zinc-800 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-500" />
                        <span className="mt-2 text-[11px] text-zinc-500 font-bold group-hover:text-white tracking-widest uppercase transition-colors">{t('sendFeedback') || 'Enviar Feedback'}</span>
                        <p className="text-[9px] text-zinc-600 mt-1 px-4 text-center">Ajude a construir o futuro da Scrobblefy</p>
                        <div className="absolute bottom-2 right-2 flex items-center gap-1">
                           <span className="text-[8px] text-zinc-700 font-black uppercase">v1.0.0 Stable</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <RecentTracks tracks={filteredRecent} currentTrackId={currentTrack?.id} />
                  </div>
                </section>
              </div>
            )}


            {activeTab === 'search' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <header>
                  <h2 className="text-2xl font-bold text-white">Explorar Spotify</h2>
                  <p className="text-zinc-400 text-sm mt-1">Busque músicas, artistas e álbuns em tempo real.</p>
                </header>

                {isSearching ? (
                  <div className="h-64 flex flex-col items-center justify-center gap-4 text-zinc-500">
                    <RefreshIcon className="h-10 w-10 animate-spin text-spotify-green/50" />
                    <p className="italic uppercase text-[10px] tracking-widest font-black">Sincronizando...</p>
                  </div>
                ) : searchResults ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Tracks */}
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xl">
                      <h3 className="font-bold text-white flex items-center gap-2 mb-2 underline decoration-spotify-green/30 decoration-2 underline-offset-4 tracking-tighter uppercase text-xs"><MusicIcon className="h-4 w-4" /> Músicas</h3>
                      {searchResults.tracks?.items.slice(0, 6).map((t: any) => (
                        <div key={t.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group cursor-pointer border border-transparent hover:border-zinc-800" onClick={() => setCurrentTrack({id: t.id, name: t.name, album: t.album.name, artist: { id: t.artists[0].id, name: t.artists[0].name }, albumArt: t.album.images[0]?.url, durationMs: t.duration_ms })}>
                          <img src={t.album.images[0]?.url} alt="" className="h-10 w-10 rounded shadow-md group-hover:scale-105 transition-transform" />
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-white truncate group-hover:text-spotify-green transition-colors">{t.name}</div>
                            <div className="text-[10px] text-zinc-500 truncate">{t.artists[0].name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Artists */}
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xl">
                      <h3 className="font-bold text-white flex items-center gap-2 mb-2 underline decoration-indigo-400/30 decoration-2 underline-offset-4 tracking-tighter uppercase text-xs"><UserIcon className="h-4 w-4" /> Artistas</h3>
                      {searchResults.artists?.items.slice(0, 6).map((a: any) => (
                        <div key={a.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group cursor-pointer border border-transparent hover:border-zinc-800">
                          <div className="h-10 w-10 rounded-full overflow-hidden shadow-md group-hover:scale-105 transition-transform border border-zinc-700">
                            <img src={a.images[0]?.url || 'https://via.placeholder.com/150'} alt="" className="h-full w-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-white truncate group-hover:text-indigo-400 transition-colors">{a.name}</div>
                            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">{Math.round(a.followers.total / 1000000)}M Seguidores</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Albums */}
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xl">
                      <h3 className="font-bold text-white flex items-center gap-2 mb-2 underline decoration-emerald-400/30 decoration-2 underline-offset-4 tracking-tighter uppercase text-xs"><LibraryIcon className="h-4 w-4" /> Álbuns</h3>
                      {searchResults.albums?.items.slice(0, 6).map((al: any) => (
                        <div key={al.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group cursor-pointer border border-transparent hover:border-zinc-800">
                          <img src={al.images[0]?.url} alt="" className="h-10 w-10 rounded shadow-md group-hover:scale-105 transition-transform" />
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-white truncate group-hover:text-emerald-400 transition-colors">{al.name}</div>
                            <div className="text-[10px] text-zinc-500 truncate">{al.artists[0].name} · {al.release_date.split('-')[0]}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center gap-4 text-zinc-700">
                    <SearchIcon className="h-16 w-16 opacity-10" />
                    <p className="text-sm italic">O que você gostaria de explorar hoje?</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'taste' && (
              <TasteAnalysis currentTrack={currentTrack} />
            )}
          </div>
        </div>

        {/* ── Player Bar ───────────────────────────────────────────────────── */}
        {currentTrack && (
          <div className="h-24 absolute bottom-0 left-0 w-full bg-black/90 backdrop-blur-xl border-t border-white/5 flex flex-col z-50">
            {/* Progress bar */}
            <div className="w-full h-1 bg-zinc-800 group cursor-pointer">
              <div className="h-full bg-spotify-green group-hover:bg-white transition-colors" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="flex-1 flex items-center justify-between px-6">
              {/* Track info */}
              <div className="flex items-center gap-4 w-1/3 min-w-0">
                <img src={currentTrack.albumArt} className="h-12 w-12 rounded object-cover flex-shrink-0 shadow-lg" alt="art" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{currentTrack.name}</div>
                  <div className="text-xs text-zinc-400 truncate">{currentTrack.artist.name}</div>
                </div>
              </div>
              {/* Controls */}
              <div className="flex flex-col items-center gap-1 w-1/3">
                <div className="flex items-center gap-6">
                  <button onClick={() => spotifyService.previous()} className="text-zinc-500 hover:text-white transition-colors active:scale-90"><SkipBackIcon className="h-5 w-5 fill-current" /></button>
                  <button 
                    onClick={() => isPlaying ? spotifyService.pause() : spotifyService.play()}
                    className="h-10 w-10 rounded-full bg-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10"
                  >
                    {isPlaying ? <PauseIcon className="h-5 w-5 text-black fill-current" /> : <PlayIcon className="h-5 w-5 text-black fill-current ml-0.5" />}
                  </button>
                  <button onClick={() => spotifyService.next()} className="text-zinc-500 hover:text-white transition-colors active:scale-90"><SkipForwardIcon className="h-5 w-5 fill-current" /></button>
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mt-1">
                  {formatMs(progressMs)} / {formatMs(currentTrack.durationMs)}
                </div>
              </div>
              {/* Volume + Scrobble */}
              <div className="hidden md:flex items-center justify-end gap-4 w-1/3 text-zinc-400">
                {isLastfmConnected && (
                  <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-tight">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    Scrobbling
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <VolumeIcon className="h-4 w-4" />
                  <div className="w-16 h-1 bg-zinc-700 rounded-full">
                    <div className="h-full w-2/3 bg-zinc-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Settings Modal ───────────────────────────────────────────────────── */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
        lastfmUsername={lastfmUsername}
        setLastfmUsername={handleConnectLastfm}
        lastfmError={isLastfmError}
      />

      <HelpModal 
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* ── Upgrade Modal (ChatGPT Style) ──────────────────────────────────── */}
      {isUpgradeOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsUpgradeOpen(false)} />
          <div className="relative w-full max-w-5xl bg-[#0D0D0D] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setIsUpgradeOpen(false)}
              className="absolute top-6 right-6 h-10 w-10 text-zinc-500 hover:text-white transition-colors"
            >
              <XIcon className="h-6 w-6" />
            </button>
            
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-12 pb-8 text-center bg-gradient-to-b from-[#0B0B0B] to-black">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-4 text-glow-white">Faça upgrade do seu plano</h2>
              <div className="inline-flex p-1 bg-zinc-900 border border-zinc-800 mb-6">
                <button className="px-6 py-1.5 rounded-full text-xs font-bold bg-zinc-700 text-white shadow-sm">Individual</button>
                <div className="px-6 py-1.5 flex items-center gap-2 group cursor-not-allowed">
                  <span className="text-xs font-bold text-zinc-600">Família</span>
                  <span className="text-[8px] font-black uppercase text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded-md">Em breve</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-2">
                {/* Free */}
                <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 flex flex-col items-start text-left hover:border-zinc-700 transition-colors">
                   <h3 className="text-lg font-black text-white mb-1">Free</h3>
                   <div className="flex items-baseline gap-1 mb-4">
                     <span className="text-zinc-500 text-sm">R$</span>
                     <span className="text-3xl font-black text-white">0</span>
                     <span className="text-zinc-500 text-[10px]">/mês</span>
                   </div>
                   <p className="text-[11px] text-zinc-400 mb-6">Explore o básico da música</p>
                   <button className="w-full py-3 rounded-xl bg-zinc-800 text-zinc-500 text-xs font-bold cursor-not-allowed mb-8">Seu plano atual</button>
                   <ul className="space-y-4">
                     <li className="flex items-start gap-3 text-[11px] text-zinc-300"><CheckIcon className="h-4 w-4 text-zinc-500 flex-shrink-0" /> Estatísticas básicas</li>
                     <li className="flex items-start gap-3 text-[11px] text-zinc-300"><CheckIcon className="h-4 w-4 text-zinc-500 flex-shrink-0" /> 3 Análises Lira / dia</li>
                     <li className="flex items-start gap-3 text-[11px] text-zinc-300"><CheckIcon className="h-4 w-4 text-zinc-500 flex-shrink-0" /> Contém anúncios</li>
                   </ul>
                </div>

                {/* Go / Personal */}
                <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 flex flex-col items-start text-left hover:border-zinc-700 transition-colors group/card">
                   <h3 className="text-lg font-black text-white mb-1">Personal</h3>
                   <div className="flex items-baseline gap-1 mb-4">
                     <span className="text-zinc-500 text-sm">R$</span>
                     <span className="text-3xl font-black text-white">39,90</span>
                     <span className="text-zinc-500 text-[10px]">/mês</span>
                   </div>
                   <p className="text-[11px] text-zinc-400 mb-6">Dashboard completo e fluido</p>
                   <button 
                     onClick={() => window.location.href = `https://checkout.stripe.com/pay/scrobblefy_personal_${Date.now()}`}
                     className="w-full py-3 rounded-xl bg-white text-black text-xs font-extrabold hover:scale-[1.02] active:scale-95 transition-all mb-8 shadow-lg shadow-white/5"
                   >
                     Começar agora
                   </button>
                   <ul className="space-y-4">
                     <li className="flex items-start gap-3 text-[11px] text-zinc-300"><SparklePlusIcon className="h-4 w-4 text-zinc-400 flex-shrink-0" /> Histórico completo</li>
                     <li className="flex items-start gap-3 text-[11px] text-zinc-300"><SparklePlusIcon className="h-4 w-4 text-zinc-400 flex-shrink-0" /> Lira Ilimitada</li>
                     <li className="flex items-start gap-3 text-[11px] text-zinc-300"><SparklePlusIcon className="h-4 w-4 text-zinc-400 flex-shrink-0" /> Zero Anúncios</li>
                   </ul>
                </div>

                {/* Plus - POPULAR */}
                <div className="p-8 rounded-2xl border-2 border-indigo-500 bg-gradient-to-b from-indigo-500/20 to-zinc-900/40 flex flex-col items-start text-left relative overflow-hidden group/card scale-105 z-10 shadow-2xl shadow-indigo-500/10">
                   <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-indigo-500 text-[8px] font-black uppercase text-white animate-pulse">Recomendado</div>
                   <h3 className="text-lg font-black text-white mb-1">Plus</h3>
                   <div className="flex items-baseline gap-1 mb-4">
                     <span className="text-zinc-500 text-sm">R$</span>
                     <span className="text-3xl font-black text-white">59,90</span>
                     <span className="text-zinc-500 text-[10px]">/mês</span>
                   </div>
                   <p className="text-[11px] text-indigo-200 mb-6 font-medium">Insights profundos e exportação</p>
                   <button 
                     onClick={() => window.location.href = `https://checkout.stripe.com/pay/scrobblefy_plus_${Date.now()}`}
                     className="w-full py-3 rounded-xl bg-indigo-600 text-white text-xs font-extrabold hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 transition-all mb-8 shadow-lg shadow-indigo-600/30"
                   >
                     Assinar Plus
                   </button>
                   <ul className="space-y-4">
                     <li className="flex items-start gap-3 text-[11px] text-zinc-300"><SparklePlusIcon className="h-4 w-4 text-indigo-400 flex-shrink-0" /> Exportar Dados (PDF/CSV)</li>
                   </ul>
                </div>

                {/* Pro */}
                <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 flex flex-col items-start text-left hover:border-zinc-700 transition-colors group/card">
                   <h3 className="text-lg font-black text-white mb-1">Pro</h3>
                   <div className="flex items-baseline gap-1 mb-4">
                     <span className="text-zinc-500 text-sm">R$</span>
                     <span className="text-3xl font-black text-white">99,90</span>
                     <span className="text-zinc-500 text-[10px]">/mês</span>
                   </div>
                   <p className="text-[11px] text-zinc-400 mb-6">O poder máximo para curadores</p>
                   <button 
                     onClick={() => window.location.href = `https://checkout.stripe.com/pay/scrobblefy_pro_${Date.now()}`}
                     className="w-full py-3 rounded-xl bg-white text-black text-xs font-extrabold hover:scale-[1.02] active:scale-95 transition-all mb-8 shadow-lg shadow-white/5"
                   >
                     Fazer Upgrade
                   </button>
                   <ul className="space-y-4">
                     <li className="flex items-start gap-3 text-[11px] text-zinc-300"><SparklePlusIcon className="h-4 w-4 text-zinc-300 flex-shrink-0" /> Gestão de Playlist IA</li>
                     <li className="flex items-start gap-3 text-[11px] text-zinc-300"><SparklePlusIcon className="h-4 w-4 text-zinc-300 flex-shrink-0" /> Suporte prioritário 24/7</li>
                     <li className="flex items-start gap-3 text-[11px] text-zinc-300"><SparklePlusIcon className="h-4 w-4 text-zinc-300 flex-shrink-0" /> Todas as futuras features</li>
                   </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-zinc-900/40 py-6 text-center border-t border-zinc-800/50">
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close profile */}
      {isProfileOpen && <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />}
      {/* ── Mobile Bottom Navigation ────────────────────────────────────────── */}
      <footer className={`md:hidden fixed bottom-0 left-0 right-0 h-16 border-t z-50 flex items-center justify-around px-2 backdrop-blur-xl ${
        theme === 'light' ? 'bg-white/80 border-zinc-200' : 'bg-black/90 border-zinc-800'
      }`}>
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-spotify-green' : 'text-zinc-500'}`}
        >
          <HomeIcon className="h-5 w-5" />
          <span className="text-[10px] font-bold">Dashboard</span>
        </button>
        <button 
          onClick={() => setActiveTab('library')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'library' ? 'text-spotify-green' : 'text-zinc-500'}`}
        >
          <SidebarIcon className="h-5 w-5" />
          <span className="text-[10px] font-bold">Biblioteca</span>
        </button>
        <button 
          onClick={() => setActiveTab('taste')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'taste' ? 'text-spotify-green' : 'text-zinc-500'}`}
        >
          <ChartIcon className="h-5 w-5" />
          <span className="text-[10px] font-bold">Lira AI</span>
        </button>
        <button 
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'search' ? 'text-spotify-green' : 'text-zinc-500'}`}
        >
          <SearchIcon className="h-5 w-5" />
          <span className="text-[10px] font-bold">Busca</span>
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'settings' ? 'text-spotify-green' : 'text-zinc-500'}`}
        >
          <SettingsIcon className="h-5 w-5" />
          <span className="text-[10px] font-bold">Ajustes</span>
        </button>
      </footer>
    </div>
  );
};

export default App;
