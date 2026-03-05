// src/modules/chat/components/ChatRoom.tsx

'use client';
import { useSocket } from '../hooks/useSocket';
import { useState, useEffect } from 'react';

// 1. Definimos la interfaz para que coincida con el backend
interface ChatMessage {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
}

export const ChatRoom = () => {
  const { socket, isConnected, emitEvent } = useSocket('http://localhost:4000');
  
  // 2. Cambiamos el estado de string[] a ChatMessage[]
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!socket) return;

    // 3. El evento recibe el objeto completo del backend
    socket.on('new_message', (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => { socket.off('new_message'); };
  }, [socket]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-sm">
        <span>Status:</span>
        <span className={isConnected ? "text-green-500" : "text-red-500"}>
          {isConnected ? '● Online' : '● Offline'}
        </span>
      </div>

      <div className="h-80 overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-zinc-50 dark:bg-zinc-950">
        {messages.map((m) => (
          <div key={m.id} className="mb-3">
            {/* 4. AQUÍ ESTABA EL ERROR: Accedemos a las propiedades del objeto */}
            <span className="font-bold text-blue-500">{m.user}: </span>
            <span className="text-zinc-800 dark:text-zinc-200">{m.content}</span>
            <div className="text-[10px] text-zinc-400">
              {new Date(m.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => emitEvent('send_message', { user: 'SeniorDev', content: '¡Hola mundo!' })}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all"
        >
          Enviar Test
        </button>
      </div>
    </div>
  );
};