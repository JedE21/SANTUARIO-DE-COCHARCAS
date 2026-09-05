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
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {title}
        </h2>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.day_of_week + item.time} className="bg-blanco/50 border border-blanco/10 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 flex items-center justify-center bg-dorado/10 rounded-md">
                <span className="text-dorado font-semibold text-xs">
                  {item.day_of_week.charAt(0).toUpperCase() + item.day_of_week.slice(1)}
                </span>
              </div>
              <span className="text-lg font-semibold text-foreground">{item.time}</span>
            </div>
            {item.place && (
              <p className="text-sm text-muted-foreground mb-2">{item.place}</p>
            )}
            {item.description && (
              <p className="text-sm text-muted-foreground">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
