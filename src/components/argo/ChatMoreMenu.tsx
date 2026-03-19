import React, { useState } from 'react';
import { MoreVertical, Pencil } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ChatMoreMenu({ chatId, chatName, renameChat }: { chatId: string; chatName: string; renameChat: (id: string, name: string) => void }) {
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(chatName);

  if (renaming) {
    return (
      <div className="flex items-center gap-1">
        <input
          value={renameValue}
          onChange={e => setRenameValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') { renameChat(chatId, renameValue.trim() || chatName); setRenaming(false); }
            if (e.key === 'Escape') setRenaming(false);
          }}
          onBlur={() => { renameChat(chatId, renameValue.trim() || chatName); setRenaming(false); }}
          className="text-xs bg-background border border-border rounded-md px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-ring w-32"
          autoFocus
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground" onClick={e => e.stopPropagation()}>
          <MoreVertical className="w-3.5 h-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem onClick={(e) => {
          e.stopPropagation();
          setRenameValue(chatName);
          setRenaming(true);
        }}>
          <Pencil className="w-3.5 h-3.5 mr-2" />
          Rename Chat
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
