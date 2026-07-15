"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ProjectLayout } from "@/components/project-layout";
import Link from "next/link";

export default function ProjectOverviewPage({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string }>;
}) {
  const { workspaceId, projectId } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <ProjectLayout
      projectId={projectId}
      workspaceId={workspaceId}
      projectName="Project"
      projectKey="PRJ"
    >
      <div className="flex h-14 items-center border-b border-border px-6">
        <h1 className="text-lg font-semibold">Project Overview</h1>
      </div>
      <div className="p-6">
        <Link
          href={`/workspaces/${workspaceId}/projects/${projectId}/board`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Open Board
        </Link>
      </div>
    </ProjectLayout>
  );
}
