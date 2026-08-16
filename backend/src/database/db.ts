import sqlite3 from 'sqlite3';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { config } from '../config';

// Unified Database Client Interface
export interface DatabaseClient {
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  get<T = any>(sql: string, params?: any[]): Promise<T | null>;
  run(sql: string, params?: any[]): Promise<{ lastID?: number | string; changes?: number }>;
  exec(sql: string): Promise<void>;
  close(): Promise<void>;
}

class SQLiteClient implements DatabaseClient {
  private db: sqlite3.Database;

  constructor(dbPath: string) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this.db = new sqlite3.Database(dbPath);
    this.db.run('PRAGMA foreign_keys = ON');
  }

  // Convert PostgreSQL $1, $2 parameterized placeholders to SQLite ? placeholders
  private formatSql(sql: string): string {
    return sql.replace(/\$(\d+)/g, '?');
  }

  public query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(this.formatSql(sql), params, (err, rows) => {
        if (err) return reject(err);
        resolve((rows as T[]) || []);
      });
    });
  }

  public get<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    return new Promise((resolve, reject) => {
      this.db.get(this.formatSql(sql), params, (err, row) => {
        if (err) return reject(err);
        resolve((row as T) || null);
      });
    });
  }

  public run(sql: string, params: any[] = []): Promise<{ lastID?: number | string; changes?: number }> {
    return new Promise((resolve, reject) => {
      this.db.run(this.formatSql(sql), params, function (err) {
        if (err) return reject(err);
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  public exec(sql: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.exec(sql, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

class PostgresClient implements DatabaseClient {
  private pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  public async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const res = await this.pool.query(sql, params);
    return res.rows as T[];
  }

  public async get<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const res = await this.pool.query(sql, params);
    return (res.rows[0] as T) || null;
  }

  public async run(sql: string, params: any[] = []): Promise<{ lastID?: number | string; changes?: number }> {
    const res = await this.pool.query(sql, params);
    return { changes: res.rowCount || 0 };
  }

  public async exec(sql: string): Promise<void> {
    await this.pool.query(sql);
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }
}

// Export singleton database client instance
export const db: DatabaseClient =
  config.dbType === 'postgres' && config.postgresUrl
    ? new PostgresClient(config.postgresUrl)
    : new SQLiteClient(config.sqliteDbPath);
