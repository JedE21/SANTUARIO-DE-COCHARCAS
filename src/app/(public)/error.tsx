'use client';

import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';

export default function PublicError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-marfil px-4 py-20">
      <ErrorState
        title="No pudimos cargar esta página"
        description="Intenta nuevamente. Si el problema continúa, vuelve más tarde."
        action={
          <Button type="button" onClick={reset}>
            Intentar de nuevo
          </Button>
        }
      />
    </div>
  );
}
