"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "../hooks/use-auth";
import { getSocket, disconnectSocket } from "../lib/socket-client";

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

  useEffect(() => {
    if (!user) {
      if (isConnected) {
        disconnectSocket();
        setIsConnected(false);
      }
      return;
    }

    const socket = getSocket();

    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [user, isConnected]);

  return (
    <SocketContext.Provider value={{ isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
