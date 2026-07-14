import { io, type Socket } from "socket.io-client";
import type { ServerToClientEvents, ClientToServerEvents } from "@boardflow/shared";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
  }
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
