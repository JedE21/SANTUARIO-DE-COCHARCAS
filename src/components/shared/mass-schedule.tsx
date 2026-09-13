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
      <div className={`${className} py-8 text-center`}>
        <p className="text-muted-foreground">No hay horarios disponibles.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <h2 className="mb-6 font-heading text-2xl font-medium text-marron">{title}</h2>
      )}
      {/* Lista editorial: dia | hora | lugar divididos por hairlines */}
      <div className="grid gap-x-12 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.day_of_week + item.time}
            className="group flex items-baseline justify-between gap-4 border-b border-tierra/20 py-4 transition-colors duration-300 hover:border-dorado/50"
          >
            <div>
              <p className="font-heading text-lg font-medium text-marron">{item.day_of_week}</p>
              {item.place ? (
                <p className="mt-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-tierra">
                  {item.place}
                </p>
              ) : null}
            </div>
            <div className="text-right">
              <p className="font-heading text-2xl font-medium tabular-nums text-marron transition-colors duration-300 group-hover:text-dorado-oscuro">
                {item.time.slice(0, 5)}
              </p>
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
