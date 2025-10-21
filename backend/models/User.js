const pool = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  
  // Kreiranje novog korisnika
  static async create({ username, email, password, full_name }) {
    try {
      // Hash password
      const password_hash = await bcrypt.hash(password, 10);
      
      const query = `
        INSERT INTO users (username, email, password_hash, full_name)
        VALUES ($1, $2, $3, $4)
        RETURNING id, username, email, full_name, is_verified, is_active, role, created_at
      `;
      
      const values = [username, email, password_hash, full_name];
      const result = await pool.query(query, values);
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Pronalaženje korisnika po email-u
  static async findByEmail(email) {
    try {
      const query = `
        SELECT * FROM users WHERE email = $1
      `;
      
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Pronalaženje korisnika po username-u
  static async findByUsername(username) {
    try {
      const query = `
        SELECT * FROM users WHERE username = $1
      `;
      
      const result = await pool.query(query, [username]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Pronalaženje korisnika po ID-u
  static async findById(id) {
    try {
      const query = `
        SELECT id, username, email, full_name, avatar_url, 
               is_verified, is_active, role, created_at, updated_at
        FROM users WHERE id = $1
      `;
      
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Verifikacija passworda
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw error;
    }
  }

  // Update last login
  static async updateLastLogin(userId) {
    try {
      const query = `
        UPDATE users 
        SET last_login = CURRENT_TIMESTAMP 
        WHERE id = $1
      `;
      
      await pool.query(query, [userId]);
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  static async update(userId, { full_name, avatar_url }) {
    try {
      const query = `
        UPDATE users 
        SET full_name = COALESCE($1, full_name),
            avatar_url = COALESCE($2, avatar_url),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING id, username, email, full_name, avatar_url, updated_at
      `;
      
      const values = [full_name, avatar_url, userId];
      const result = await pool.query(query, values);
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Check if email exists
  static async emailExists(email) {
    try {
      const query = `SELECT id FROM users WHERE email = $1`;
      const result = await pool.query(query, [email]);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Check if username exists
  static async usernameExists(username) {
    try {
      const query = `SELECT id FROM users WHERE username = $1`;
      const result = await pool.query(query, [username]);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete user account
  static async deleteAccount(userId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Delete će se automatski cascade na profile, links, analytics zbog foreign keys
      const query = `
        DELETE FROM users 
        WHERE id = $1
        RETURNING id
      `;
      
      const result = await client.query(query, [userId]);
      
      await client.query('COMMIT');
      
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = User;