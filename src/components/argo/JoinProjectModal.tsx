import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useArgo } from '@/context/ArgoContext';
import { cn } from '@/lib/utils';

export function JoinProjectModal({ onClose }: { onClose: () => void }) {
  const { setCenterView } = useArgo();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleJoin = () => {
    if (!code.trim()) { setError('Please enter a project link or access code.'); return; }
    const isValid = code.includes('argo.app/project/') || code.length >= 8;
    if (!isValid) { setError('Invalid project link or access code. Please check and try again.'); return; }
    setError('');
    setCenterView('projects');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in" onClick={onClose}>
      <div className="bg-background rounded-xl border border-border shadow-xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Join a Project</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-5 py-4 space-y-3">
          <p className="text-sm text-muted-foreground">Paste a shared project link or access code to join.</p>
          <div>
            <input autoFocus value={code} onChange={e => { setCode(e.target.value); setError(''); }}
              placeholder="https://argo.app/project/... or access code"
              className={cn("w-full text-sm bg-background border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring",
                error ? "border-destructive" : "border-border")} />
            <p className="text-[10px] text-muted-foreground mt-1">You must be logged in to access the project.</p>
            {error && (
              <div className="flex items-center gap-1.5 mt-1.5 animate-fade-in">
                <AlertCircle className="w-3 h-3 text-destructive shrink-0" />
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}
          </div>
        </div>
        <div className="px-5 py-3 border-t border-border flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
          <button onClick={handleJoin}
            className="px-4 py-1.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Join Project
          </button>
        </div>
      </div>
    </div>
  );
}
