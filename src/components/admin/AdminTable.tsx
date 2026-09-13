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
      <div className="rounded-lg border border-piedra/30 bg-blanco p-10 text-center">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-piedra/30 bg-blanco">
      <table className="min-w-full divide-y divide-piedra/20 text-sm">
        <thead className="bg-marfil/60">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-3 text-left text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-tierra"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-piedra/15">
          {rows.map((row) => (
            <tr key={row.id} className="transition-colors hover:bg-marfil/40">
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-marron/85">
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
