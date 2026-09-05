import * as React from 'react';

type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

/**
 * Inyecta datos estructurados Schema.org (JSON-LD) en el documento.
 * El JSON se escapa para evitar romper el HTML (`<` → <).
 */
export function JsonLd({ data }: { data: JsonLdData }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
