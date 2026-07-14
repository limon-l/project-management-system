"use client";

import { use } from "react";
import { BoardPage } from "@/components/board-page";

export default function ProjectBoardPage({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string }>;
}) {
  const { workspaceId, projectId } = use(params);
  return <BoardPage projectId={projectId} workspaceId={workspaceId} />;
}
