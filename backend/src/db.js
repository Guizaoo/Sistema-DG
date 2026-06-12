import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdirSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { config } from './config.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const databasePath = config.databasePath.startsWith('/')
  ? config.databasePath
  : new URL(`../${config.databasePath}`, `file://${__dirname}/`).pathname

mkdirSync(dirname(databasePath), { recursive: true })

export const db = new Database(databasePath)

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    client_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'Pendente',
    value INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE (date, time)
  );
`)

const adminPhone = String(config.adminPhone ?? '').replace(/\D/g, '')

if (config.adminName && adminPhone && config.adminPassword) {
  const existingAdmin = db
    .prepare('SELECT id FROM users WHERE phone = ?')
    .get(adminPhone)

  if (!existingAdmin) {
    db.prepare(
      `
        INSERT INTO users (id, name, phone, password_hash, role)
        VALUES (@id, @name, @phone, @password_hash, 'admin')
      `,
    ).run({
      id: randomUUID(),
      name: config.adminName,
      phone: adminPhone,
      password_hash: bcrypt.hashSync(config.adminPassword, 10),
    })
  }
}
