const pool = require('../config/database');

class Link {
  
  // Kreiranje novog linka
  static async create(profileId, data) {
    try {
      const { title, url, description, icon, type, menu_items, card_background, display_type } = data;
      
      // Get next position
      const positionQuery = `
        SELECT COALESCE(MAX(position), 0) + 1 as next_position 
        FROM links 
        WHERE profile_id = $1
      `;
      const positionResult = await pool.query(positionQuery, [profileId]);
      const position = positionResult.rows[0].next_position;
      
      const query = `
        INSERT INTO links (profile_id, title, url, description, icon, type, menu_items, card_background, display_type, position)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
      
      const values = [
        profileId, 
        title, 
        url || null, 
        description, 
        icon, 
        type || 'link',
        menu_items ? JSON.stringify(menu_items) : null,
        card_background || null,
        display_type || 'default',
        position
      ];
      
      const result = await pool.query(query, values);
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all links for profile
  static async findByProfileId(profileId) {
    try {
      const query = `
        SELECT * FROM links 
        WHERE profile_id = $1 
        ORDER BY position ASC
      `;
      
      const result = await pool.query(query, [profileId]);
      // Parse menu_items JSON if exists
      const links = result.rows.map(link => ({
        ...link,
        menu_items: link.menu_items ? (typeof link.menu_items === 'string' ? JSON.parse(link.menu_items) : link.menu_items) : null
      }));
      
      return links;
    } catch (error) {
      throw error;
    }
  }

  // Get single link by ID
  static async findById(linkId) {
    try {
      const query = `SELECT * FROM links WHERE id = $1`;
      const result = await pool.query(query, [linkId]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const link = result.rows[0];
      
      // Parse menu_items JSON if exists
      if (link.menu_items) {
        link.menu_items = typeof link.menu_items === 'string' 
          ? JSON.parse(link.menu_items) 
          : link.menu_items;
      }
      
      return link;
    } catch (error) {
      throw error;
    }
  }

  // Update link
  static async update(linkId, data) {
    try {
      const { title, url, description, icon, is_active, type, menu_items, card_background, display_type } = data;
      
      const query = `
        UPDATE links 
        SET title = COALESCE($1, title),
            url = COALESCE($2, url),
            description = COALESCE($3, description),
            icon = COALESCE($4, icon),
            is_active = COALESCE($5, is_active),
            type = COALESCE($6, type),
            menu_items = COALESCE($7, menu_items),
            card_background = COALESCE($8, card_background),
            display_type = COALESCE($9, display_type),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $10
        RETURNING *
      `;
      
      const values = [
        title, 
        url, 
        description, 
        icon, 
        is_active, 
        type,
        menu_items ? JSON.stringify(menu_items) : null,
        card_background,
        display_type,
        linkId
      ];
      
      const result = await pool.query(query, values);
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete link
  static async delete(linkId) {
    try {
      const query = `DELETE FROM links WHERE id = $1 RETURNING *`;
      const result = await pool.query(query, [linkId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Reorder links
  static async reorder(profileId, linkPositions) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      for (const { id, position } of linkPositions) {
        await client.query(
          'UPDATE links SET position = $1 WHERE id = $2 AND profile_id = $3',
          [position, id, profileId]
        );
      }
      
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Increment click count
  static async incrementClicks(linkId) {
    try {
      const query = `
        UPDATE links 
        SET click_count = click_count + 1 
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await pool.query(query, [linkId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Check if link belongs to profile
  static async belongsToProfile(linkId, profileId) {
    try {
      const query = `SELECT id FROM links WHERE id = $1 AND profile_id = $2`;
      const result = await pool.query(query, [linkId, profileId]);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Link;