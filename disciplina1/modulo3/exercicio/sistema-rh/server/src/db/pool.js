import pg from 'pg';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnvFromFile(filePath) {
  if (!existsSync(filePath)) return;

  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex <= 0) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function loadEnvironmentCandidates() {
  const projectRoot = path.resolve(__dirname, '..', '..', '..');

  const candidates = [
    path.join(projectRoot, 'infra', '.env'),
    path.join(projectRoot, 'backend', '.env'),
    path.join(projectRoot, '.env')
  ];

  for (const candidate of candidates) {
    loadEnvFromFile(candidate);
  }
}

loadEnvironmentCandidates();

function readNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const pool = new Pool({
  host: process.env.PGHOST || process.env.POSTGRES_HOST || '127.0.0.1',
  port: readNumber(process.env.PGPORT || process.env.POSTGRES_PORT, 5432),
  database: process.env.PGDATABASE || process.env.POSTGRES_DB,
  user: process.env.PGUSER || process.env.POSTGRES_USER,
  password: process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD,
  max: readNumber(process.env.PGPOOL_MAX, 10),
  idleTimeoutMillis: readNumber(process.env.PG_IDLE_TIMEOUT_MS, 30000),
  connectionTimeoutMillis: readNumber(process.env.PG_CONN_TIMEOUT_MS, 5000)
});

export async function testDatabaseConnection() {
  await pool.query('SELECT 1');
}

export { pool };
