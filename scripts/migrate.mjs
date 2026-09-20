import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);
const migration = readFileSync('db/migrations/0001_initial.sql', 'utf8');

const statements = migration.split(';').map(s => s.trim()).filter(Boolean);

for (const stmt of statements) {
  await sql.query(stmt);
}

console.log('Migração concluída!');
