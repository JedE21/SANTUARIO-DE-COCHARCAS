interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface AdminTableProps<T extends { id: string }> {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
}

export function AdminTable<T extends { id: string }>({
  columns,
  rows,
  emptyMessage = 'No hay registros.',
}: AdminTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-piedra/20 bg-blanco p-8 text-center text-sm text-carbone/60">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-piedra/20 bg-blanco shadow-sm">
      <table className="min-w-full divide-y divide-piedra/10 text-sm">
        <thead className="bg-marfil">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-3 text-left font-semibold text-carbone">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-piedra/10">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-marfil/50">
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-carbone/80">
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[col.key as string] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
