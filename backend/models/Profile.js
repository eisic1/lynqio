const pool = require('../config/database');

class Profile {
  
  // Kreiranje profila za novog korisnika
  static async create(userId, slug) {
    try {
      const query = `
        INSERT INTO profiles (user_id, slug, title, is_public)
        VALUES ($1, $2, $3, true)
        RETURNING *
      `;
      
      const title = `@${slug}'s Links`;
      const values = [userId, slug, title];
      const result = await pool.query(query, values);
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Pronalaženje profila po slug-u (javni pristup)
  static async findBySlug(slug) {
    try {
      const query = `
        SELECT p.*, u.username, u.avatar_url as user_avatar
        FROM profiles p
        JOIN users u ON p.user_id = u.id
        WHERE p.slug = $1 AND p.is_public = true
      `;
      
      const result = await pool.query(query, [slug]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Pronalaženje profila po user_id
  static async findByUserId(userId) {
    try {
      const query = `
        SELECT * FROM profiles WHERE user_id = $1
      `;
      
      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update profila
  static async update(profileId, data) {
    try {
      const { title, bio, profile_image_url, theme, seo_title, seo_description, is_public } = data;
      
      const query = `
        UPDATE profiles 
        SET title = COALESCE($1, title),
            bio = COALESCE($2, bio),
            profile_image_url = COALESCE($3, profile_image_url),
            theme = COALESCE($4, theme),
            seo_title = COALESCE($5, seo_title),
            seo_description = COALESCE($6, seo_description),
            is_public = COALESCE($7, is_public),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING *
      `;
      
      const values = [title, bio, profile_image_url, theme, seo_title, seo_description, is_public, profileId];
      const result = await pool.query(query, values);
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Increment views count
  static async incrementViews(profileId) {
    try {
      const query = `
        UPDATE profiles 
        SET views_count = views_count + 1 
        WHERE id = $1
      `;
      
      await pool.query(query, [profileId]);
    } catch (error) {
      throw error;
    }
  }

  // Check if slug exists
  static async slugExists(slug) {
    try {
      const query = `SELECT id FROM profiles WHERE slug = $1`;
      const result = await pool.query(query, [slug]);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get profile with links
  static async getProfileWithLinks(slug) {
    try {
      // Get profile
      const profileQuery = `
        SELECT p.*, u.username, u.avatar_url as user_avatar
        FROM profiles p
        JOIN users u ON p.user_id = u.id
        WHERE p.slug = $1 AND p.is_public = true
      `;
      
      const profileResult = await pool.query(profileQuery, [slug]);
      
      if (profileResult.rows.length === 0) {
        return null;
      }
      
      const profile = profileResult.rows[0];
      
      // Get links
      const linksQuery = `
        SELECT id, title, url, description, icon, position, click_count
        FROM links
        WHERE profile_id = $1 AND is_active = true
        ORDER BY position ASC
      `;
      
      const linksResult = await pool.query(linksQuery, [profile.id]);
      
      return {
        ...profile,
        links: linksResult.rows
      };
    } catch (error) {
      throw error;
    }
  }

  // Get profile statistics
  static async getStats(profileId) {
    try {
      const query = `
        SELECT 
          (SELECT COUNT(*) FROM links WHERE profile_id = $1 AND is_active = true) as total_links,
          (SELECT SUM(click_count) FROM links WHERE profile_id = $1) as total_clicks,
          (SELECT views_count FROM profiles WHERE id = $1) as total_views
      `;
      
      const result = await pool.query(query, [profileId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Profile;