import React, { useState, useEffect, useRef } from 'react';
import { spotifyService } from '../services/spotifyService';
import { Track } from '../types';
import axios from 'axios';

// Heroicon SVGs (Outline)
const SparklesIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.456-2.454L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>);
const RobotIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" /></svg>);
const MusicIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l.31-.088a2.25 2.25 0 0 0 1.632-2.163V6.574C19.5 5.984 19.901 5.467 20.48 5.348l.39-.08a1.503 1.503 0 0 1 1.772 1.474v2.793c0 .59-.401 1.107-.98 1.226l-.39.08a1.503 1.503 0 0 1-1.772-1.474V9z" /></svg>);
const CheckIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>);
const PlayIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653Z" /></svg>);
const UserIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>);
const PaperClipIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32a1.5 1.5 0 1 1-2.121-2.121l10.517-10.517" /></svg>);
const SendIcon = (props: any) => (<svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>);


import { lastfmService } from '../services/lastfmService';

interface Message {
  id: string;
  sender: 'lira' | 'user';
  content: string;
  timestamp: Date;
  tracks?: Track[];
  type?: 'intro' | 'analysis' | 'recommendations' | 'success' | 'error' | 'input'; 
  attachment?: 'track' | 'history' | 'playlist';
}

const TasteAnalysis = ({ currentTrack }: { currentTrack?: Track | null }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isActionsVisible, setIsActionsVisible] = useState(true);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          sender: 'lira',
          content: "Olá! Como posso ajudar você a descobrir algo novo hoje? Você pode me dizer o nome de uma música que gosta, ou anexar seu histórico para uma análise completa. ✨",
          timestamp: new Date(),
          type: 'intro'
        }
      ]);
    }
  }, []);

  const handleSendMessage = async (text: string, attachment?: 'track' | 'history' | 'playlist') => {
    if (!text.trim() && !attachment) return;
    
    setIsLoading(true);
    setIsActionsVisible(false);
    setIsAttachmentOpen(false);

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: text || (attachment === 'track' ? "Analise o que estou ouvindo agora" : attachment === 'history' ? "O que você me recomenda do meu histórico?" : "Analise minhas playlists"),
      timestamp: new Date(),
      attachment
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    try {
      let seedTracks: string[] = [];
      let seedArtists: string[] = [];
      let searchMeta: { title: string; artist: string } | null = null;

      const thinkingMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'lira',
        content: attachment ? "Analisando seu contexto musical... cruzando dados agora." : "Deixe-me ver o que encontro de especial para você...",
        timestamp: new Date(),
        type: 'analysis'
      };
      setMessages(prev => [...prev, thinkingMsg]);

      // 1. Context Gathering Based on Attachment or Text
      if (attachment === 'track' && currentTrack) {
        seedTracks = [currentTrack.id];
        seedArtists = [currentTrack.artist.id];
        searchMeta = { title: currentTrack.name, artist: currentTrack.artist.name };
      } else if (attachment === 'history') {
        const topTracks = await spotifyService.getTopItems('tracks', 'short_term');
        seedTracks = (topTracks || []).slice(0, 3).map((t: any) => t.id);
        const topArtists = await spotifyService.getTopItems('artists', 'short_term');
        seedArtists = (topArtists || []).slice(0, 2).map((a: any) => a.id);
      } else if (text.trim()) {
        const search = await spotifyService.search(text.trim());
        if (search && search.tracks?.items?.length > 0) {
          const mainMatch = search.tracks.items[0];
          seedTracks = [mainMatch.id];
          seedArtists = [mainMatch.artists[0].id];
          searchMeta = { title: mainMatch.name, artist: mainMatch.artists[0].name };
        }
      }

      await new Promise(r => setTimeout(r, 800));

      // 2. High-Fidelity Discovery (Cheat using Last.fm Similarity)
      let finalRecs: Track[] = [];
      
      if (searchMeta) {
        const similarTracks = await lastfmService.getSimilarTracks(searchMeta.artist, searchMeta.title, 6);
        if (similarTracks && similarTracks.length > 0) {
          const resolvePromises = similarTracks.map(async (st: any) => {
            const result = await spotifyService.search(`${st.name} ${st.artist?.name || st.artist || ''}`, 'track');
            return result?.tracks?.items?.[0];
          });
          const resolved = (await Promise.all(resolvePromises)).filter(Boolean).map((t: any) => ({
            id: t.id,
            name: t.name,
            album: t.album.name,
            artist: { id: t.artists[0].id, name: t.artists[0].name },
            albumArt: t.album.images[0]?.url || '',
            durationMs: t.duration_ms
          }));
          finalRecs = resolved;
        }
      }

      // 3. Fallback to Spotify Recommendations
      if (finalRecs.length < 4) {
        let seedGenres: string[] = [];
        if (seedTracks.length === 0 && seedArtists.length === 0) {
          seedGenres = ['pop', 'indie', 'electronic', 'lo-fi'].sort(() => 0.5 - Math.random()).slice(0, 3);
        }

        let recsArr = await spotifyService.getRecommendations(
          seedTracks.length ? seedTracks : undefined,
          seedArtists.length ? seedArtists : undefined,
          seedGenres.slice(0, 2)
        );
        
        // Final fail-safe: Get any tracks from a generic search if both failed
        if (!recsArr || recsArr.length === 0) {
          const fallbackSearch = await spotifyService.search('hit songs 2024', 'track');
          recsArr = (fallbackSearch?.tracks?.items || []).map((t: any) => ({
            id: t.id,
            name: t.name,
            album: t.album.name,
            artist: { id: t.artists[0].id, name: t.artists[0].name },
            albumArt: t.album.images[0]?.url || '',
            durationMs: t.duration_ms
          }));
        }
        
        const newBatch = (recsArr || []).slice(0, 12 - finalRecs.length);
        finalRecs = [...finalRecs, ...newBatch];
      }

      // 4. AI-Powered Insight & Gemini Fallback (The ultimate "Cheat")
      let aiResponseText = "";
      try {
        const chatResponse = await axios.post('/api/lira/chat', {
          message: text || userMsg.content,
          context: { tracks: finalRecs, attachment, current: currentTrack },
          mode: finalRecs.length < 5 ? 'recommend' : 'default'
        });
        
        aiResponseText = chatResponse.data.content;

        // If Gemini suggested tracks (mode: recommend), resolve them
        if (chatResponse.data.suggestions?.length > 0) {
          const suggestions = chatResponse.data.suggestions;
          const resolvePromises = suggestions.slice(0, 10).map(async (st: string) => {
            const result = await spotifyService.search(st, 'track');
            return result?.tracks?.items?.[0];
          });
          const resolved = (await Promise.all(resolvePromises)).filter(Boolean).map((t: any) => ({
            id: t.id,
            name: t.name,
            album: t.album.name,
            artist: { id: t.artists[0].id, name: t.artists[0].name },
            albumArt: t.album.images[0]?.url || '',
            durationMs: t.duration_ms
          }));
          
          // Append unique resolved tracks
          const existingIds = new Set(finalRecs.map(r => r.id));
          resolved.forEach((r: any) => {
            if (!existingIds.has(r.id)) {
              finalRecs.push(r);
              existingIds.add(r.id);
            }
          });
        }
      } catch (err) {
        console.error('Lira AI Error:', err);
        aiResponseText = `Ei! Meu cérebro de IA está configurado com uma chave de teste, mas eu usei minha lógica manual para filtrar ${finalRecs.length || 10} músicas que combinam com você! ⚡✨`;
      }

      // Final Check: If STILL 0 or too few, use SMART fallback (search same artist/title context)
      if (finalRecs.length < 4) {
        const query = searchMeta ? `${searchMeta.artist} style` : (currentTrack ? `${currentTrack.artist.name} vibe` : 'top trending');
        const fallbackSearch = await spotifyService.search(query, 'track');
        const fallbackTracks = (fallbackSearch?.tracks?.items || []).slice(0, 12 - finalRecs.length).map((t: any) => ({
          id: t.id,
          name: t.name,
          album: t.album.name,
          artist: { id: t.artists[0].id, name: t.artists[0].name },
          albumArt: t.album.images[0]?.url || '',
          durationMs: t.duration_ms
        }));
        finalRecs = [...finalRecs, ...fallbackTracks];
      }

      setSelectedTracks(new Set(finalRecs.map(t => t.id)));

      const resultMsg: Message = {
        id: (Date.now() + 2).toString(),
        sender: 'lira',
        content: aiResponseText,
        timestamp: new Date(),
        tracks: finalRecs,
        type: 'recommendations'
      };

      setMessages(prev => [...prev.filter(m => m.type !== 'analysis'), resultMsg]);
    } catch (err) {
      setMessages(prev => [...prev.filter(m => m.type !== 'analysis'), {
        id: Date.now().toString(),
        sender: 'lira',
        content: "Oops! Tive um problema na conexão. Podemos tentar de novo?",
        timestamp: new Date(),
        type: 'error'
      }]);
    } finally {
      setIsLoading(false);
      setIsActionsVisible(true);
    }
  };

  const toggleTrack = (id: string) => {
    const newSelected = new Set(selectedTracks);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedTracks(newSelected);
  };

  const handleCreatePlaylist = async () => {
    if (selectedTracks.size === 0) return;
    setIsLoading(true);
    const uris = Array.from(selectedTracks).map(id => `spotify:track:${id}`);
    const name = `Lira's Selection - ${new Date().toLocaleDateString()}`;
    try {
      await spotifyService.createPlaylist(name, "Descobertas by Lira Discovery.", uris);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'lira',
        content: `Playlist "${name}" criada com sucesso no seu Spotify! ✨`,
        timestamp: new Date(),
        type: 'success'
      }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] max-w-4xl mx-auto bg-zinc-950/40 rounded-[32px] border border-zinc-900 overflow-hidden shadow-2xl relative">
      {/* Header */}
      <div className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-spotify-green/10 border border-spotify-green/20">
            <img src="/lira_chibi.png" alt="Lira" className="h-full w-full object-cover p-1" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white leading-tight">Lira Discovery AI</h2>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-spotify-green animate-pulse" />
              <p className="text-[9px] uppercase font-black tracking-widest text-zinc-500 font-mono">Curator Protocol Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 no-scrollbar scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex gap-3 max-w-[90%] md:max-w-[75%] ${msg.sender === 'user' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
              <div className={`flex-shrink-0 h-8 w-8 rounded-full border flex items-center justify-center overflow-hidden ${msg.sender === 'user' ? 'bg-zinc-800 border-zinc-700' : 'bg-spotify-green/10 border-spotify-green/20'}`}>
                {msg.sender === 'user' ? (
                  <UserIcon className="h-4 w-4 text-zinc-400" />
                ) : (
                  <img src="/lira_chibi.png" alt="Lira" className="h-full w-full object-cover rounded-full" />
                )}
              </div>
              
              <div className="space-y-4">
                <div className={`px-4 py-2.5 rounded-[22px] shadow-2xl transition-all duration-300 ${
                  msg.sender === 'user' 
                  ? 'bg-gradient-to-br from-spotify-green to-emerald-500 text-black font-bold rounded-tr-none' 
                  : 'bg-gradient-to-br from-indigo-600/20 to-violet-600/20 backdrop-blur-md border border-indigo-500/30 text-zinc-100 rounded-tl-none'
                }`}>
                  <p className="text-[13px] leading-relaxed tracking-tight font-medium">{msg.content}</p>
                </div>

                {msg.tracks && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
                    {msg.tracks.map((track, idx) => {
                      const isSelected = selectedTracks.has(track.id);
                      return (
                        <div 
                          key={`${track.id}-${idx}`}
                          onClick={() => toggleTrack(track.id)}
                          className={`group relative p-2 rounded-xl border transition-all cursor-pointer ${
                            isSelected 
                            ? 'bg-spotify-green/10 border-spotify-green' 
                            : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative h-8 w-8 rounded shadow-md flex-shrink-0 overflow-hidden">
                              <img src={track.albumArt} alt="" className="h-full w-full object-cover" />
                              {isSelected && (
                                <div className="absolute inset-0 bg-spotify-green/40 flex items-center justify-center">
                                  <CheckIcon className="h-4 w-4 text-black stroke-[3px]" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className={`text-[10px] font-bold truncate ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{track.name}</div>
                              <div className="text-[9px] text-zinc-500 truncate">{track.artist.name}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-zinc-900/40 px-4 py-2 rounded-2xl rounded-tl-none border border-zinc-800 flex gap-1 items-center">
                <div className="h-3 w-3 border-2 border-spotify-green border-t-transparent rounded-full animate-spin mr-2" />
                <span className="h-1.5 w-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:0s]" />
                <span className="h-1.5 w-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Overlay Actions */}
      {isActionsVisible && selectedTracks.size > 0 && (
         <div className="px-6 py-2 bg-gradient-to-t from-zinc-900 to-transparent flex justify-center">
            <button 
              onClick={handleCreatePlaylist}
              className="px-6 py-2 bg-spotify-green text-black rounded-full text-xs font-black shadow-xl shadow-spotify-green/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <MusicIcon className="h-4 w-4" /> Criar Playlist ({selectedTracks.size})
            </button>
         </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 backdrop-blur-xl relative">
        {isAttachmentOpen && (
          <div className="absolute bottom-full left-4 mb-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-2xl animate-in slide-in-from-bottom-2 duration-200 z-10 w-64">
             <button 
               onClick={() => handleSendMessage('', 'track')}
               disabled={!currentTrack}
               className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-left transition-colors disabled:opacity-30"
             >
                <div className="h-8 w-8 rounded-lg bg-spotify-green/10 flex items-center justify-center">
                  <PlayIcon className="h-4 w-4 text-spotify-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">Ouvindo Agora</div>
                  <div className="text-[10px] text-zinc-500 truncate">{currentTrack?.name || 'Nada tocando'}</div>
                </div>
             </button>
             <button 
               onClick={() => handleSendMessage('', 'history')}
               className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-left transition-colors"
             >
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <SparklesIcon className="h-4 w-4 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white">Meu Histórico</div>
                  <div className="text-[10px] text-zinc-500">Analisar mais ouvidas</div>
                </div>
             </button>
          </div>
        )}

        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button 
            onClick={() => setIsAttachmentOpen(!isAttachmentOpen)}
            className={`h-11 w-11 rounded-2xl flex items-center justify-center border transition-all ${isAttachmentOpen ? 'bg-zinc-800 border-zinc-600' : 'bg-black border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700'}`}
          >
            <PaperClipIcon className="h-5 w-5" />
          </button>
          <div className="relative flex-1">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              placeholder="Digite o nome de uma música ou artista..."
              className="w-full h-11 bg-black border border-zinc-800 rounded-2xl px-5 text-sm focus:outline-none focus:ring-2 focus:ring-spotify-green/20 focus:border-spotify-green/40 transition-all placeholder:text-zinc-600"
            />
            <button 
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim()}
              className="absolute right-2 top-1.5 h-8 w-8 bg-spotify-green rounded-xl flex items-center justify-center text-black shadow-lg shadow-spotify-green/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100"
            >
              <SendIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasteAnalysis;
