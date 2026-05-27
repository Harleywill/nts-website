'use client';

import { ReactNode, useState } from 'react';
import { BoldPanel } from '@/components/admin/ui/BoldPanel';
import { BoldButton } from '@/components/admin/ui/BoldButton';
import { StatusPill } from '@/components/admin/ui/StatusPill';

export interface AdminDetailPageProps {
  title: string;
  id?: string;
  status?: 'NEW' | 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'REVIEWING' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED';
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  isSaving?: boolean;
  isDirty?: boolean;
  onDelete?: () => void;
  showDeleteButton?: boolean;
  tabs?: Array<{
    id: string;
    label: string;
    content: ReactNode;
  }>;
  rightSidebar?: ReactNode;
  backUrl?: string;
}

export function AdminDetailPage({
  title,
  id,
  status,
  children,
  onSubmit,
  isSaving = false,
  isDirty = false,
  onDelete,
  showDeleteButton = false,
  tabs,
  rightSidebar,
  backUrl = '/admin/dashboard',
}: AdminDetailPageProps) {
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.id || 'details');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-adm-textPri uppercase">{title}</h1>
          {id && (
            <div className="flex items-center gap-3 mt-3">
              <code className="text-xs bg-adm-panel px-2 py-1 rounded border border-adm-border text-adm-textMut">
                {id}
              </code>
              {status && <StatusPill status={status} />}
            </div>
          )}
        </div>

        {/* Top Action Buttons */}
        <div className="flex gap-2">
          {isSaving && <span className="text-xs text-adm-textMut font-mono">SAVING...</span>}
          {isDirty && <span className="text-xs text-nts-warn font-mono">UNSAVED</span>}
        </div>
      </div>

      {/* Tabs (if provided) */}
      {tabs && tabs.length > 0 && (
        <div className="flex gap-1 border-b border-adm-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-mono uppercase tracking-wide transition-colors ${
                activeTab === tab.id
                  ? 'text-nts-green border-b-2 border-nts-green'
                  : 'text-adm-textMut hover:text-adm-textBody'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Content */}
        <div className="lg:col-span-2">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Show active tab content if tabs exist */}
            {tabs && tabs.length > 0 ? (
              tabs.find((t) => t.id === activeTab)?.content
            ) : (
              // Otherwise show children directly
              children
            )}

            {/* Form Actions */}
            <BoldPanel title="Actions">
              <div className="flex gap-3">
                <BoldButton type="submit" variant="primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : isDirty ? 'Save Changes' : 'Save'}
                </BoldButton>
                <a href={backUrl}>
                  <BoldButton type="button" variant="secondary">
                    Cancel
                  </BoldButton>
                </a>
                {showDeleteButton && onDelete && (
                  <BoldButton
                    type="button"
                    variant="danger"
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      if (confirm('Are you sure? This cannot be undone.')) {
                        onDelete();
                      }
                    }}
                  >
                    Delete
                  </BoldButton>
                )}
              </div>
            </BoldPanel>
          </form>
        </div>

        {/* Right Column: Sidebar */}
        {rightSidebar && <div className="space-y-4">{rightSidebar}</div>}
      </div>
    </div>
  );
}
