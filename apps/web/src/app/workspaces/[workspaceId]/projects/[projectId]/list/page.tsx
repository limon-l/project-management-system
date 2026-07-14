"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ProjectLayout } from "@/components/project-layout";
import { ProjectListView } from "@/components/project-list-view";

interface ListPageProps {
  params: Promise<{ workspaceId: string; projectId: string }>;
}

export default function ListPage({ params }: ListPageProps) {
  const { workspaceId, projectId } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();

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
      projectName="Project"
      projectKey="PRJ"
    >
      <ProjectListView projectId={projectId} />
    </ProjectLayout>
  );
}
