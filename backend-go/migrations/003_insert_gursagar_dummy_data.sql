-- Insert dummy data for user gursagar1107@protonmail.com
-- This script adds comprehensive test data for the specified user

-- Insert the specific user (skip if already exists)
INSERT INTO users (id, email, password, first_name, last_name, role, is_active) VALUES
('300d6075-4729-4e06-8688-3d95bcc064dd', 'gursagar1107@protonmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Gursagar', 'Singh', 'owner', true)
ON CONFLICT (id) DO NOTHING;

-- Insert organization for the user (skip if already exists)
INSERT INTO organizations (id, name, slug, description, website, phone, email, is_active) VALUES
('400d6075-4729-4e06-8688-3d95bcc064dd', 'Singh Technologies', 'singh-technologies', 'Innovative software development company specializing in full-stack web applications and mobile solutions.', 'https://singhtech.dev', '+1-555-0200', 'contact@singhtech.dev', true)
ON CONFLICT (id) DO NOTHING;

-- Insert subscriptions for the organization (skip if already exists)
INSERT INTO subscriptions (id, organization_id, plan_id, status, start_date, end_date, trial_end_date, canceled_at, current_period_start, current_period_end, auto_renew) VALUES
('600d6075-4729-4e06-8688-3d95bcc064dd', '400d6075-4729-4e06-8688-3d95bcc064dd', '770e8400-e29b-41d4-a716-446655440002', 'active', NOW() - INTERVAL '30 days', NULL, NOW() - INTERVAL '16 days', NULL, NOW() - INTERVAL '15 days', NOW() + INTERVAL '15 days', true),
('600d6075-4729-4e06-8688-3d95bcc064de', '400d6075-4729-4e06-8688-3d95bcc064dd', '770e8400-e29b-41d4-a716-446655440001', 'canceled', NOW() - INTERVAL '90 days', NOW() - INTERVAL '30 days', NULL, NOW() - INTERVAL '30 days', NOW() - INTERVAL '60 days', NOW() - INTERVAL '30 days', false)
ON CONFLICT (id) DO NOTHING;

-- Note: Payment methods and billing addresses tables don't exist in the current Go backend schema
-- These features may be added in future migrations

-- Insert invoices for the organization (skip if already exists)
INSERT INTO invoices (id, organization_id, subscription_id, invoice_number, status, subtotal, tax_amount, discount_amount, total, currency, issue_date, due_date, paid_at, notes) VALUES
('900d6075-4729-4e06-8688-3d95bcc064dd', '400d6075-4729-4e06-8688-3d95bcc064dd', '600d6075-4729-4e06-8688-3d95bcc064dd', 'INV-2024-GS001', 'paid', 29.99, 2.40, 0.00, 32.39, 'USD', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '13 days', 'Professional plan monthly subscription'),
('900d6075-4729-4e06-8688-3d95bcc064de', '400d6075-4729-4e06-8688-3d95bcc064dd', '600d6075-4729-4e06-8688-3d95bcc064dd', 'INV-2024-GS002', 'sent', 29.99, 2.40, 0.00, 32.39, 'USD', NOW(), NOW() + INTERVAL '15 days', NULL, 'Professional plan monthly subscription'),
('900d6075-4729-4e06-8688-3d95bcc064df', '400d6075-4729-4e06-8688-3d95bcc064dd', '600d6075-4729-4e06-8688-3d95bcc064de', 'INV-2024-GS003', 'paid', 9.99, 0.80, 0.00, 10.79, 'USD', NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days', NOW() - INTERVAL '43 days', 'Starter plan monthly subscription (canceled)'),
('900d6075-4729-4e06-8688-3d95bcc064e0', '400d6075-4729-4e06-8688-3d95bcc064dd', '600d6075-4729-4e06-8688-3d95bcc064dd', 'INV-2024-GS004', 'overdue', 29.99, 2.40, 5.00, 27.39, 'USD', NOW() - INTERVAL '45 days', NOW() - INTERVAL '30 days', NULL, 'Professional plan with discount - payment failed')
ON CONFLICT (id) DO NOTHING;

-- Display summary of inserted data for Gursagar Singh
SELECT 'Dummy data insertion completed for Gursagar Singh!' as status;
SELECT 
    'User: ' || first_name || ' ' || last_name || ' (' || email || ')' as user_info
FROM users 
WHERE id = '300d6075-4729-4e06-8688-3d95bcc064dd';

SELECT 
    'Organization: ' || name || ' (' || slug || ')' as organization_info
FROM organizations 
WHERE id = '400d6075-4729-4e06-8688-3d95bcc064dd';

SELECT 
    'Subscriptions' as table_name, 
    COUNT(*) as records_inserted 
FROM subscriptions 
WHERE organization_id = '400d6075-4729-4e06-8688-3d95bcc064dd'
UNION ALL
SELECT 
    'Invoices' as table_name, 
    COUNT(*) as records_inserted 
FROM invoices 
WHERE organization_id = '400d6075-4729-4e06-8688-3d95bcc064dd';