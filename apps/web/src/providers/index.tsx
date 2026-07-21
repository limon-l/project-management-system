"use client";

import { type ReactNode } from "react";
import { Toaster } from "sonner";
import { QueryProvider } from "./query-provider";
import { SessionProvider } from "./session-provider";
import { SocketProvider } from "./socket-provider";
import { NotificationProvider } from "./notification-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <SessionProvider>
        <SocketProvider>
          <NotificationProvider>
            {children}
            <Toaster position="bottom-right" richColors />
          </NotificationProvider>
        </SocketProvider>
      </SessionProvider>
    </QueryProvider>
  );
}
