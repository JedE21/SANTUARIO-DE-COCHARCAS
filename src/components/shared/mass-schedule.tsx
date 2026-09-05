import * as React from 'react';

interface MassScheduleItem {
  day_of_week: string;
  time: string;
  place?: string | null;
  description?: string | null;
}

interface MassScheduleProps {
  items: MassScheduleItem[];
  title?: string;
  className?: string;
}

export const MassSchedule = ({
  items,
  title = 'Horarios de Celebración',
  className = '',
}: MassScheduleProps) => {
  if (items.length === 0) {
    return (
      <div className={`${className} text-center py-8`}>
        <p className="text-muted-foreground">No hay horarios disponibles.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <h2 className="font-heading text-2xl font-bold text-azul mb-6">
          {title}
        </h2>
      )}
      {/* Lista editorial: dia | hora | lugar divididos por hairlines */}
      <div className="grid gap-x-10 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.day_of_week + item.time}
            className="flex items-center justify-between gap-4 border-b border-piedra/20 py-4 transition-colors duration-300 hover:border-dorado/50"
          >
            <div>
              <p className="font-heading text-lg font-semibold text-azul">{item.day_of_week}</p>
              {item.place ? (
                <p className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">{item.place}</p>
              ) : null}
            </div>
            <div className="text-right">
              <p className="font-heading text-2xl font-bold tabular-nums text-carmesi">{item.time.slice(0, 5)}</p>
              {item.description ? (
                <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
