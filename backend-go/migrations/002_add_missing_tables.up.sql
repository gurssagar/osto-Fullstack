-- Add missing tables and update existing ones to match Go models

-- Create organization_members table (junction table for users and organizations)
CREATE TABLE IF NOT EXISTS organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    is_active BOOLEAN DEFAULT true,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    UNIQUE(user_id, organization_id)
);

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('card', 'bank_account', 'paypal')),
    provider VARCHAR(50) NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    last4 VARCHAR(4),
    brand VARCHAR(50),
    expiry_month INTEGER,
    expiry_year INTEGER,
    holder_name VARCHAR(255),
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create billing_addresses table
CREATE TABLE IF NOT EXISTS billing_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    contact_name VARCHAR(255) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    tax_id VARCHAR(50),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Update users table to match Go model
ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user',
    ADD COLUMN IF NOT EXISTS organization VARCHAR(255),
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

-- Update organizations table to match Go model
ALTER TABLE organizations 
    ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
    ADD COLUMN IF NOT EXISTS email VARCHAR(255),
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP,
    DROP COLUMN IF EXISTS logo_url,
    DROP COLUMN IF EXISTS owner_id;

-- Update plans table to match Go model
ALTER TABLE plans 
    ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE,
    ADD COLUMN IF NOT EXISTS interval VARCHAR(50),
    ADD COLUMN IF NOT EXISTS trial_days INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP,
    DROP COLUMN IF EXISTS billing_cycle,
    DROP COLUMN IF EXISTS max_users,
    DROP COLUMN IF EXISTS max_projects,
    DROP COLUMN IF EXISTS storage_gb;

-- Update plans table to rename features column type
ALTER TABLE plans ALTER COLUMN features TYPE TEXT;

-- Update subscriptions table to match Go model
ALTER TABLE subscriptions 
    ADD COLUMN IF NOT EXISTS start_date TIMESTAMP,
    ADD COLUMN IF NOT EXISTS end_date TIMESTAMP,
    ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMP,
    ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP,
    DROP COLUMN IF EXISTS cancel_at_period_end,
    DROP COLUMN IF EXISTS trial_start,
    DROP COLUMN IF EXISTS trial_end,
    DROP COLUMN IF EXISTS metadata;

-- Update invoices table to match Go model
ALTER TABLE invoices 
    ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS payment_method_id UUID REFERENCES payment_methods(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2),
    ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS total DECIMAL(10,2),
    ADD COLUMN IF NOT EXISTS issue_date TIMESTAMP,
    ADD COLUMN IF NOT EXISTS notes TEXT,
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP,
    DROP COLUMN IF EXISTS payment_method,
    DROP COLUMN IF EXISTS payment_reference,
    DROP COLUMN IF EXISTS metadata;

-- Rename amount to total in invoices if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'amount') THEN
        ALTER TABLE invoices RENAME COLUMN amount TO total;
    END IF;
END $$;

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_organization_members_user ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_org ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_role ON organization_members(role);
CREATE INDEX IF NOT EXISTS idx_organization_members_active ON organization_members(is_active);

CREATE INDEX IF NOT EXISTS idx_payment_methods_org ON payment_methods(organization_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_type ON payment_methods(type);
CREATE INDEX IF NOT EXISTS idx_payment_methods_default ON payment_methods(is_default);
CREATE INDEX IF NOT EXISTS idx_payment_methods_active ON payment_methods(is_active);

CREATE INDEX IF NOT EXISTS idx_billing_addresses_org ON billing_addresses(organization_id);
CREATE INDEX IF NOT EXISTS idx_billing_addresses_default ON billing_addresses(is_default);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);

CREATE INDEX IF NOT EXISTS idx_invoices_org ON invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoices_payment_method ON invoices(payment_method_id);

-- Create triggers for updated_at on new tables
CREATE TRIGGER update_organization_members_updated_at 
    BEFORE UPDATE ON organization_members 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at 
    BEFORE UPDATE ON payment_methods 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_billing_addresses_updated_at 
    BEFORE UPDATE ON billing_addresses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoice_items_updated_at 
    BEFORE UPDATE ON invoice_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update existing plan slugs if they don't exist
UPDATE plans SET slug = LOWER(REPLACE(name, ' ', '-')) WHERE slug IS NULL;

-- Update existing subscription start_date if it doesn't exist
UPDATE subscriptions SET start_date = current_period_start WHERE start_date IS NULL;

-- Update existing invoice fields
UPDATE invoices SET 
    subtotal = total,
    issue_date = created_at
WHERE subtotal IS NULL OR issue_date IS NULL;