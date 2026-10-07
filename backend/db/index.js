// backend/db/index.js — Postgres access. Uses `pg` when DATABASE_URL is set,
// otherwise an embedded PGlite (real Postgres compiled to WASM) for local dev and tests.
const fs = require('fs');
const path = require('path');
const config = require('../config');

let client = null;   // { query(sql, params) → { rows }, exec(sql), close() }
let ready = null;

async function connect() {
  if (config.databaseUrl) {
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: config.databaseUrl,
      // hosted Postgres (Neon/Supabase) requires TLS; local URLs usually don't
      ssl: /localhost|127\.0\.0\.1/.test(config.databaseUrl) ? false : { rejectUnauthorized: false },
      max: 5,
    });
    return {
      query: (sql, params) => pool.query(sql, params),
      exec: (sql) => pool.query(sql),
      close: () => pool.end(),
      kind: 'postgres',
    };
  }

  if (process.env.VERCEL) {
    console.warn('⚠️  DATABASE_URL is not set on Vercel — using an in-memory database. All user data is lost on every cold start.');
  }
  const { PGlite } = await import('@electric-sql/pglite');
  const dir = process.env.VERCEL ? '' : config.pgliteDir;
  if (dir) fs.mkdirSync(dir, { recursive: true });
  const db = dir ? new PGlite(dir) : new PGlite();
  return {
    query: (sql, params) => db.query(sql, params),
    exec: (sql) => db.exec(sql),
    close: () => db.close(),
    kind: dir ? 'pglite-file' : 'pglite-memory',
  };
}

function init() {
  if (!ready) {
    ready = (async () => {
      client = await connect();
      await client.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
      return client;
    })().catch(err => { ready = null; throw err; });
  }
  return ready;
}

async function query(sql, params = []) {
  await init();
  return client.query(sql, params);
}

async function one(sql, params) {
  const { rows } = await query(sql, params);
  return rows[0] || null;
}

async function close() {
  if (client) await client.close();
  client = null;
  ready = null;
}

module.exports = { init, query, one, close, kind: () => client?.kind };
