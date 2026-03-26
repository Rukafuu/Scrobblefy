import React from 'react';
// Heroicons
const XIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>);
const GlobeIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>);
const MoonIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0 1 12 21.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>);
const SunIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.25-1.591 1.591M3 12h2.25m.386-6.364 1.591 1.591M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>);
const LogOutIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>);
import { useTranslation } from 'react-i18next';
import LegalModal from './LegalModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  theme: string;
  setTheme: (theme: string) => void;
  lastfmUsername: string | null;
  setLastfmUsername: () => void;
  lastfmError?: boolean;
}

const SettingsModal = ({ 
  isOpen, 
  onClose, 
  onLogout, 
  theme, 
  setTheme, 
  lastfmUsername, 
  setLastfmUsername,
  lastfmError = false
}: SettingsModalProps) => {
  const { t, i18n } = useTranslation();
  const [legalTab, setLegalTab] = React.useState<'cookies' | 'terms'>('cookies');
  const [isLegalOpen, setIsLegalOpen] = React.useState(false);

  if (!isOpen) return null;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const openLegal = (tab: 'cookies' | 'terms') => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  const getStatusColor = () => {
    if (lastfmError) return 'bg-yellow-500';
    if (lastfmUsername) return 'bg-emerald-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (lastfmError) return 'Erro';
    if (lastfmUsername) return 'Logado';
    return 'Deslogado';
  };

  return (
    <>
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0D0D0D] border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-black/20">
          <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">{t('settings')}</h2>
          <button 
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:shadow-lg transition-all"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto max-h-[75vh] no-scrollbar">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 font-black uppercase text-[10px] tracking-[0.2em] px-1">
              <GlobeIcon className="h-3.5 w-3.5" />
              {t('language')}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => changeLanguage('en')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${i18n.language.startsWith('en') ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600'}`}
              >
                English
              </button>
              <button 
                onClick={() => changeLanguage('pt')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${i18n.language.startsWith('pt') ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600'}`}
              >
                Português
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 font-black uppercase text-[10px] tracking-[0.2em] px-1">
              <MoonIcon className="h-3.5 w-3.5" />
              {t('theme')}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                {id: 'dark', icon: MoonIcon, label: t('dark')},
                {id: 'light', icon: SunIcon, label: t('light')},
                {id: 'system', icon: ({className}:any)=><div className={`h-4 w-4 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-400 ${className}`} />, label: t('system')}
              ].map(opt => (
                <button 
                  key={opt.id}
                  onClick={() => setTheme(opt.id)}
                  className={`py-4 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex flex-col items-center gap-2 ${theme === opt.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500'}`}
                >
                  <opt.icon className="h-4 w-4" />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 font-black uppercase text-[10px] tracking-[0.2em]">
                <div className="h-3.5 w-3.5 rounded-sm bg-indigo-500 flex items-center justify-center text-[7px] text-white">L</div>
                Last.fm
              </div>
              <div className={`flex items-center gap-2 px-2 py-0.5 rounded-full ${theme === 'light' ? 'bg-zinc-100' : 'bg-white/5'}`}>
                <div className={`h-1 w-1 rounded-full ${getStatusColor()} animate-pulse`} />
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{getStatusText()}</span>
              </div>
            </div>
            <button 
              onClick={lastfmUsername ? undefined : setLastfmUsername}
              className={`w-full py-4 px-5 rounded-2xl text-sm font-bold transition-all flex items-center justify-between group border ${lastfmUsername ? 'bg-zinc-100 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-400' : 'bg-red-500 border-red-400 text-white hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-red-500/20'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-black transition-colors ${lastfmUsername ? 'bg-white dark:bg-zinc-800 text-zinc-300 group-hover:text-red-500' : 'bg-white text-red-500'}`}>L</div>
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">Status</div>
                  <div className="text-xs font-bold mt-1 text-zinc-500 dark:text-zinc-400">{lastfmUsername ? `@${lastfmUsername}` : lastfmError ? 'Problema Detectado' : 'Desconectado'}</div>
                </div>
              </div>
              {!lastfmUsername && <div className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 rounded-md">Conectar</div>}
            </button>
          </div>

          <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-900">
             <button 
              onClick={onLogout}
              className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all bg-zinc-900 text-zinc-400 hover:bg-red-500 hover:text-white hover:shadow-2xl hover:shadow-red-500/20"
            >
              Log Out
            </button>
            <div className="flex justify-center gap-6">
              <button onClick={() => openLegal('terms')} className="text-[9px] font-black text-zinc-400 hover:text-indigo-500 uppercase tracking-widest transition-colors">{t('termsOfService')}</button>
              <button onClick={() => openLegal('cookies')} className="text-[9px] font-black text-zinc-400 hover:text-indigo-500 uppercase tracking-widest transition-colors">{t('cookiesAndPrivacy')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <LegalModal 
      isOpen={isLegalOpen} 
      onClose={() => setIsLegalOpen(false)} 
      initialTab={legalTab} 
    />
    </>
  );
};

export default SettingsModal;
