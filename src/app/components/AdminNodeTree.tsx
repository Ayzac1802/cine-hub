'use client';
import React, { useState } from 'react';
import { Plus, Trash2, Film, FolderOpen, Trophy, Zap, Image, ChevronUp } from 'lucide-react';
import type { EventNode } from '@/lib/eventStore';

interface AdminNodeTreeProps {
  nodes: EventNode[];
  winnerPath: string[];
  currentParentId: string | null;
  onAddNode: (parentId: string | null, name: string) => void;
  onDeleteNode: (id: string) => void;
  onUpdateNode?: (id: string, updates: Partial<EventNode>) => void;
}

interface NodeRowProps {
  node: EventNode;
  depth: number;
  nodes: EventNode[];
  winnerPath: string[];
  currentParentId: string | null;
  onAddNode: (parentId: string | null, name: string) => void;
  onDeleteNode: (id: string) => void;
  onUpdateNode?: (id: string, updates: Partial<EventNode>) => void;
}

function NodeRow({ node, depth, nodes, winnerPath, currentParentId, onAddNode, onDeleteNode, onUpdateNode }: NodeRowProps) {
  const [addInput, setAddInput] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [coverInput, setCoverInput] = useState(node.coverImage || '');
  const [synopsisInput, setSynopsisInput] = useState(node.synopsis || '');
  const children = nodes.filter(n => n.parentId === node.id);
  const isWinner = winnerPath.includes(node.id);
  const isCurrent = currentParentId === node.id;
  const isLeaf = depth > 0; // Only leaf-level items (movies) get cover/synopsis

  const handleAdd = () => {
    if (!addInput.trim()) return;
    onAddNode(node.id, addInput);
    setAddInput('');
    setShowAdd(false);
  };

  const handleSaveDetails = () => {
    if (onUpdateNode) {
      onUpdateNode(node.id, { coverImage: coverInput.trim(), synopsis: synopsisInput.trim() });
    }
    setShowDetails(false);
  };

  return (
    <div className="mb-2">
      <div
        className="rounded-xl border px-3 py-2.5 transition-all-150"
        style={{
          backgroundColor: isCurrent ? 'rgba(245,179,1,0.08)' : isWinner ? 'rgba(76,195,138,0.08)' : 'var(--muted)',
          borderColor: isCurrent ? 'rgba(245,179,1,0.35)' : isWinner ? 'rgba(76,195,138,0.3)' : 'var(--border)',
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {depth === 0 ? (
              <FolderOpen size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            ) : (
              <Film size={13} style={{ color: 'var(--muted-foreground)', flexShrink: 0 }} />
            )}
            <span className="font-medium text-sm truncate" style={{ color: 'var(--foreground)' }}>
              {node.name}
            </span>
            {isWinner && (
              <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: 'rgba(76,195,138,0.15)', color: 'var(--green)' }}>
                <Trophy size={9} />Won
              </span>
            )}
            {isCurrent && (
              <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: 'rgba(245,179,1,0.15)', color: 'var(--primary)' }}>
                <Zap size={9} />Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-xs font-mono-data px-1.5 py-0.5 rounded-md hidden sm:inline"
              style={{ backgroundColor: 'var(--background)', color: 'var(--muted-foreground)' }}>
              {node.votes}v
            </span>
            {isLeaf && onUpdateNode && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="p-1.5 rounded-lg transition-all-150 hover:bg-muted scale-press"
                aria-label={`Edit cover/synopsis for ${node.name}`}
                title="Edit cover image & synopsis"
              >
                {showDetails ? <ChevronUp size={12} style={{ color: 'var(--primary)' }} /> : <Image size={12} style={{ color: 'var(--muted-foreground)' }} />}
              </button>
            )}
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="p-1.5 rounded-lg transition-all-150 hover:bg-muted scale-press"
              aria-label={`Add item under ${node.name}`}
            >
              <Plus size={12} style={{ color: 'var(--primary)' }} />
            </button>
            <button
              onClick={() => onDeleteNode(node.id)}
              className="p-1.5 rounded-lg transition-all-150 hover:bg-muted scale-press"
              aria-label={`Delete ${node.name}`}
            >
              <Trash2 size={12} style={{ color: 'var(--accent)' }} />
            </button>
          </div>
        </div>

        {/* Cover Image + Synopsis Editor */}
        {showDetails && isLeaf && (
          <div className="mt-3 pt-3 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted-foreground)' }}>
                Cover Image URL
              </label>
              <input
                type="url"
                value={coverInput}
                onChange={e => setCoverInput(e.target.value)}
                placeholder="https://image.tmdb.org/..."
                className="w-full rounded-lg px-3 py-2 text-xs border outline-none focus:ring-1 transition-all-150"
                style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', borderColor: 'var(--border-strong)' }}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted-foreground)' }}>
                Synopsis
              </label>
              <textarea
                value={synopsisInput}
                onChange={e => setSynopsisInput(e.target.value)}
                placeholder="Brief description of the movie..."
                rows={2}
                className="w-full rounded-lg px-3 py-2 text-xs border outline-none focus:ring-1 transition-all-150 resize-none"
                style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', borderColor: 'var(--border-strong)' }}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveDetails}
                className="px-3 py-1.5 rounded-lg text-xs font-medium scale-press transition-all-150"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                Save
              </button>
              <button
                onClick={() => { setShowDetails(false); setCoverInput(node.coverImage || ''); setSynopsisInput(node.synopsis || ''); }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium scale-press transition-all-150 hover:bg-muted"
                style={{ borderColor: 'var(--border-strong)', color: 'var(--muted-foreground)', border: '1px solid var(--border-strong)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showAdd && (
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={addInput}
              onChange={e => setAddInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder={`New item under "${node.name}"`}
              className="flex-1 rounded-lg px-3 py-2 text-sm border outline-none focus:ring-1 transition-all-150"
              style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', borderColor: 'var(--border-strong)' }}
              autoFocus
            />
            <button onClick={handleAdd} className="px-3 py-2 rounded-lg text-sm font-medium scale-press transition-all-150"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}>
              Add
            </button>
            <button onClick={() => { setShowAdd(false); setAddInput(''); }}
              className="px-3 py-2 rounded-lg text-sm font-medium scale-press transition-all-150 hover:bg-muted"
              style={{ borderColor: 'var(--border-strong)', color: 'var(--muted-foreground)', border: '1px solid var(--border-strong)' }}>
              ✕
            </button>
          </div>
        )}
      </div>

      {children.length > 0 && (
        <div className="ml-4 mt-2 pl-3 node-tree-line">
          {children.map(child => (
            <NodeRow
              key={`tree-node-${child.id}`}
              node={child}
              depth={depth + 1}
              nodes={nodes}
              winnerPath={winnerPath}
              currentParentId={currentParentId}
              onAddNode={onAddNode}
              onDeleteNode={onDeleteNode}
              onUpdateNode={onUpdateNode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminNodeTree({
  nodes,
  winnerPath,
  currentParentId,
  onAddNode,
  onDeleteNode,
  onUpdateNode,
}: AdminNodeTreeProps) {
  const [rootInput, setRootInput] = useState('');
  const rootNodes = nodes.filter(n => n.parentId === null);

  const handleAddRoot = () => {
    if (!rootInput.trim()) return;
    onAddNode(null, rootInput);
    setRootInput('');
  };

  return (
    <div className="rounded-2xl border p-4 sm:p-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      {rootNodes.length === 0 && (
        <div className="text-center py-8 mb-4">
          <FolderOpen size={32} className="mx-auto mb-3" style={{ color: 'var(--muted-foreground)' }} />
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>No categories yet</p>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Add your first category below</p>
        </div>
      )}

      {rootNodes.map(node => (
        <NodeRow
          key={`root-node-${node.id}`}
          node={node}
          depth={0}
          nodes={nodes}
          winnerPath={winnerPath}
          currentParentId={currentParentId}
          onAddNode={onAddNode}
          onDeleteNode={onDeleteNode}
          onUpdateNode={onUpdateNode}
        />
      ))}

      <div className="flex gap-2 mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <input
          type="text"
          value={rootInput}
          onChange={e => setRootInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddRoot()}
          placeholder="New category (e.g. Thriller, Sci-Fi)"
          className="flex-1 rounded-xl px-3 py-2 text-sm border outline-none focus:ring-1 transition-all-150"
          style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)', borderColor: 'var(--border-strong)' }}
        />
        <button
          onClick={handleAddRoot}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium scale-press transition-all-150 whitespace-nowrap"
          style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          <Plus size={13} />
          <span className="hidden sm:inline">Add Category</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </div>
  );
}