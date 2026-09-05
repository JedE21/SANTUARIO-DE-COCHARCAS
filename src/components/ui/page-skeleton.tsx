import { Skeleton } from '@/components/ui/skeleton';

export function PageSkeleton() {
  return (
    <div className="bg-background" aria-busy="true" aria-live="polite">
      <span className="sr-only">Cargando contenido</span>
      <div className="bg-marfil px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <Skeleton className="mx-auto h-5 w-24" />
          <Skeleton className="mx-auto h-12 w-4/5" />
          <Skeleton className="mx-auto h-16 w-3/5" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}
