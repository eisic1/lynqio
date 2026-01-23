-- ============================================
-- MIGRATION: Add card_background column to links table
-- Date: 2026-01-23
-- Description: Adds card background image support for card display mode
-- ============================================

-- Add card_background column to links table
ALTER TABLE links 
ADD COLUMN IF NOT EXISTS card_background TEXT;

-- Add comment
COMMENT ON COLUMN links.card_background IS 'Background image URL for card display mode';
