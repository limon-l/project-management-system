"use client";

import { use, Suspense } from "react";
import dynamic from "next/dynamic";

const BoardPage = dynamic(() => import("@/components/board-page").then((m) => m.BoardPage), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  ),
});

export default function ProjectBoardPage({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string }>;
}) {
  const { workspaceId, projectId } = use(params);
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <BoardPage projectId={projectId} workspaceId={workspaceId} />
    </Suspense>
  );
}
