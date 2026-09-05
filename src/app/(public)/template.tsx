'use client';

import { PageFade } from '@/components/motion';

export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  return <PageFade>{children}</PageFade>;
}
