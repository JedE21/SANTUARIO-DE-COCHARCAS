import { PublicLayout } from '@/components/public/layout';

export default async function PublicLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicLayout>{children}</PublicLayout>;
}
