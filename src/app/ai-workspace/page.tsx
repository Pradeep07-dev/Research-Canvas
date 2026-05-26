import { Suspense } from "react";
import AppLayout from "@/src/components/AppLayout";
import AIWorkspaceScreen from "@/src/app/ai-workspace/components/AIWorkSpaceScreen";

async function AIWorkspacePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const initialQuestion = params?.q ? decodeURIComponent(params.q) : undefined;

  return (
    <AppLayout>
      <AIWorkspaceScreen initialQuestion={initialQuestion} />
    </AppLayout>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-muted-foreground text-sm">
          Loading AI Workspace...
        </div>
      }
    >
      <AIWorkspacePage searchParams={searchParams} />
    </Suspense>
  );
}
