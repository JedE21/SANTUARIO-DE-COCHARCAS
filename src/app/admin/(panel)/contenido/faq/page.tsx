import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable';
import { AdminSaveForm } from '@/components/admin/AdminSaveForm';
import { getAllFaqsAdmin } from '@/lib/queries-admin';

export default async function AdminFaqPage() {
  const faqs = await getAllFaqsAdmin();

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Preguntas frecuentes" description="Administra las preguntas más comunes de los visitantes." />
      <AdminTable
        rows={faqs}
        columns={[
          { key: 'question', label: 'Pregunta' },
          { key: 'category', label: 'Categoría' },
          {
            key: 'active',
            label: 'Activa',
            render: (row) => (row.active ? 'Sí' : 'No'),
          },
        ]}
      />
      <AdminSaveForm
        table="faqs"
        submitLabel="Agregar pregunta"
        fields={[
          { name: 'question', label: 'Pregunta', required: true },
          { name: 'answer', label: 'Respuesta', type: 'textarea', required: true },
          { name: 'category', label: 'Categoría' },
          { name: 'position', label: 'Orden', type: 'number', defaultValue: '1' },
        ]}
      />
    </div>
  );
}
