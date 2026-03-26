import React from 'react';
// Heroicons
const SparklesIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.456-2.454L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>);
const ChartIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>);
import { useTranslation } from 'react-i18next';

interface Insight {
  id: string;
  type: string;
  content: string;
  icon: string;
}

interface LiraInsightCardProps {
  insight: Insight;
  key?: string | number;
}

const LiraInsightCard = ({ insight }: LiraInsightCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="group relative overflow-hidden rounded-xl bg-zinc-900/50 border border-white/5 p-6 hover:bg-zinc-900 transition-colors duration-300">
      <div className="flex items-start gap-4">
        <div className="mt-1 flex-shrink-0">
          <div className="h-10 w-10 rounded-full border border-zinc-800 bg-zinc-950 p-2 flex items-center justify-center">
            {insight.icon === 'chart' ? <ChartIcon className="h-5 w-5 text-spotify-green" /> : <SparklesIcon className="h-5 w-5 text-spotify-green" />}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            {t('liraInsight')}
          </div>
          <p className="text-sm font-light leading-relaxed text-zinc-200">
            {insight.content}
          </p>
        </div>
      </div>
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-3xl transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none" />
    </div>
  );
};

export default LiraInsightCard;