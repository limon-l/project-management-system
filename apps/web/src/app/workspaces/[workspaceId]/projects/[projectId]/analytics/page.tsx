"use client";

import { use } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ProjectLayout } from "@/components/project-layout";
import { useProjects } from "@/hooks/use-projects";

const ProjectAnalytics = dynamic(
  () => import("@/components/project-analytics").then((m) => ({ default: m.ProjectAnalytics })),
  { ssr: false }
);

export default function ProjectAnalyticsPage({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string }>;
}) {
  const { workspaceId, projectId } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { data: projects = [] } = useProjects(workspaceId);
  const project = projects.find((p: { id: string }) => p.id === projectId);

  if (authLoading) {
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
      projectName={project?.name ?? "Project"}
      projectKey={project?.key ?? "PRJ"}
    >
      <div className="flex h-14 items-center border-b border-border px-6">
        <h1 className="text-lg font-semibold">Analytics</h1>
      </div>
      <div className="p-6">
        <ProjectAnalytics projectId={projectId} />
      </div>
    </ProjectLayout>
  );
}
