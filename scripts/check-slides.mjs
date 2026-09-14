// Verifica el estado del CMS en Supabase (tablas que usa el panel).
// Uso: node scripts/check-slides.mjs
// Exit 0: todo existe. Exit 1: falta algo (ejecuta supabase/apply-all.sql).
import { createClient } from '@supabase/supabase-js';

// Carga .env.local manualmente (sin dependencia de dotenv)
import { readFileSync } from 'node:fs';
try {
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch {}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('FALTAN_CREDENCIALES');
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

const TABLES = [
  'slides',
  'historia_content',
  'historia_timeline',
  'footer_settings',
  'navigation_items',
  'site_settings',
];

let missing = [];
for (const table of TABLES) {
  const { error } = await sb.from(table).select('id').limit(1);
  if (error) {
    console.log(`✗ ${table}: ${error.message}`);
    missing.push(table);
  } else {
    console.log(`✓ ${table}`);
  }
}

// Estado del enum slide_section (insert de prueba se evita; solo informe)
if (!missing.includes('slides')) {
  const { count } = await sb.from('slides').select('id', { count: 'exact', head: true });
  console.log(`  slides con datos: ${count ?? 0} fila(s)`);
}
if (!missing.includes('footer_settings')) {
  const { data } = await sb.from('footer_settings').select('id, signature_text').limit(1);
  if (data && data[0] && data[0].signature_text == null) {
    console.log('  ⚠ footer_settings sin signature_text: ejecuta supabase/apply-all.sql');
  }
}

if (missing.length > 0) {
  console.log('\nFALTAN TABLAS. Ejecuta en el SQL Editor de Supabase el archivo:');
  console.log('  supabase/apply-all.sql');
  process.exit(1);
}
console.log('\nTodo listo: el panel de administración puede guardar cambios.');
process.exit(0);
