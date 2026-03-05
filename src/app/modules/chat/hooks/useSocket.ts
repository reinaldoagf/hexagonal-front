import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Inicializamos la conexión
    const socket = io(url, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    // Limpieza al desmontar el componente (Critical Senior Step)
    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.disconnect();
      }
    };
  }, [url]);

  const emitEvent = (event: string, data: any) => {
    socketRef.current?.emit(event, data);
  };

  return {
    socket: socketRef.current,
    isConnected,
    emitEvent
  };
};