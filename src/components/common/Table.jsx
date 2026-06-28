import { cn } from '../../utils/cn';

/**
 * Reusable Table Component
 * Supports custom column rendering, loading skeleton states, and empty states.
 */
export const Table = ({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'No data available',
  className,
  wrapperClassName,
}) => {
  return (
    <div className={cn('w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg', wrapperClassName)}>
      <table className={cn('min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm', className)}>
        <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider select-none">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                scope="col"
                className={cn('px-6 py-3', col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
          {isLoading ? (
            // Skeleton loader state
            Array.from({ length: 5 }).map((_, rIdx) => (
              <tr key={`skeleton-row-${rIdx}`} className="animate-pulse">
                {columns.map((col, cIdx) => (
                  <td key={`skeleton-cell-${cIdx}`} className="px-6 py-4">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            // Empty state
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-slate-450 dark:text-slate-500"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <svg
                    className="h-8 w-8 text-slate-350 dark:text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <span>{emptyMessage}</span>
                </div>
              </td>
            </tr>
          ) : (
            // Dynamic data list
            data.map((row, rIdx) => {
              const rowId = row.id || `row-${rIdx}`;
              return (
                <tr
                  key={rowId}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/25 transition-colors duration-150"
                >
                  {columns.map((col, cIdx) => {
                    const value = row[col.key];
                    return (
                      <td
                        key={`${rowId}-cell-${col.key || cIdx}`}
                        className={cn('px-6 py-4 text-slate-700 dark:text-slate-300 font-normal', col.className)}
                      >
                        {col.render ? col.render(row, value) : value}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
