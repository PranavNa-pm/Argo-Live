// Reusable skeleton row — used for Project, Artifact, and Chat list loading states
export function ListRowSkeleton({ lines = 2 }: { lines?: number }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-muted rounded w-48" />
        {lines > 1 && <div className="h-3 bg-muted rounded w-64 opacity-60" />}
      </div>
      <div className="h-3 bg-muted rounded w-20 opacity-50" />
      <div className="h-3 bg-muted rounded w-10 opacity-50" />
    </div>
  );
}
