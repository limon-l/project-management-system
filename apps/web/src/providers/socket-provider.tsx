"use client";

import { createContext, useContext, type ReactNode } from "react";

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
  return (
    <SocketContext.Provider value={{ isConnected: false }}>
      {children}
    </SocketContext.Provider>
  );
}
