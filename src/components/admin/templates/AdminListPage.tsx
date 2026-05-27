'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BoldPanel } from '@/components/admin/ui/BoldPanel';
import { BoldButton } from '@/components/admin/ui/BoldButton';
import { StatusPill } from '@/components/admin/ui/StatusPill';

export interface ColumnDef<T> {
  key: string;
  label: string;
  width?: string;
  render?: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface AdminListPageProps<T> {
  title: string;
  items: T[];
  columns: ColumnDef<T>[];
  newUrl?: string;
  newLabel?: string;
  onSearch?: (query: string) => void;
  renderActions?: (item: T) => React.ReactNode;
  emptyStateMessage?: string;
  searchPlaceholder?: string;
  kpiStats?: Array<{
    label: string;
    count: number;
    icon?: string;
  }>;
}

export function AdminListPage<T extends { id: string | number }>({
  title,
  items,
  columns,
  newUrl,
  newLabel = '+ New',
  renderActions,
  emptyStateMessage = 'No items yet',
  searchPlaceholder = 'Search...',
  kpiStats = [],
}: AdminListPageProps<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query) {
      router.push(`?search=${encodeURIComponent(query)}`);
    } else {
      router.push('?');
    }
  };

  const handleClearSearch = () => {
    router.push('?');
  };

  const alignClass = (align?: string) => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-adm-textPri uppercase">
            {title}
          </h1>
          <p className="text-xs text-adm-textMut mt-1">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        {newUrl && (
          <Link href={newUrl}>
            <BoldButton variant="primary" size="md">
              {newLabel}
            </BoldButton>
          </Link>
        )}
      </div>

      {/* KPI Stats Strip */}
      {kpiStats.length > 0 && (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(kpiStats.length, 4)}, 1fr)` }}>
          {kpiStats.map((stat, idx) => (
            <BoldPanel key={idx} title={stat.label}>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-mono font-bold text-nts-green">
                  {stat.count}
                </div>
                {stat.icon && <span className="text-2xl">{stat.icon}</span>}
              </div>
            </BoldPanel>
          ))}
        </div>
      )}

      {/* Search/Filter Bar */}
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            name="search"
            placeholder={searchPlaceholder}
            defaultValue={searchQuery}
            className="flex-1 px-3 py-2 bg-adm-input border border-adm-border rounded-lg text-sm text-adm-textBody placeholder-adm-textMut focus:outline-none focus:ring-2 focus:ring-nts-green focus:border-transparent font-mono"
          />
          <BoldButton type="submit" variant="primary" size="md">
            Search
          </BoldButton>
          {searchQuery && (
            <BoldButton
              type="button"
              variant="secondary"
              size="md"
              onClick={handleClearSearch}
            >
              Clear
            </BoldButton>
          )}
        </div>
      </form>

      {/* Table or Empty State */}
      {items.length === 0 ? (
        <BoldPanel cornerBrackets>
          <div className="py-12 text-center">
            <p className="text-adm-textMut text-sm font-mono mb-4">{emptyStateMessage}</p>
            {newUrl && (
              <Link href={newUrl}>
                <BoldButton variant="secondary" size="md">
                  {newLabel}
                </BoldButton>
              </Link>
            )}
          </div>
        </BoldPanel>
      ) : (
        <BoldPanel cornerBrackets>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-adm-border">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide ${alignClass(col.align)} ${col.width || ''}`}
                    >
                      {col.label}
                    </th>
                  ))}
                  {renderActions && (
                    <th className="px-4 py-3 text-xs font-mono font-semibold text-adm-textMut uppercase tracking-wide text-right">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-adm-border/50">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-adm-panelAlt/30 transition-colors"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 text-adm-textBody ${alignClass(col.align)}`}
                      >
                        {col.render ? col.render(item) : String(item[col.key as keyof T])}
                      </td>
                    ))}
                    {renderActions && (
                      <td className="px-4 py-3 text-right text-adm-textBody space-x-2">
                        {renderActions(item)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BoldPanel>
      )}
    </div>
  );
}
