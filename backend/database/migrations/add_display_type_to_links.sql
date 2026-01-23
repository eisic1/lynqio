-- ============================================
-- MIGRATION: Add display_type column to links table
-- Date: 2026-01-23
-- Description: Adds display type option for each link (default, button, card)
-- ============================================

-- Add display_type column to links table
ALTER TABLE links 
ADD COLUMN IF NOT EXISTS display_type VARCHAR(20) DEFAULT 'default' CHECK (display_type IN ('default', 'button', 'card'));

-- Add comment
COMMENT ON COLUMN links.display_type IS 'Display type for this link: default (use global setting), button, or card';
