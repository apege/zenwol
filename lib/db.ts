import { neon, NeonQueryFunction } from "@neondatabase/serverless";

// Fallback URL jika environment variable belum terpropagasi di Cloudflare
const FALLBACK_DATABASE_URL =
  "postgresql://neondb_owner:npg_gabMtndr1e7K@ep-lively-bonus-b35audlo-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

let cachedSql: NeonQueryFunction<false, false> | null = null;
let cachedUrl: string | null = null;

function getSql(): NeonQueryFunction<false, false> {
  const currentUrl = (process.env.DATABASE_URL || FALLBACK_DATABASE_URL).trim();

  if (!cachedSql || cachedUrl !== currentUrl) {
    cachedUrl = currentUrl;
    cachedSql = neon(currentUrl);
  }

  return cachedSql;
}

// Proxy neon client dynamically so all calls evaluate at request time with seamless fallback
export const sql = new Proxy(
  (() => {}) as unknown as NeonQueryFunction<false, false>,
  {
    apply(_target, _thisArg, argArray) {
      const client = getSql();
      // @ts-expect-error - dynamic function application for template tag and function calls
      return client(...argArray);
    },
    get(_target, prop, receiver) {
      const client = getSql();
      return Reflect.get(client, prop, receiver);
    },
  }
);
