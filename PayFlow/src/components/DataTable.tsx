import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Archive } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export interface ColumnDef<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  // Optional custom renderer to use when the row is in edit mode for this column.
  // Receives the current value, the full row, an onChange callback to update the
  // editing state for this column, and an onChangeMultiple callback to update multiple fields.
  editRender?: (
    value: any, 
    row: T, 
    onChange: (val: any) => void,
    onChangeMultiple?: (updates: Partial<T>) => void
  ) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface DataTableProps<T extends { id: string | number; isActive?: boolean }> {
  data: T[];
  columns: ColumnDef<T>[];
  title?: string;
  searchPlaceholder?: string;
  searchableFields?: (keyof T)[];
  itemsPerPage?: number;
  actions?: {
    label: string;
    icon: React.ReactNode;
    onClick: (row: T) => void;
    tooltip?: string;
    variant?: 'default' | 'destructive' | 'ghost';
    className?: string;
    condition?: (row: T) => boolean;
  }[];
  onEdit?: (row: T) => void;
  editableFields?: (keyof T)[];
  onSave?: (id: string | number, updates: Partial<T>) => void;
  onArchive?: (id: string | number) => void;
  onRestore?: (id: string | number) => void;
  showArchive?: boolean;
  archiveButtonLabel?: string;
  canManage?: boolean;
  confirmModal?: (props: {
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
  }) => React.ReactNode;
}

export function DataTable<T extends { id: string | number; isActive?: boolean }>({
  data,
  columns,
  title,
  searchPlaceholder = 'Search...',
  searchableFields = [],
  itemsPerPage = 10,
  actions = [],
  onEdit,
  editableFields = [],
  onSave,
  onArchive,
  onRestore,
  showArchive = true,
  archiveButtonLabel = 'Archives',
  canManage = true,
  confirmModal: ConfirmModalComponent,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<T>>({});
  const [showArchived, setShowArchived] = useState(false);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Filter by archive status if enabled
      if (showArchive) {
        const isArchived = !(item.isActive ?? true);
        if (showArchived && !isArchived) return false;
        if (!showArchived && isArchived) return false;
      }

      // Apply search filter
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();

      return searchableFields.some((field) => {
        const value = item[field];
        return String(value).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, showArchive, showArchived, searchableFields]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handleSort = (key: keyof T) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return prev.direction === 'asc' ? { key, direction: 'desc' } : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIcon = (key: keyof T) => {
    if (sortConfig?.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const handleCellDoubleClick = (item: T, columnKey: keyof T) => {
    if (!onEdit || !canManage || !editableFields.includes(columnKey)) return;
    setEditingId(item.id);
    setEditingCell(String(columnKey));
    setEditData({ [columnKey]: item[columnKey] } as Partial<T>);
  };

  const handleSaveEdit = (id: string | number) => {
    onSave?.(id, editData);
    setEditingId(null);
    setEditingCell(null);
    setEditData({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingCell(null);
    setEditData({});
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const renderCell = (item: T, column: ColumnDef<T>, isRowEditing: boolean, isThisCellEditing: boolean) => {
    const value = item[column.key];

    if (isThisCellEditing && editableFields.includes(column.key)) {
        if (column.editRender) {
          const currentValue = editData[column.key] ?? item[column.key];
          return column.editRender(
            currentValue, 
            item, 
            (val: any) => setEditData({ ...editData, [column.key]: val }),
            (updates: Partial<T>) => setEditData({ ...editData, ...updates })
          );
        }

        return (
          <Input
            value={String(editData[column.key] ?? '')}
            onChange={(e) => setEditData({ ...editData, [column.key]: e.target.value })}
            className="h-8"
            autoFocus
          />
        );
    }

    if (column.render) {
      return column.render(value, item);
    }

    return String(value);
  };

  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className="space-y-4">
      {/* Header with search and actions */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="max-w-md"
              />
            </div>
            <div className="flex items-center gap-2">
              {showArchive && (
                <Button
                  variant={showArchived ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setShowArchived(!showArchived);
                    setCurrentPage(1);
                  }}
                  className="flex items-center gap-2"
                >
                  <Archive className="h-4 w-4" />
                  {showArchived
                    ? 'Back to Active'
                    : `${archiveButtonLabel} (${data.filter((d) => !(d.isActive ?? true)).length})`}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Table */}
        <CardContent className="p-0">
          <div className="overflow-x-auto overflow-y-visible">
            <Table className="w-full border-collapse">
              <TableHeader>
                <TableRow className="border-b">
                  {columns.map((column) => (
                    <TableHead
                      key={String(column.key)}
                      className={`px-4 py-3 font-semibold ${column.width ? `w-${column.width}` : ''} ${
                        alignmentClass[column.align || 'left']
                      } ${column.className || ''}`}
                    >
                      {column.sortable ? (
                        <button
                          onClick={() => handleSort(column.key)}
                          className="flex items-center gap-2 hover:text-foreground/80 transition-colors"
                        >
                          {column.label}
                          {getSortIcon(column.key)}
                        </button>
                      ) : (
                        column.label
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No data found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item) => (
                    <TableRow
                      key={item.id}
                      className={`border-b transition-all group ${
                        editingId === item.id
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-300 dark:border-blue-700 shadow-sm'
                          : onEdit && canManage
                          ? 'cursor-pointer'
                          : ''
                      }`}
                    >
                      {columns.map((column) => {
                        const isThisCellEditing = editingId === item.id && editingCell === String(column.key);
                        return (
                          <TableCell
                            key={String(column.key)}
                            className={`px-4 py-3 ${alignmentClass[column.align || 'left']} ${
                              column.className || ''
                            } ${isThisCellEditing ? 'relative py-2' : ''} ${
                              editableFields.includes(column.key) && onEdit && canManage
                                ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors'
                                : ''
                            }`}
                            onDoubleClick={() => handleCellDoubleClick(item, column.key)}
                          >
                            {isThisCellEditing && editingId === item.id ? (
                              <div className="flex items-center gap-2">
                                <div className="flex-1">
                                  {renderCell(item, column, editingId === item.id, isThisCellEditing)}
                                </div>
                                <div className="flex gap-1">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="sm"
                                        onClick={() => handleSaveEdit(item.id)}
                                        className="bg-green-500 hover:bg-green-600 text-white h-6 w-6 p-0 shadow-md"
                                      >
                                        <span className="text-xs">✓</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Save</TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleCancelEdit}
                                        className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 h-6 w-6 p-0"
                                      >
                                        <span className="text-xs">✕</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Cancel</TooltipContent>
                                  </Tooltip>
                                </div>
                              </div>
                            ) : (
                              renderCell(item, column, editingId === item.id, isThisCellEditing)
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-foreground">{Math.min(endIndex, sortedData.length)}</span> of{' '}
            <span className="font-semibold text-foreground">{sortedData.length}</span> items
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const isCurrentPage = page === currentPage;
                const isNearby = Math.abs(page - currentPage) <= 1;
                const isFirstOrLast = page === 1 || page === totalPages;

                if (!isCurrentPage && !isNearby && !isFirstOrLast) {
                  return null;
                }

                if (!isCurrentPage && !isNearby && isFirstOrLast) {
                  return (
                    <div key={`ellipsis-${page}`} className="text-muted-foreground">
                      ...
                    </div>
                  );
                }

                return (
                  <Button
                    key={page}
                    variant={isCurrentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
