import { io, type Socket } from "socket.io-client";
import type { ServerToClientEvents, ClientToServerEvents } from "@boardflow/shared";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
let lastAuthFailure = 0;
const AUTH_COOLDOWN_MS = 10_000;

export function getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
  socket ??= io(SOCKET_URL, {
    auth: async () => {
      // Prevent hammering the endpoint after a recent failure
      if (Date.now() - lastAuthFailure < AUTH_COOLDOWN_MS) {
        return {};
      }
      try {
        // Fetch the socket token through the same-origin Next.js proxy so the
        // session cookie is sent automatically (avoids cross-origin cookie issues
        // with SameSite=Lax in production).
        const response = await fetch(`/api/auth/socket-token`, {
          credentials: "include",
        });
        if (!response.ok) {
          lastAuthFailure = Date.now();
          return {};
        }
        const body = (await response.json()) as {
          success?: boolean;
          data?: { token?: string };
        };
        if (body.success && body.data?.token) {
          return { token: body.data.token };
        }
        lastAuthFailure = Date.now();
        return {};
      } catch {
        lastAuthFailure = Date.now();
        return {};
      }
    },
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function joinProject(projectId: string): void {
  getSocket().emit("join:project", { projectId });
}

export function leaveProject(projectId: string): void {
  getSocket().emit("leave:project", { projectId });
}

export function joinWorkspace(workspaceId: string): void {
  getSocket().emit("join:workspace", { workspaceId });
}

export function leaveWorkspace(workspaceId: string): void {
  getSocket().emit("leave:workspace", { workspaceId });
}
