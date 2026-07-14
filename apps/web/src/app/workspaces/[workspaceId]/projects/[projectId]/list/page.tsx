"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useProject } from "@/hooks/use-projects";
import { ProjectLayout } from "@/components/project-layout";
import { ProjectListView } from "@/components/project-list-view";

interface ListPageProps {
  params: Promise<{ workspaceId: string; projectId: string }>;
}

export default function ListPage({ params }: ListPageProps) {
  const { workspaceId, projectId } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const { data: project } = useProject(workspaceId, projectId);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <ProjectLayout
      projectId={projectId}
      workspaceId={workspaceId}
      projectName={project?.name ?? "Project"}
      projectKey={project?.key ?? "PRJ"}
    >
      <ProjectListView projectId={projectId} />
    </ProjectLayout>
  );
}
