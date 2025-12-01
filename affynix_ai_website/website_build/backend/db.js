import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure data directory exists
const dataDir = join(__dirname, 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.DATABASE_PATH || join(dataDir, 'affynix.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    full_name TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    agent_name TEXT NOT NULL,
    metadata TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    company TEXT,
    phone TEXT,
    business_type TEXT,
    plan TEXT,
    payment_status TEXT,
    onboarding_step TEXT,
    monthly_revenue REAL DEFAULT 0,
    notes TEXT,
    hubspot_contact_id TEXT,
    created_date TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS intake_submissions (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    company TEXT,
    phone TEXT,
    service_type TEXT,
    business_challenges TEXT,
    current_revenue TEXT,
    team_size TEXT,
    notes TEXT,
    status TEXT DEFAULT 'New',
    created_date TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS app_configurations (
    id TEXT PRIMARY KEY,
    config_key TEXT UNIQUE NOT NULL,
    config_value TEXT,
    config_type TEXT,
    category TEXT,
    created_date TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    client_id TEXT,
    amount REAL NOT NULL,
    payment_type TEXT,
    status TEXT,
    description TEXT,
    payment_date TEXT DEFAULT CURRENT_TIMESTAMP,
    created_date TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
  );

  CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    agent_name TEXT NOT NULL,
    agent_type TEXT,
    client_id TEXT,
    status TEXT,
    monthly_cost REAL DEFAULT 0,
    performance_score REAL DEFAULT 0,
    total_interactions INTEGER DEFAULT 0,
    success_rate REAL DEFAULT 0,
    api_endpoint TEXT,
    notes TEXT,
    created_date TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
  );

  CREATE TABLE IF NOT EXISTS chat_sessions (
    id TEXT PRIMARY KEY,
    conversation_id TEXT,
    user_id TEXT,
    created_date TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price REAL,
    active INTEGER DEFAULT 1,
    created_date TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
  CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
  CREATE INDEX IF NOT EXISTS idx_payments_client ON payments(client_id);
  CREATE INDEX IF NOT EXISTS idx_agents_client ON agents(client_id);
`);

// Helper functions
export const dbHelpers = {
  // Users
  createUser: (user) => {
    const stmt = db.prepare(`
      INSERT INTO users (id, email, password_hash, role, full_name)
      VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(user.id, user.email, user.password_hash, user.role || 'user', user.full_name || null);
  },

  getUserByEmail: (email) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  },

  getUserById: (id) => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  },

  // Conversations
  createConversation: (conversation) => {
    const stmt = db.prepare(`
      INSERT INTO conversations (id, user_id, agent_name, metadata)
      VALUES (?, ?, ?, ?)
    `);
    const metadata = conversation.metadata ? JSON.stringify(conversation.metadata) : null;
    return stmt.run(conversation.id, conversation.user_id || null, conversation.agent_name, metadata);
  },

  getConversation: (id) => {
    const stmt = db.prepare('SELECT * FROM conversations WHERE id = ?');
    const conv = stmt.get(id);
    if (conv && conv.metadata) {
      try {
        conv.metadata = JSON.parse(conv.metadata);
      } catch (e) {
        conv.metadata = null;
      }
    }
    return conv;
  },

  getConversationsByUser: (userId) => {
    const stmt = db.prepare('SELECT * FROM conversations WHERE user_id = ? ORDER BY created_at DESC');
    return stmt.all(userId).map(conv => {
      if (conv.metadata) {
        try {
          conv.metadata = JSON.parse(conv.metadata);
        } catch (e) {
          conv.metadata = null;
        }
      }
      return conv;
    });
  },

  // Messages
  createMessage: (message) => {
    const stmt = db.prepare(`
      INSERT INTO messages (id, conversation_id, role, content)
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(message.id, message.conversation_id, message.role, message.content);
  },

  getMessagesByConversation: (conversationId) => {
    const stmt = db.prepare(`
      SELECT * FROM messages 
      WHERE conversation_id = ? 
      ORDER BY created_at ASC
    `);
    return stmt.all(conversationId);
  },

  // Generic entity helpers
  getAll: (table) => {
    const stmt = db.prepare(`SELECT * FROM ${table} ORDER BY created_date DESC`);
    return stmt.all();
  },

  getById: (table, id) => {
    const stmt = db.prepare(`SELECT * FROM ${table} WHERE id = ?`);
    return stmt.get(id);
  },

  create: (table, data) => {
    const keys = Object.keys(data).filter(k => k !== 'id' && data[k] !== undefined);
    const placeholders = keys.map(() => '?').join(', ');
    const values = keys.map(k => {
      if (typeof data[k] === 'object') {
        return JSON.stringify(data[k]);
      }
      return data[k];
    });
    
    const id = data.id || `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const allKeys = ['id', ...keys];
    const allValues = [id, ...values];
    
    const sql = `INSERT INTO ${table} (${allKeys.join(', ')}) VALUES (${allKeys.map(() => '?').join(', ')})`;
    const stmt = db.prepare(sql);
    stmt.run(...allValues);
    
    return dbHelpers.getById(table, id);
  },

  update: (table, id, data) => {
    const keys = Object.keys(data).filter(k => k !== 'id' && data[k] !== undefined);
    if (keys.length === 0) return dbHelpers.getById(table, id);
    
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => {
      if (typeof data[k] === 'object') {
        return JSON.stringify(data[k]);
      }
      return data[k];
    });
    
    const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
    const stmt = db.prepare(sql);
    stmt.run(...values, id);
    
    return dbHelpers.getById(table, id);
  },

  delete: (table, id) => {
    const stmt = db.prepare(`DELETE FROM ${table} WHERE id = ?`);
    return stmt.run(id);
  },

  filter: (table, filters) => {
    const conditions = Object.keys(filters).map(k => `${k} = ?`).join(' AND ');
    const values = Object.values(filters);
    const sql = `SELECT * FROM ${table} WHERE ${conditions} ORDER BY created_date DESC`;
    const stmt = db.prepare(sql);
    return stmt.all(...values);
  }
};

export default db;
