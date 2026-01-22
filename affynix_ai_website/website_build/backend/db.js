import { Pool } from 'pg';

// Get connection string from environment
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set. Please configure your Supabase Postgres connection string.');
}

// Create connection pool
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false // Required for Supabase
  },
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

console.log('[DB] Connected to Supabase Postgres database');

// Initialize tables (run on module load)
async function initializeTables() {
  const client = await pool.connect();
  try {
    // Enable foreign keys (Postgres equivalent)
    await client.query('SET session_replication_role = replica;');
    
    // Create tables with Postgres-compatible syntax
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        full_name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS conversations (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255),
        agent_name VARCHAR(255) NOT NULL,
        metadata TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(255) PRIMARY KEY,
        conversation_id VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS clients (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        company VARCHAR(255),
        phone VARCHAR(50),
        business_type VARCHAR(100),
        plan VARCHAR(50),
        payment_status VARCHAR(50),
        onboarding_step VARCHAR(50),
        monthly_revenue DECIMAL(10, 2) DEFAULT 0,
        notes TEXT,
        hubspot_contact_id VARCHAR(255),
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS intake_submissions (
        id VARCHAR(255) PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        client_email VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        phone VARCHAR(50),
        service_type VARCHAR(100),
        business_challenges TEXT,
        current_revenue VARCHAR(50),
        team_size VARCHAR(50),
        notes TEXT,
        status VARCHAR(50) DEFAULT 'New',
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS app_configurations (
        id VARCHAR(255) PRIMARY KEY,
        config_key VARCHAR(255) UNIQUE NOT NULL,
        config_value TEXT,
        config_type VARCHAR(50),
        category VARCHAR(100),
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(255) PRIMARY KEY,
        client_id VARCHAR(255),
        amount DECIMAL(10, 2) NOT NULL,
        payment_type VARCHAR(50),
        status VARCHAR(50),
        description TEXT,
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id)
      );

      CREATE TABLE IF NOT EXISTS agents (
        id VARCHAR(255) PRIMARY KEY,
        agent_name VARCHAR(255) NOT NULL,
        agent_type VARCHAR(50),
        client_id VARCHAR(255),
        status VARCHAR(50),
        monthly_cost DECIMAL(10, 2) DEFAULT 0,
        performance_score DECIMAL(5, 2) DEFAULT 0,
        total_interactions INTEGER DEFAULT 0,
        success_rate DECIMAL(5, 2) DEFAULT 0,
        api_endpoint TEXT,
        notes TEXT,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id)
      );

      CREATE TABLE IF NOT EXISTS chat_sessions (
        id VARCHAR(255) PRIMARY KEY,
        conversation_id VARCHAR(255),
        user_id VARCHAR(255),
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2),
        active INTEGER DEFAULT 1,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
      CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
      CREATE INDEX IF NOT EXISTS idx_payments_client ON payments(client_id);
      CREATE INDEX IF NOT EXISTS idx_agents_client ON agents(client_id);
    `);
    
    console.log('[DB] Tables initialized successfully');
  } catch (error) {
    console.error('[DB] Error initializing tables:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Initialize tables on module load
initializeTables().catch(err => {
  console.error('[DB] Failed to initialize database:', err);
  // Don't throw here - let the app start and handle errors gracefully
});

// Helper functions
export const dbHelpers = {
  // Users
  createUser: async (user) => {
    const result = await pool.query(
      `INSERT INTO users (id, email, password_hash, role, full_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user.id, user.email, user.password_hash, user.role || 'user', user.full_name || null]
    );
    return result.rows[0];
  },

  getUserByEmail: async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  },

  getUserById: async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  // Conversations
  createConversation: async (conversation) => {
    const metadata = conversation.metadata ? JSON.stringify(conversation.metadata) : null;
    const result = await pool.query(
      `INSERT INTO conversations (id, user_id, agent_name, metadata)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [conversation.id, conversation.user_id || null, conversation.agent_name, metadata]
    );
    const conv = result.rows[0];
    if (conv && conv.metadata) {
      try {
        conv.metadata = JSON.parse(conv.metadata);
      } catch (e) {
        conv.metadata = null;
      }
    }
    return conv;
  },

  getConversation: async (id) => {
    const result = await pool.query('SELECT * FROM conversations WHERE id = $1', [id]);
    const conv = result.rows[0] || null;
    if (conv && conv.metadata) {
      try {
        conv.metadata = JSON.parse(conv.metadata);
      } catch (e) {
        conv.metadata = null;
      }
    }
    return conv;
  },

  getConversationsByUser: async (userId) => {
    const result = await pool.query(
      'SELECT * FROM conversations WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows.map(conv => {
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
  createMessage: async (message) => {
    const result = await pool.query(
      `INSERT INTO messages (id, conversation_id, role, content)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [message.id, message.conversation_id, message.role, message.content]
    );
    return result.rows[0];
  },

  getMessageById: async (id) => {
    const result = await pool.query('SELECT * FROM messages WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  getMessagesByConversation: async (conversationId) => {
    const result = await pool.query(
      `SELECT * FROM messages 
       WHERE conversation_id = $1 
       ORDER BY created_at ASC`,
      [conversationId]
    );
    return result.rows;
  },

  // Generic entity helpers
  getAll: async (table) => {
    const result = await pool.query(`SELECT * FROM ${table} ORDER BY created_date DESC`);
    return result.rows;
  },

  getById: async (table, id) => {
    const result = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
    return result.rows[0] || null;
  },

  create: async (table, data) => {
    const keys = Object.keys(data).filter(k => k !== 'id' && data[k] !== undefined);
    const placeholders = keys.map((_, i) => `$${i + 2}`).join(', ');
    const values = keys.map(k => {
      if (typeof data[k] === 'object') {
        return JSON.stringify(data[k]);
      }
      return data[k];
    });
    
    const id = data.id || `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const allKeys = ['id', ...keys];
    const allValues = [id, ...values];
    const allPlaceholders = allKeys.map((_, i) => `$${i + 1}`).join(', ');
    
    const sql = `INSERT INTO ${table} (${allKeys.join(', ')}) VALUES (${allPlaceholders}) RETURNING *`;
    const result = await pool.query(sql, allValues);
    
    return result.rows[0];
  },

  update: async (table, id, data) => {
    const keys = Object.keys(data).filter(k => k !== 'id' && data[k] !== undefined);
    if (keys.length === 0) return await dbHelpers.getById(table, id);
    
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const values = keys.map(k => {
      if (typeof data[k] === 'object') {
        return JSON.stringify(data[k]);
      }
      return data[k];
    });
    
    const sql = `UPDATE ${table} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
    const result = await pool.query(sql, [...values, id]);
    
    return result.rows[0] || null;
  },

  delete: async (table, id) => {
    const result = await pool.query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [id]);
    return result.rows[0] || null;
  },

  filter: async (table, filters) => {
    const conditions = Object.keys(filters).map((k, i) => `${k} = $${i + 1}`).join(' AND ');
    const values = Object.values(filters);
    const sql = `SELECT * FROM ${table} WHERE ${conditions} ORDER BY created_date DESC`;
    const result = await pool.query(sql, values);
    return result.rows;
  }
};

// Export pool for direct query access if needed
export default pool;
