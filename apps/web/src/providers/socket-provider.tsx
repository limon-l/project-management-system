"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
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
  const isConnected = useRef(false);

  useEffect(() => {
    if (!user) {
      if (isConnected.current) {
        disconnectSocket();
        isConnected.current = false;
      }
      return;
    }

    const socket = getSocket();

    const onConnect = () => {
      isConnected.current = true;
    };

    const onDisconnect = () => {
      isConnected.current = false;
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    if (socket.connected) {
      isConnected.current = true;
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ isConnected: isConnected.current }}>
      {children}
    </SocketContext.Provider>
  );
}
