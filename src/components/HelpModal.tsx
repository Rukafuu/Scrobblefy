import React, { useState, useEffect } from 'react';
// Heroicons
const XIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>);
const KeyboardIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-18-12h18A2.25 2.25 0 0 1 21 6.75v7.5A2.25 2.25 0 0 1 18.75 16.5H5.25A2.25 2.25 0 0 1 3 14.25v-7.5A2.25 2.25 0 0 1 5.25 4.5ZM7.5 7.5h.008v.008H7.5V7.5Zm3.75 0h.008v.008H11.25V7.5Zm3.75 0h.008v.008H15V7.5Zm-7.5 3.75h.008v.008H7.5v-.008Zm3.75 0h.008v.008H11.25v-.008Zm3.75 0h.008v.008H15v-.008Zm3.75 0h.008v.008H18.75v-.008ZM12 13.5h.008v.008H12V13.5Zm3.75 0h.008v.008H15.75V13.5ZM8.25 13.5h.008v.008H8.25V13.5Z" /></svg>);
const QuestionIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>);
const ChatIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a.75.75 0 0 1-1.154-.114 2.31 2.31 0 0 1-.444-1.032 4.306 4.306 0 0 1 .655-3.487C3.556 14.776 3 13.446 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg>);
const LaptopIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" /></svg>);
const CheckCircleIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>);
const InboxIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m16.5 0v-2.25A2.25 2.25 0 0 0 18 3H6a2.25 2.25 0 0 0-2.25 2.25v2.25m16.5 0H3.75m16.5 0h-3.375a1.125 1.125 0 0 1-1.125-1.125V5.625m-12 1.875h3.375c.621 0 1.125-.504 1.125-1.125V5.625m3.75 1.875v-1.125A1.125 1.125 0 0 1 13.125 4.5h.75A1.125 1.125 0 0 1 15 5.625v1.125" /></svg>);
const ClockIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>);
import { useTranslation } from 'react-i18next';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Key = ({ children }: { children: React.ReactNode }) => (
  <kbd className="px-2 py-1.5 min-w-[32px] inline-flex items-center justify-center text-[10px] font-black uppercase tracking-tighter bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md shadow-sm text-zinc-600 dark:text-zinc-300">
    {children}
  </kbd>
);

const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'shortcuts' | 'feedback' | 'admin'>('shortcuts');
  const [feedback, setFeedback] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    if (activeTab === 'admin') {
      fetch('/api/admin/feedbacks')
        .then(res => res.json())
        .then(data => setFeedbacks(data.reverse()))
        .catch(err => console.error(err));
    }
  }, [activeTab]);

  if (!isOpen) return null;

  const handleSendFeedback = async () => {
    if (!feedback.trim()) return;
    setSending(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: feedback,
          user: localStorage.getItem('userProfile') || 'Anonymous',
          timestamp: new Date().toISOString()
        })
      });
      if (response.ok) {
        setSent(true);
        setFeedback('');
        setTimeout(() => setSent(false), 3000);
      }
    } catch (error) {
      console.error('Feedback Error:', error);
    } finally {
      setSending(false);
    }
  };

  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[520px] animate-in zoom-in-95 duration-200">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-zinc-50 dark:bg-zinc-900/50 border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-900 p-6 flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-6 px-2">
            <QuestionIcon className="h-6 w-6 text-spotify-green" />
            <h2 className="text-xl font-black tracking-tighter dark:text-white">Suporte</h2>
          </div>
          
          <button 
            onClick={() => setActiveTab('shortcuts')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'shortcuts' ? 'bg-white dark:bg-zinc-800 text-spotify-green shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
          >
            <KeyboardIcon className="h-4 w-4" />
            Atalhos
          </button>
          
          <button 
            onClick={() => setActiveTab('feedback')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'feedback' ? 'bg-white dark:bg-zinc-800 text-spotify-green shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
          >
            <ChatIcon className="h-4 w-4" />
            Enviar Feedback
          </button>

          {isAdmin && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'admin' ? 'bg-white dark:bg-zinc-800 text-emerald-500 shadow-sm' : 'text-zinc-500 hover:text-emerald-400'}`}
            >
              <InboxIcon className="h-4 w-4" />
              Ver InboxIcon
            </button>
          )}

          <div className="mt-auto p-4 bg-spotify-green/10 rounded-2xl border border-spotify-green/20">
            <div className="flex items-center gap-3 mb-2">
              <img src="/lira_chibi.png" alt="" className="h-8 w-8 rounded-full bg-zinc-950" />
              <div className="text-[10px] font-black uppercase text-spotify-green">Lira AI Support</div>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed italic">"Precisa de algo mais? Lira está aqui para te ouvir!"</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col relative min-h-0 min-w-0">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 h-10 w-10 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all z-10"
          >
            <XIcon className="h-5 w-5" />
          </button>

          <div className="p-10 overflow-y-auto custom-scrollbar flex-1">
            {activeTab === 'shortcuts' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-6">
                   <div className="h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                    <KeyboardIcon className="h-6 w-6 text-zinc-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold dark:text-white">Guia de Atalhos Rápidos</h3>
                    <p className="text-xs text-zinc-500">Acelere seu ritmo com hotkeys intuitivas.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                      <LaptopIcon className="h-3 w-3" />
                      Desktop & Web
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900">
                        <span className="text-sm font-medium dark:text-zinc-300">Focar na Pesquisa</span>
                        <div className="flex gap-1 items-center">
                          {isMac ? <Key>⌘</Key> : <Key>CTRL</Key>}
                          <span className="text-zinc-400">+</span>
                          <Key>K</Key>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900">
                        <span className="text-sm font-medium dark:text-zinc-300">Play / Pause</span>
                        <Key>ESPAÇO</Key>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900">
                        <span className="text-sm font-medium dark:text-zinc-300">Ajuda / Feedback</span>
                        <Key>H</Key>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'feedback' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 h-full flex flex-col">
                <div className="flex items-center gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-6">
                  <div className="h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                    <ChatIcon className="h-6 w-6 text-spotify-green" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold dark:text-white">Papo com a Lira</h3>
                    <p className="text-xs text-zinc-500">Encontrou um bug? Tem uma sugestão brilhante? Me conta!</p>
                  </div>
                </div>

                {sent ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95 duration-500">
                    <div className="h-16 w-16 rounded-full bg-spotify-green/10 flex items-center justify-center text-spotify-green">
                      <CheckCircleIcon className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="font-bold dark:text-white">Feedback Recebido!</h4>
                      <p className="text-xs text-zinc-500 mt-1">Lira vai analisar cada detalhe com carinho.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col gap-4">
                    <textarea 
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Escreva sua sugestão ou reporte um erro aqui..."
                      className="flex-1 w-full p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900 focus:border-spotify-green/50 focus:outline-none focus:ring-4 focus:ring-spotify-green/5 text-sm resize-none dark:text-white transition-all placeholder:text-zinc-400"
                    />
                    <button 
                      onClick={handleSendFeedback}
                      disabled={sending || !feedback.trim()}
                      className="w-full py-4 rounded-2xl bg-spotify-green text-white font-bold text-sm hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-spotify-green/20 disabled:opacity-50"
                    >
                      {sending ? 'Enviando...' : 'Enviar Mensagem para Lira'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'admin' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-6">
                  <div>
                    <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                       <InboxIcon className="h-5 w-5 text-emerald-500" />
                       InboxIcon de Feedback
                    </h3>
                    <p className="text-xs text-zinc-500">Mensagens recebidas dos seus usuários.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {feedbacks.length === 0 ? (
                    <div className="py-20 text-center text-zinc-500 italic text-sm">Nenhum feedback recebido ainda.</div>
                  ) : feedbacks.map((f: any) => (
                    <div key={f.id} className="p-5 rounded-[24px] bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-black uppercase text-zinc-400">{f.user || 'Visitante'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                          <ClockIcon className="h-3 w-3" />
                          {new Date(f.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <p className="text-sm dark:text-zinc-300 leading-relaxed">{f.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
