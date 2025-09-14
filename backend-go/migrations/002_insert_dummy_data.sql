-- Insert dummy data for all tables
-- This script populates the database with realistic sample data for development and testing

-- Insert dummy users
INSERT INTO users (id, email, password, first_name, last_name, role, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John', 'Doe', 'admin', true),
('550e8400-e29b-41d4-a716-446655440002', 'jane.smith@techcorp.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jane', 'Smith', 'user', true),
('550e8400-e29b-41d4-a716-446655440003', 'mike.johnson@startup.io', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mike', 'Johnson', 'user', true),
('550e8400-e29b-41d4-a716-446655440004', 'sarah.wilson@enterprise.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Sarah', 'Wilson', 'user', true),
('550e8400-e29b-41d4-a716-446655440005', 'alex.brown@freelance.dev', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Alex', 'Brown', 'user', true),
('550e8400-e29b-41d4-a716-446655440006', 'emma.davis@agency.co', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Emma', 'Davis', 'user', true),
('550e8400-e29b-41d4-a716-446655440007', 'david.miller@consulting.biz', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'David', 'Miller', 'user', false),
('550e8400-e29b-41d4-a716-446655440008', 'lisa.garcia@nonprofit.org', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Lisa', 'Garcia', 'user', true);

-- Insert dummy organizations
INSERT INTO organizations (id, name, slug, description, website, phone, email, is_active) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'TechCorp Solutions', 'techcorp-solutions', 'Leading technology solutions provider specializing in enterprise software development and digital transformation.', 'https://techcorp.com', '+1-555-0101', 'contact@techcorp.com', true),
('660e8400-e29b-41d4-a716-446655440002', 'Startup Innovations', 'startup-innovations', 'Fast-growing startup focused on AI-powered business automation tools and workflow optimization.', 'https://startup.io', '+1-555-0102', 'hello@startup.io', true),
('660e8400-e29b-41d4-a716-446655440003', 'Enterprise Global', 'enterprise-global', 'Fortune 500 company providing comprehensive business solutions across multiple industries worldwide.', 'https://enterprise.com', '+1-555-0103', 'info@enterprise.com', true),
('660e8400-e29b-41d4-a716-446655440004', 'Freelance Hub', 'freelance-hub', 'Independent consulting and development services for small to medium businesses.', 'https://freelance.dev', '+1-555-0104', 'contact@freelance.dev', true),
('660e8400-e29b-41d4-a716-446655440005', 'Creative Agency', 'creative-agency', 'Full-service digital marketing and creative agency specializing in brand development and online presence.', 'https://agency.co', '+1-555-0105', 'hello@agency.co', true),
('660e8400-e29b-41d4-a716-446655440006', 'Miller Consulting', 'miller-consulting', 'Strategic business consulting firm helping companies optimize operations and drive growth.', 'https://consulting.biz', '+1-555-0106', 'info@consulting.biz', false),
('660e8400-e29b-41d4-a716-446655440007', 'Community Foundation', 'community-foundation', 'Non-profit organization dedicated to community development and social impact initiatives.', 'https://nonprofit.org', '+1-555-0107', 'contact@nonprofit.org', true);

-- Insert dummy plans
INSERT INTO plans (id, name, slug, description, price, currency, interval, features, is_active, is_popular, trial_days) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Starter', 'starter', 'Perfect for individuals and small teams getting started with basic features and limited usage.', 9.99, 'USD', 'monthly', '{"features": ["Basic Dashboard", "5 Projects", "Email Support", "1GB Storage"], "limits": {"api_calls": 1000, "team_members": 3}}', true, false, 14),
('770e8400-e29b-41d4-a716-446655440002', 'Professional', 'professional', 'Ideal for growing businesses with advanced features, increased limits, and priority support.', 29.99, 'USD', 'monthly', '{"features": ["Advanced Dashboard", "Unlimited Projects", "Priority Support", "50GB Storage", "API Access", "Custom Integrations"], "limits": {"api_calls": 10000, "team_members": 15}}', true, true, 14),
('770e8400-e29b-41d4-a716-446655440003', 'Enterprise', 'enterprise', 'Comprehensive solution for large organizations with unlimited usage, dedicated support, and custom features.', 99.99, 'USD', 'monthly', '{"features": ["Enterprise Dashboard", "Unlimited Everything", "24/7 Dedicated Support", "500GB Storage", "Advanced API", "Custom Development", "SLA Guarantee"], "limits": {"api_calls": -1, "team_members": -1}}', true, false, 30),
('770e8400-e29b-41d4-a716-446655440004', 'Starter Annual', 'starter-annual', 'Annual billing for Starter plan with 20% discount and additional benefits.', 95.90, 'USD', 'yearly', '{"features": ["Basic Dashboard", "5 Projects", "Email Support", "1GB Storage", "Annual Discount"], "limits": {"api_calls": 1000, "team_members": 3}}', true, false, 14),
('770e8400-e29b-41d4-a716-446655440005', 'Professional Annual', 'professional-annual', 'Annual billing for Professional plan with 20% discount and bonus features.', 287.90, 'USD', 'yearly', '{"features": ["Advanced Dashboard", "Unlimited Projects", "Priority Support", "50GB Storage", "API Access", "Custom Integrations", "Annual Discount", "Bonus Features"], "limits": {"api_calls": 10000, "team_members": 15}}', true, false, 14),
('770e8400-e29b-41d4-a716-446655440006', 'Enterprise Annual', 'enterprise-annual', 'Annual billing for Enterprise plan with custom pricing and dedicated account management.', 959.90, 'USD', 'yearly', '{"features": ["Enterprise Dashboard", "Unlimited Everything", "24/7 Dedicated Support", "500GB Storage", "Advanced API", "Custom Development", "SLA Guarantee", "Account Manager"], "limits": {"api_calls": -1, "team_members": -1}}', true, false, 30);

-- Insert dummy subscriptions
INSERT INTO subscriptions (id, organization_id, plan_id, status, start_date, end_date, trial_end_date, canceled_at, current_period_start, current_period_end, auto_renew) VALUES
('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', 'active', NOW() - INTERVAL '45 days', NULL, NOW() - INTERVAL '31 days', NULL, NOW() - INTERVAL '15 days', NOW() + INTERVAL '15 days', true),
('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 'active', NOW() - INTERVAL '10 days', NULL, NULL, NULL, NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days', true),
('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440006', 'active', NOW() - INTERVAL '60 days', NULL, NULL, NULL, NOW() - INTERVAL '60 days', NOW() + INTERVAL '305 days', true),
('880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001', 'canceled', NOW() - INTERVAL '32 days', NOW() + INTERVAL '5 days', NOW() - INTERVAL '18 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '25 days', NOW() + INTERVAL '5 days', false),
('880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440005', 'active', NOW() - INTERVAL '104 days', NULL, NOW() - INTERVAL '90 days', NULL, NOW() - INTERVAL '90 days', NOW() + INTERVAL '275 days', true),
('880e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440002', 'expired', NOW() - INTERVAL '20 days', NOW() - INTERVAL '1 day', NULL, NULL, NOW() - INTERVAL '20 days', NOW() + INTERVAL '10 days', true),
('880e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440001', 'active', NOW() - INTERVAL '19 days', NULL, NOW() - INTERVAL '5 days', NULL, NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days', false);

-- Insert dummy invoices
INSERT INTO invoices (id, organization_id, subscription_id, invoice_number, status, subtotal, tax_amount, discount_amount, total, currency, issue_date, due_date, paid_at, notes) VALUES
('990e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'INV-2024-001', 'paid', 29.99, 2.62, 0.00, 32.61, 'USD', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '13 days', 'Monthly subscription payment'),
('990e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'INV-2024-002', 'sent', 29.99, 2.62, 0.00, 32.61, 'USD', NOW(), NOW() + INTERVAL '15 days', NULL, 'Monthly subscription payment'),
('990e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'INV-2024-003', 'paid', 9.99, 0.80, 0.00, 10.79, 'USD', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '8 days', 'Monthly subscription payment'),
('990e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'INV-2024-004', 'sent', 9.99, 0.80, 0.00, 10.79, 'USD', NOW(), NOW() + INTERVAL '20 days', NULL, 'Monthly subscription payment'),
('990e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', 'INV-2024-005', 'paid', 959.90, 60.00, 0.00, 1019.90, 'USD', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days', NOW() - INTERVAL '58 days', 'Annual enterprise subscription'),
('990e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440004', 'INV-2024-006', 'canceled', 9.99, 0.65, 0.00, 10.64, 'USD', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days', NULL, 'Canceled due to subscription termination'),
('990e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440005', 'INV-2024-007', 'paid', 287.90, 17.27, 0.00, 305.17, 'USD', NOW() - INTERVAL '90 days', NOW() - INTERVAL '90 days', NOW() - INTERVAL '88 days', 'Annual professional subscription'),
('990e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440006', 'INV-2024-008', 'overdue', 29.99, 1.87, 0.00, 31.86, 'USD', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days', NULL, 'Payment failed - insufficient funds'),
('990e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440007', '880e8400-e29b-41d4-a716-446655440007', 'INV-2024-009', 'paid', 9.99, 0.00, 0.00, 9.99, 'USD', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days', 'Non-profit organization subscription'),
('990e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440007', '880e8400-e29b-41d4-a716-446655440007', 'INV-2024-010', 'sent', 9.99, 0.00, 0.00, 9.99, 'USD', NOW(), NOW() + INTERVAL '25 days', NULL, 'Non-profit organization subscription');

-- Display summary of inserted data
SELECT 'Data insertion completed successfully!' as status;
SELECT 
    'users' as table_name, 
    COUNT(*) as records_inserted 
FROM users 
WHERE email LIKE '%@%'
UNION ALL
SELECT 
    'organizations' as table_name, 
    COUNT(*) as records_inserted 
FROM organizations 
WHERE slug IS NOT NULL
UNION ALL
SELECT 
    'plans' as table_name, 
    COUNT(*) as records_inserted 
FROM plans 
WHERE name IS NOT NULL
UNION ALL
SELECT 
    'subscriptions' as table_name, 
    COUNT(*) as records_inserted 
FROM subscriptions 
WHERE organization_id IS NOT NULL
UNION ALL
SELECT 
    'invoices' as table_name, 
    COUNT(*) as records_inserted 
FROM invoices 
WHERE invoice_number IS NOT NULL;