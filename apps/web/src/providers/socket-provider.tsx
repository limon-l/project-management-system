"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getSocket, disconnectSocket } from "@/lib/socket-client";

interface SocketContextValue {
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue>({
  isConnected: false,
});

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = useCallback(() => setIsConnected(true), []);
  const handleDisconnect = useCallback(() => setIsConnected(false), []);

  useEffect(() => {
    if (!user) {
      disconnectSocket();
      setIsConnected(false);
      return;
    }

    const socket = getSocket();

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (!socket.connected) {
      socket.connect();
    } else {
      setIsConnected(true);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [user, handleConnect, handleDisconnect]);

  return (
    <SocketContext.Provider value={{ isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
