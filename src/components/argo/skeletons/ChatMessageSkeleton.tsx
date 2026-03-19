// Skeleton for chat messages loading state
export function ChatMessageSkeleton() {
  return (
    <div className="space-y-6 px-4 py-6 max-w-4xl mx-auto w-full animate-pulse">
      {/* User message */}
      <div className="flex justify-end">
        <div className="h-9 bg-muted rounded-xl w-56" />
      </div>
      {/* AI response */}
      <div className="space-y-2">
        <div className="h-3.5 bg-muted rounded w-full max-w-lg" />
        <div className="h-3.5 bg-muted rounded w-full max-w-md opacity-70" />
        <div className="h-3.5 bg-muted rounded w-48 opacity-50" />
      </div>
      {/* User message */}
      <div className="flex justify-end">
        <div className="h-9 bg-muted rounded-xl w-36" />
      </div>
      {/* AI response */}
      <div className="space-y-2">
        <div className="h-3.5 bg-muted rounded w-full max-w-xl" />
        <div className="h-3.5 bg-muted rounded w-full max-w-sm opacity-70" />
      </div>
    </div>
  );
}
