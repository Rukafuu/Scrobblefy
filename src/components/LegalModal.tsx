import React, { useState } from 'react';
import { X, ShieldCheck, Info, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'cookies' | 'terms';
}

const Toggle = ({ active, disabled = false, onChange }: { active: boolean, disabled?: boolean, onChange?: (v: boolean) => void }) => (
  <button 
    onClick={() => !disabled && onChange?.(!active)}
    className={`relative h-6 w-11 rounded-full transition-colors duration-200 outline-none ${active ? 'bg-spotify-green' : 'bg-zinc-700'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${active ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

const LegalModal = ({ isOpen, onClose, initialTab = 'cookies' }: LegalModalProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'cookies' | 'terms'>(initialTab);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(true);

  // Sync tab when opening
  React.useEffect(() => {
    if (isOpen) setActiveTab(initialTab);
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleFullPolicy = () => {
    window.open('https://www.spotify.com/br/legal/privacy-policy/', '_blank');
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-zinc-950 border border-zinc-800 rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-zinc-900 bg-zinc-950/50">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {activeTab === 'cookies' ? t('cookiePrefCenter') : t('termsOfService')}
            </h2>
            <div className="flex gap-4 mt-2">
              <button 
                onClick={() => setActiveTab('cookies')}
                className={`text-[10px] font-black uppercase tracking-[0.2em] pb-1 border-b-2 transition-all ${activeTab === 'cookies' ? 'border-spotify-green text-white' : 'border-transparent text-zinc-500'}`}
              >
                Cookies
              </button>
              <button 
                onClick={() => setActiveTab('terms')}
                className={`text-[10px] font-black uppercase tracking-[0.2em] pb-1 border-b-2 transition-all ${activeTab === 'terms' ? 'border-spotify-green text-white' : 'border-transparent text-zinc-500'}`}
              >
                {t('termsOfService').split(' ')[0]}
              </button>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 rounded-full hover:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-all active:scale-90"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8 flex-1">
          {activeTab === 'cookies' ? (
            <div className="space-y-8">
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                {t('cookieIntro')} <span className="text-spotify-green border-b border-spotify-green/30 cursor-pointer hover:text-emerald-400 transition-colors">{t('learnMore')}</span>
              </p>

              <div className="space-y-6">
                <div className="flex items-start justify-between gap-6 group">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">{t('strictlyNecessary')}</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed max-w-sm">{t('strictlyNecessaryDesc')}</p>
                  </div>
                  <Toggle active={true} disabled={true} />
                </div>

                <div className="h-px bg-zinc-900 w-full" />

                <div className="flex items-start justify-between gap-6 group">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">{t('analyticsCookies')}</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed max-w-sm">{t('analyticsCookiesDesc')}</p>
                  </div>
                  <Toggle active={analyticsEnabled} onChange={setAnalyticsEnabled} />
                </div>

                <div className="h-px bg-zinc-900 w-full" />

                <div className="flex items-start justify-between gap-6 group">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">{t('marketingCookies')}</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed max-w-sm">{t('marketingCookiesDesc')}</p>
                  </div>
                  <Toggle active={marketingEnabled} onChange={setMarketingEnabled} />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-sm text-zinc-400 leading-relaxed">
              <section className="space-y-3">
                <h4 className="text-white font-bold flex items-center gap-2 italic uppercase tracking-widest text-[10px]">
                  <ShieldCheck className="h-4 w-4 text-spotify-green" />
                  {t('privacyFirst')}
                </h4>
                <p>O Scrobblefy é uma ferramenta de terceiros que utiliza os dados fornecidos pelas APIs oficiais do Spotify e Last.fm. Não alteramos sua biblioteca sem sua permissão explícita (como ao criar uma playlist recomendada pela Lira).</p>
              </section>
              
              <section className="space-y-3">
                <h4 className="text-white font-bold font-mono text-[10px] uppercase tracking-widest">{t('responsibility')}</h4>
                <p>{t('responsibilityDesc')}</p>
              </section>

              <div 
                onClick={handleFullPolicy}
                className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 flex items-center gap-4 group cursor-pointer hover:border-zinc-700 transition-all hover:bg-zinc-900"
              >
                <div className="h-10 w-10 rounded-full bg-zinc-950 flex items-center justify-center text-zinc-500 group-hover:text-spotify-green transition-colors">
                  <Info className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-white">{t('privacyPolicyFull')}</div>
                  <div className="text-[10px] text-zinc-600 mt-0.5">{t('privacyPolicyFullDesc')}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-700" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-zinc-900 bg-zinc-950/80 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-zinc-400 text-xs font-bold hover:text-white transition-colors"
          >
            {t('cancel')}
          </button>
          <button 
            onClick={onClose}
            className="px-8 py-2.5 rounded-full bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors shadow-lg active:scale-95"
          >
            {t('confirmChoices')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
