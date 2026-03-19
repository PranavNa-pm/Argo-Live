import React, { useState } from 'react';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { useArgo } from '@/context/ArgoContext';
import { cn } from '@/lib/utils';

export function CreateProjectModal({ onClose, editSpace }: {
  onClose: () => void;
  editSpace?: { id: string; name: string; description: string; projectContext?: string };
}) {
  const { createSpace, updateSpace } = useArgo();
  const isEdit = !!editSpace;

  const [name, setName] = useState(editSpace?.name || '');
  const [description, setDescription] = useState(editSpace?.description || '');
  const [projectContext, setProjectContext] = useState(editSpace?.projectContext || '');
  const [showContextExamples, setShowContextExamples] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) return;
    if (isEdit) {
      updateSpace(editSpace!.id, { name: name.trim(), description: description.trim(), projectContext: projectContext.trim() });
    } else {
      createSpace(name.trim(), description.trim() || undefined, projectContext.trim() || undefined);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in" onClick={onClose}>
      <div className="bg-background rounded-xl border border-border shadow-xl w-full max-w-lg mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">{isEdit ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-5 py-4 space-y-3 max-h-[70vh] overflow-y-auto argo-scrollbar">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Project Name</label>
            <input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Client Name — Q1 Proposal"
              className="w-full text-sm bg-background border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of this project…" rows={2}
              className="w-full text-sm bg-background border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring" />
            <p className="text-[10px] text-muted-foreground mt-1">Visible to all project members.</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Project Context <span className="font-normal text-muted-foreground/60">(optional)</span></label>
            <textarea value={projectContext} onChange={e => setProjectContext(e.target.value)} placeholder="Add context about this project to help Argo tailor responses…" rows={4}
              className="w-full text-sm bg-background border border-border rounded-md px-3 py-2 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring" />
            <button type="button" onClick={() => setShowContextExamples(!showContextExamples)}
              className="text-xs text-primary hover:underline mt-1.5 flex items-center gap-1 font-medium">
              {showContextExamples ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              See examples
            </button>
            {showContextExamples && (
              <div className="mt-2 p-3 rounded-md bg-secondary/30 border border-border text-xs text-muted-foreground space-y-3 animate-fade-in">
                <div>
                  <p className="font-semibold text-foreground/80 mb-1">Client project</p>
                  <pre className="whitespace-pre-wrap font-mono text-[10px] leading-relaxed">{'Client:\nIndustry:\nGoal:\nNotes:'}</pre>
                </div>
                <div className="border-t border-border pt-2">
                  <p className="font-semibold text-foreground/80 mb-1">Task / automation</p>
                  <pre className="whitespace-pre-wrap font-mono text-[10px] leading-relaxed">{'Task:\nGoal:\nWorkflow:\nNotes:'}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="px-5 py-3 border-t border-border flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={!name.trim()}
            className={cn("px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
              name.trim() ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-muted-foreground cursor-not-allowed")}>
            {isEdit ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
}
