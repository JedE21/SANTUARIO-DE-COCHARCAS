import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminCrud } from '@/components/admin/AdminCrud';
import { getAllFaqsAdmin } from '@/lib/queries-admin';

export const dynamic = 'force-dynamic';

export default async function AdminFaqPage() {
  const faqs = await getAllFaqsAdmin();

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Preguntas frecuentes" description="Crea y organiza las FAQs del sitio web." />
      <AdminCrud
        table="faqs"
        rows={faqs}
        emptyMessage="No hay preguntas frecuentes registradas."
        columns={[
          { key: 'question', label: 'Pregunta' },
          { key: 'category', label: 'Categoría' },
          { key: 'position', label: 'Orden' },
          { key: 'active', label: 'Activa', render: (row) => (row.active ? 'Sí' : 'No') },
        ]}
        fields={[
          { name: 'question', label: 'Pregunta', required: true },
          { name: 'answer', label: 'Respuesta', type: 'textarea', rows: 4, required: true },
          { name: 'category', label: 'Categoría' },
          { name: 'position', label: 'Orden', type: 'number' },
          {
            name: 'active',
            label: 'Activa',
            type: 'select',
            options: [
              { value: 'true', label: 'Sí' },
              { value: 'false', label: 'No' },
            ],
          },
        ]}
      />
    </div>
  );
}
