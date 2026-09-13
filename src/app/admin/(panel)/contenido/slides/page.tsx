import type { Metadata } from 'next';
import { SlidesManager } from '@/components/admin/SlidesManager';
import { getAllSlidesAdmin } from '@/lib/queries-admin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Slides · Panel',
  robots: { index: false, follow: false },
};

export default async function AdminSlidesPage() {
  const slides = await getAllSlidesAdmin();

  return (
    <div className="space-y-8">
      <SlidesManager initialSlides={slides} />
    </div>
  );
}
