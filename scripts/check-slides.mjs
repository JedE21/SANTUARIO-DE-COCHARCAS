// Verifica/aplica la migración 012 (slides) contra Supabase.
// Uso: node scripts/apply-slides-migration.mjs [--apply]
// Sin --apply solo comprueba si la tabla existe.
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

const apply = process.argv.includes('--apply');

const { error } = await sb.from('slides').select('id').limit(1);
if (!error) {
  console.log('EXISTE: la tabla slides ya está disponible.');
  process.exit(0);
}
console.log('NO_EXISTE:', error.message);

if (!apply) {
  console.log('Sugerencia: ejecuta la migración 012 en el SQL Editor de Supabase');
  console.log('(supabase/migrations/012_slides_system.sql) y vuelve a comprobar.');
  process.exit(0);
}

console.log('La creación de tablas requiere el SQL Editor de Supabase (no hay RPC DDL).');
process.exit(1);
