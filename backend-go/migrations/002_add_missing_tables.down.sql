-- Rollback migration 002_add_missing_tables

-- Drop triggers for new tables
DROP TRIGGER IF EXISTS update_organization_members_updated_at ON organization_members;
DROP TRIGGER IF EXISTS update_payment_methods_updated_at ON payment_methods;
DROP TRIGGER IF EXISTS update_billing_addresses_updated_at ON billing_addresses;
DROP TRIGGER IF EXISTS update_invoice_items_updated_at ON invoice_items;

-- Drop indexes
DROP INDEX IF EXISTS idx_organization_members_user;
DROP INDEX IF EXISTS idx_organization_members_org;
DROP INDEX IF EXISTS idx_organization_members_role;
DROP INDEX IF EXISTS idx_organization_members_active;

DROP INDEX IF EXISTS idx_payment_methods_org;
DROP INDEX IF EXISTS idx_payment_methods_type;
DROP INDEX IF EXISTS idx_payment_methods_default;
DROP INDEX IF EXISTS idx_payment_methods_active;

DROP INDEX IF EXISTS idx_billing_addresses_org;
DROP INDEX IF EXISTS idx_billing_addresses_default;

DROP INDEX IF EXISTS idx_invoice_items_invoice;

DROP INDEX IF EXISTS idx_invoices_org;
DROP INDEX IF EXISTS idx_invoices_payment_method;

-- Drop new tables (in reverse order due to foreign key constraints)
DROP TABLE IF EXISTS invoice_items;
DROP TABLE IF EXISTS billing_addresses;
DROP TABLE IF EXISTS payment_methods;
DROP TABLE IF EXISTS organization_members;

-- Revert invoices table changes
ALTER TABLE invoices 
    DROP COLUMN IF EXISTS organization_id,
    DROP COLUMN IF EXISTS payment_method_id,
    DROP COLUMN IF EXISTS subtotal,
    DROP COLUMN IF EXISTS tax_amount,
    DROP COLUMN IF EXISTS discount_amount,
    DROP COLUMN IF EXISTS issue_date,
    DROP COLUMN IF EXISTS notes,
    DROP COLUMN IF EXISTS deleted_at;

-- Rename total back to amount if needed
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'total') THEN
        ALTER TABLE invoices RENAME COLUMN total TO amount;
    END IF;
END $$;

-- Add back original invoice columns
ALTER TABLE invoices 
    ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
    ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(255),
    ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Revert subscriptions table changes
ALTER TABLE subscriptions 
    DROP COLUMN IF EXISTS start_date,
    DROP COLUMN IF EXISTS end_date,
    DROP COLUMN IF EXISTS trial_end_date,
    DROP COLUMN IF EXISTS auto_renew,
    DROP COLUMN IF EXISTS deleted_at;

-- Add back original subscription columns
ALTER TABLE subscriptions 
    ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS trial_start TIMESTAMP,
    ADD COLUMN IF NOT EXISTS trial_end TIMESTAMP,
    ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Revert plans table changes
ALTER TABLE plans 
    DROP COLUMN IF EXISTS slug,
    DROP COLUMN IF EXISTS interval,
    DROP COLUMN IF EXISTS trial_days,
    DROP COLUMN IF EXISTS deleted_at;

-- Add back original plan columns
ALTER TABLE plans 
    ADD COLUMN IF NOT EXISTS billing_cycle VARCHAR(50),
    ADD COLUMN IF NOT EXISTS max_users INTEGER,
    ADD COLUMN IF NOT EXISTS max_projects INTEGER,
    ADD COLUMN IF NOT EXISTS storage_gb INTEGER;

-- Revert plans features column type
ALTER TABLE plans ALTER COLUMN features TYPE JSONB USING features::jsonb;

-- Revert organizations table changes
ALTER TABLE organizations 
    DROP COLUMN IF EXISTS phone,
    DROP COLUMN IF EXISTS email,
    DROP COLUMN IF EXISTS deleted_at;

-- Add back original organization columns
ALTER TABLE organizations 
    ADD COLUMN IF NOT EXISTS logo_url VARCHAR(255),
    ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES users(id);

-- Revert users table changes
ALTER TABLE users 
    DROP COLUMN IF EXISTS role,
    DROP COLUMN IF EXISTS organization,
    DROP COLUMN IF EXISTS deleted_at;