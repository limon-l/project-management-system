"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Socket } from "socket.io-client";
import type { ServerToClientEvents, ClientToServerEvents } from "@boardflow/shared";
import { useAuth } from "./use-auth";
import { getSocket, joinProject, leaveProject } from "../lib/socket-client";

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function useRealtime(projectId?: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const joinedRef = useRef(false);

  useEffect(() => {
    if (!user || !projectId) return;

    const socket = getSocket() as AppSocket;

    if (!socket.connected) {
      socket.connect();
    }

    joinProject(projectId);
    joinedRef.current = true;

    function invalidateProject() {
      void queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    }

    function invalidateTasks() {
      void queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    }

    function invalidateDependencies() {
      void queryClient.invalidateQueries({ queryKey: ["dependencies"] });
    }

    function invalidateComments() {
      void queryClient.invalidateQueries({ queryKey: ["comments"] });
    }

    function invalidateMembers() {
      void queryClient.invalidateQueries({ queryKey: ["project-members", projectId] });
    }

    socket.on("task:created", () => { invalidateTasks(); });
    socket.on("task:updated", () => { invalidateTasks(); });
    socket.on("task:moved", () => { invalidateTasks(); });
    socket.on("task:deleted", () => { invalidateTasks(); });

    socket.on("dependency:created", () => { invalidateTasks(); invalidateDependencies(); });
    socket.on("dependency:deleted", () => { invalidateTasks(); invalidateDependencies(); });

    socket.on("column:created", () => { invalidateProject(); });
    socket.on("column:updated", () => { invalidateProject(); });
    socket.on("column:reordered", () => { invalidateProject(); });
    socket.on("column:deleted", () => { invalidateProject(); });

    socket.on("comment:created", () => { invalidateComments(); });
    socket.on("comment:updated", () => { invalidateComments(); });
    socket.on("comment:deleted", () => { invalidateComments(); });

    socket.on("project:updated", () => { invalidateProject(); });
    socket.on("project:member_added", () => { invalidateMembers(); });
    socket.on("project:member_removed", () => { invalidateMembers(); });

    return () => {
      leaveProject(projectId);
      joinedRef.current = false;
      socket.off("task:created");
      socket.off("task:updated");
      socket.off("task:moved");
      socket.off("task:deleted");
      socket.off("dependency:created");
      socket.off("dependency:deleted");
      socket.off("column:created");
      socket.off("column:updated");
      socket.off("column:reordered");
      socket.off("column:deleted");
      socket.off("comment:created");
      socket.off("comment:updated");
      socket.off("comment:deleted");
      socket.off("project:updated");
      socket.off("project:member_added");
      socket.off("project:member_removed");
    };
  }, [user, projectId, queryClient]);
}

export function useWorkspaceRealtime(workspaceId?: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !workspaceId) return;

    const socket = getSocket() as AppSocket;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join:workspace", { workspaceId });

    function invalidateMembers() {
      queryClient.invalidateQueries({ queryKey: ["workspace-members", workspaceId] });
    }

    function invalidateProjects() {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
    }

    socket.on("workspace:member_joined", invalidateMembers);
    socket.on("workspace:member_removed", invalidateMembers);

    return () => {
      socket.emit("leave:workspace", { workspaceId });
      socket.off("workspace:member_joined", invalidateMembers);
      socket.off("workspace:member_removed", invalidateMembers);
    };
  }, [user, workspaceId, queryClient]);
}
