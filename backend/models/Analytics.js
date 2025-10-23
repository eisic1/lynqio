const pool = require('../config/database');

class Analytics {
  
  // ========== OVERVIEW STATS ==========
  
  // Get overview statistics
  static async getOverview(profileId) {
    try {
      const query = `
        SELECT 
          p.views_count as total_views,
          COALESCE(SUM(l.click_count), 0) as total_clicks,
          COUNT(DISTINCT CASE WHEN l.is_active = true THEN l.id END) as active_links,
          COUNT(DISTINCT l.id) as total_links
        FROM profiles p
        LEFT JOIN links l ON l.profile_id = p.id
        WHERE p.id = $1
        GROUP BY p.id, p.views_count
      `;
      
      const result = await pool.query(query, [profileId]);
      
      if (result.rows.length === 0) {
        return {
          total_views: 0,
          total_clicks: 0,
          active_links: 0,
          total_links: 0,
          click_rate: 0
        };
      }
      
      const data = result.rows[0];
      
      // Calculate click rate (CTR)
      const clickRate = data.total_views > 0 
        ? ((parseInt(data.total_clicks) / parseInt(data.total_views)) * 100).toFixed(2)
        : 0;
      
      return {
        total_views: parseInt(data.total_views),
        total_clicks: parseInt(data.total_clicks),
        active_links: parseInt(data.active_links),
        total_links: parseInt(data.total_links),
        click_rate: parseFloat(clickRate)
      };
    } catch (error) {
      throw error;
    }
  }

  // ========== TOP LINKS ==========
  
  // Get top performing links
  static async getTopLinks(profileId, limit = 5) {
    try {
      const query = `
        SELECT 
          id,
          title,
          url,
          icon,
          click_count,
          position,
          is_active
        FROM links
        WHERE profile_id = $1 AND is_active = true
        ORDER BY click_count DESC
        LIMIT $2
      `;
      
      const result = await pool.query(query, [profileId, limit]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // ========== ALL LINKS PERFORMANCE ==========
  
  // Get all links with performance data
  static async getAllLinksPerformance(profileId) {
    try {
      const query = `
        SELECT 
          id,
          title,
          url,
          icon,
          click_count,
          position,
          is_active,
          created_at
        FROM links
        WHERE profile_id = $1
        ORDER BY click_count DESC
      `;
      
      const result = await pool.query(query, [profileId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // ========== TIMELINE DATA ==========
  
  // Get views and clicks timeline for last N days
  static async getTimeline(profileId, days = 7) {
    try {
      // Get profile views per day
      const viewsQuery = `
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM analytics
        WHERE profile_id = $1 
          AND event_type = 'profile_view'
          AND created_at >= NOW() - INTERVAL '${days} days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;
      
      // Get link clicks per day
      const clicksQuery = `
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM analytics
        WHERE profile_id = $1 
          AND event_type = 'link_click'
          AND created_at >= NOW() - INTERVAL '${days} days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;
      
      const viewsResult = await pool.query(viewsQuery, [profileId]);
      const clicksResult = await pool.query(clicksQuery, [profileId]);
      
      // Create array of last N days
      const timeline = [];
      const today = new Date();
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Find views for this date
        const viewsData = viewsResult.rows.find(row => {
          const rowDate = new Date(row.date).toISOString().split('T')[0];
          return rowDate === dateStr;
        });
        
        // Find clicks for this date
        const clicksData = clicksResult.rows.find(row => {
          const rowDate = new Date(row.date).toISOString().split('T')[0];
          return rowDate === dateStr;
        });
        
        timeline.push({
          date: dateStr,
          views: viewsData ? parseInt(viewsData.count) : 0,
          clicks: clicksData ? parseInt(clicksData.count) : 0
        });
      }
      
      return timeline;
    } catch (error) {
      throw error;
    }
  }

  // ========== TRACK EVENTS (Already exists, but let's verify) ==========
  
  // Track profile view
  static async trackProfileView(profileId, metadata = {}) {
    try {
      const query = `
        INSERT INTO analytics (
          profile_id, 
          event_type, 
          ip_address_hash, 
          user_agent, 
          referrer
        )
        VALUES ($1, 'profile_view', $2, $3, $4)
        RETURNING *
      `;
      
      const values = [
        profileId,
        metadata.ip_hash || null,
        metadata.user_agent || null,
        metadata.referrer || null
      ];
      
      const result = await pool.query(query, values);
      
      // Increment profile views_count
      await pool.query(
        'UPDATE profiles SET views_count = views_count + 1 WHERE id = $1',
        [profileId]
      );
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Track link click
  static async trackLinkClick(linkId, profileId, metadata = {}) {
    try {
      const query = `
        INSERT INTO analytics (
          profile_id,
          link_id,
          event_type, 
          ip_address_hash, 
          user_agent, 
          referrer
        )
        VALUES ($1, $2, 'link_click', $3, $4, $5)
        RETURNING *
      `;
      
      const values = [
        profileId,
        linkId,
        metadata.ip_hash || null,
        metadata.user_agent || null,
        metadata.referrer || null
      ];
      
      const result = await pool.query(query, values);
      
      // Increment link click_count (already done in Link model, but verify)
      await pool.query(
        'UPDATE links SET click_count = click_count + 1 WHERE id = $1',
        [linkId]
      );
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Analytics;