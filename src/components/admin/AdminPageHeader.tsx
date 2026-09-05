interface AdminPageHeaderProps {
  title: string;
  description?: string;
}

export function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold text-carbone">{title}</h2>
      {description ? <p className="mt-1 text-sm text-carbone/60">{description}</p> : null}
    </div>
  );
}
