'use client';

import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../hooks/useSocket';

interface ChatMessage {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  room?: string;
}

export const ChatRoom = () => {
  const { socket, emitEvent } = useSocket('http://localhost:4000');
  
  // ESTADOS NUEVOS
  const [username, setUsername] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentRoom, setCurrentRoom] = useState('General');
  const [typingStatus, setTypingStatus] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.on('new_message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('user_typing', (status: string) => {
      setTypingStatus(status);
      const timer = setTimeout(() => setTypingStatus(''), 3000);
      return () => clearTimeout(timer);
    });

    return () => {
      socket.off('new_message');
      socket.off('user_typing');
    };
  }, [socket]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !username) return;

    emitEvent('send_to_room', {
      room: currentRoom,
      message: {
        user: username, // Usamos el nombre real
        content: inputMessage,
      }
    });

    setInputMessage('');
  };

  const handleTyping = () => {
    if (username) socket?.emit('typing', username);
  };

  // Función para establecer el nombre de usuario
  const handleJoinChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim().length >= 3) {
      setUsername(tempName.trim());
    }
  };

  return (
    <div className="relative w-full h-[600px]">
      
      {/* MODAL PARA NOMBRE DE USUARIO */}
      {!username && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-900/80 backdrop-blur-sm rounded-xl">
          <form 
            onSubmit={handleJoinChat}
            className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 w-80 flex flex-col gap-4"
          >
            <div className="text-center">
              <h3 className="text-xl font-bold">Bienvenido</h3>
              <p className="text-sm text-zinc-500">Ingresa tu nombre para comenzar</p>
            </div>
            <input
              autoFocus
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Ej. Alexander"
              className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 text-center focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="submit"
              disabled={tempName.trim().length < 3}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Entrar al Chat
            </button>
          </form>
        </div>
      )}

      {/* ESTRUCTURA DEL CHAT (IGUAL QUE ANTES, PERO CON USERNAME) */}
      <div className={`flex flex-col h-full bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden ${!username ? 'blur-md pointer-events-none' : ''}`}>
        
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex gap-2">
            {['General', 'Tech', 'Random'].map((r) => (
              <button
                key={r}
                onClick={() => { setCurrentRoom(r); socket?.emit('join_room', r); }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  currentRoom === r ? 'bg-blue-600 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                #{r}
              </button>
            ))}
          </div>
          <div className="text-[10px] text-zinc-400 font-mono">
             USUARIO: <span className="text-blue-500 font-bold">{username}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 dark:bg-zinc-900/20">
          {messages.filter(m => !m.room || m.room === currentRoom).map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.user === username ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.user === username 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none border border-zinc-200 dark:border-zinc-700'
              }`}>
                <p className="font-bold text-[10px] mb-1 opacity-70 uppercase">{msg.user}</p>
                <p>{msg.content}</p>
              </div>
              <span className="text-[9px] text-zinc-500 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {typingStatus && (
          <div className="px-4 py-1 text-[10px] text-blue-500 animate-pulse italic">
            {typingStatus}
          </div>
        )}

        <form onSubmit={handleSendMessage} className="p-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleTyping}
            placeholder={`Escribe un mensaje en #${currentRoom}...`}
            className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all active:scale-95"
          >
            →
          </button>
        </form>
      </div>
    </div>
  );
};