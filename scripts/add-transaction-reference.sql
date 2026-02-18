-- Add transaction_reference column to donations table
-- This column stores the Hubtel client reference for tracking payments

ALTER TABLE donations 
ADD COLUMN IF NOT EXISTS transaction_reference VARCHAR(50);

-- Create an index on transaction_reference for faster lookups
CREATE INDEX IF NOT EXISTS idx_donations_transaction_reference 
ON donations(transaction_reference);

-- Add a comment to document the column
COMMENT ON COLUMN donations.transaction_reference IS 'Hubtel client reference for payment tracking (format: DON-{shortid}-{timestamp})';
