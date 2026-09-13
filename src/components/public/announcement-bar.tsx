import Link from 'next/link';
import { getAnnouncements } from '@/lib/queries';

export async function AnnouncementBar() {
  const announcements = await getAnnouncements();
  const latest = announcements[0];

  if (!latest?.title) return null;

  return (
    <div className="border-b border-dorado/20 bg-negro text-marfil">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center text-sm sm:px-6 lg:px-8">
        <span className="font-medium text-dorado-claro" aria-hidden="true">
          ●
        </span>
        <p className="text-marfil/90">
          <span className="font-medium text-blanco">{latest.title}</span>
          {latest.content ? <span className="hidden sm:inline"> — {latest.content}</span> : null}
        </p>
        {latest.link_url ? (
          <Link href={latest.link_url} className="font-medium text-dorado-claro underline underline-offset-2 transition-normal hover:text-blanco">
            Ver más
          </Link>
        ) : null}
      </div>
    </div>
  );
}
