// ============================================================================
// MES Plastico — Table Component
// ============================================================================

import React, { useState, useCallback } from 'react';
import { cn } from '../../utils/helpers';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

type SortDirection = 'asc' | 'desc' | null;

interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
  stickyHeader?: boolean;
}

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'Nenhum dado encontrado',
  className,
  stickyHeader = true,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);

  const handleSort = useCallback(
    (key: string) => {
      if (sortKey === key) {
        if (sortDir === 'asc') setSortDir('desc');
        else if (sortDir === 'desc') {
          setSortKey(null);
          setSortDir(null);
        }
      } else {
        setSortKey(key);
        setSortDir('asc');
      }
    },
    [sortKey, sortDir]
  );

  const sortedData = React.useMemo(() => {
    if (!sortKey || !sortDir) return data;
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal);
      const bStr = String(bVal);
      return sortDir === 'asc'
        ? aStr.localeCompare(bStr, 'pt-BR')
        : bStr.localeCompare(aStr, 'pt-BR');
    });
  }, [data, sortKey, sortDir]);

  function SortIcon({ columnKey }: { columnKey: string }) {
    if (sortKey !== columnKey) {
      return <ChevronsUpDown className="h-3.5 w-3.5 text-slate-500" />;
    }
    return sortDir === 'asc' ? (
      <ChevronUp className="h-3.5 w-3.5 text-andon-blue" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-andon-blue" />
    );
  }

  return (
    <div className={cn('overflow-x-auto rounded-lg border border-surface-700', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className={cn('bg-surface-800', stickyHeader && 'sticky top-0 z-10')}>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 font-medium text-slate-400 border-b border-surface-700 whitespace-nowrap',
                  alignClasses[col.align || 'left'],
                  col.sortable && 'cursor-pointer select-none hover:text-slate-200 transition-colors duration-200'
                )}
                style={col.width ? { width: col.width } : undefined}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                aria-sort={
                  sortKey === col.key
                    ? sortDir === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {col.sortable && <SortIcon columnKey={col.key} />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, idx) => (
              <tr
                key={keyExtractor(row, idx)}
                className={cn(
                  'border-b border-surface-700/50 bg-surface-900 transition-colors duration-150',
                  'hover:bg-surface-800',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4 py-3 text-slate-200 whitespace-nowrap',
                      alignClasses[col.align || 'left']
                    )}
                  >
                    {col.render
                      ? col.render(row, idx)
                      : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export type { Column, TableProps };
export default Table;
