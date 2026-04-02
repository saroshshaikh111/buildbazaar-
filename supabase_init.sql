-- BuildBazaar: Primary Database Setup Script
-- Run this block in your Supabase SQL Editor to make the prototype data live!

-- 1. Create Sellers/Vendors Table (For future vendor dashboard)
CREATE TABLE IF NOT EXISTS sellers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name VARCHAR NOT NULL,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR PRIMARY KEY, 
    title VARCHAR NOT NULL,
    count VARCHAR NOT NULL
);

-- 3. Create Products Table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR PRIMARY KEY, 
    seller_id UUID REFERENCES sellers(id),
    title VARCHAR NOT NULL,
    brand VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    verified BOOLEAN DEFAULT true,
    tag VARCHAR,
    rating NUMERIC DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    "priceCurrent" NUMERIC NOT NULL,
    "priceOld" NUMERIC,
    discount VARCHAR,
    unit VARCHAR NOT NULL,
    description TEXT,
    images TEXT[],
    product_specs JSONB DEFAULT '{}'::jsonb,
    features TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- SEED DATA (To match current frontend mock)
-- ==========================================

INSERT INTO categories (id, title, count) VALUES
('c1', 'Cement', '120+ Products'),
('c2', 'Steel & TMT', '85+ Products'),
('c3', 'Bricks & Blocks', '45+ Products'),
('c4', 'Sand & Aggregates', '30+ Products'),
('c5', 'Paint & Finishes', '200+ Products'),
('c6', 'Plumbing', '150+ Products'),
('c7', 'Electricals', '300+ Products'),
('c8', 'Wood & Plywood', '60+ Products')
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, title, brand, category, verified, tag, rating, reviews, "priceCurrent", "priceOld", discount, unit, description, images, product_specs, features) VALUES
('p1', 'UltraTech Cement OPC 53', 'UltraTech', 'Cement', true, 'Best Seller', 4.6, 2340, 380, 420, '10% OFF', 'per bag (50kg)', 'Premium quality Ordinary Portland Cement (OPC) of 53 Grade. Ideal for high-strength concrete applications in residential and commercial buildings.', '{"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800"}', '{"grade": "53 Grade", "type": "OPC", "setting_time": "30-600 mins"}', '{"High compressive strength", "Fast setting", "Durable structures"}'),
('p2', 'Tata Tiscon TMT Bar Fe500D', 'Tata Steel', 'Steel & TMT', true, 'Top Rated', 4.8, 1890, 62500, 68000, '8% OFF', 'per tonne', 'India''s first Fe500D grade TMT rebar. Known for high ductility and superior earthquake resistance.', '{"https://images.unsplash.com/photo-1511210352317-00965d1d603a?q=80&w=800"}', '{"grade": "Fe500D", "material": "High-strength steel", "length": "12m standard"}', '{"Superior earthquake resistance", "Excellent bendability", "Corrosion resistant"}'),
('p3', 'First Class Red Bricks', 'Local Supplier', 'Bricks & Blocks', true, 'Bulk Deal', 4.3, 870, 8, 10, '20% OFF', 'per piece', 'Naturally burnt red clay bricks. High thermal insulation and durability for traditional masonry.', '{"https://images.unsplash.com/photo-1590069230005-db3937107792?q=80&w=800"}', '{"compressive_strength": "3.5 N/mm2", "water_absorption": "12-15%", "size": "9 x 4.5 x 3 inch"}', '{"Eco-friendly", "Thermal insulation", "Low maintenance"}'),
('p4', 'Finolex CPVC Pipes 1"', 'Finolex', 'Plumbing', true, null, 4.5, 560, 245, 280, '12% OFF', 'per 3m length', 'High-quality CPVC pipes for hot and cold water distribution. Lead-free and non-toxic.', '{"https://images.unsplash.com/photo-1542318712-9c4c47d7c17b?q=80&w=800"}', '{"material": "CPVC", "diameter": "1 inch", "standard": "ASTM D2846"}', '{"Corrosion resistant", "Easy installation", "Bacteriological resistance"}'),
('p5', 'Havells LifeLine Wire 1.5mm', 'Havells', 'Electricals', true, 'Popular', 4.7, 1230, 1450, 1650, '12% OFF', 'per 90m coil', 'Flame Retardant (FR) PVC insulated industrial cables. High insulation and safety for home wiring.', '{"https://images.unsplash.com/photo-1558486012-817176f84c6d?q=80&w=800"}', '{"gauge": "1.5 mm", "length": "90m", "voltage": "1100V"}', '{"Flame retardant", "99.9% pure copper", "High thermal stability"}'),
('p6', 'Asian Paints Ace Exterior', 'Asian Paints', 'Paint & Finishes', true, null, 4.4, 980, 2150, 2500, '14% OFF', 'per 20 L', 'Water-based exterior wall finish. Provides protection against UV-rays and moderate weather conditions.', '{"https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800"}', '{"type": "Emulsion", "finish": "Matt", "coverage": "50-60 sq.ft/L"}', '{"Weather resistant", "Anti-algal", "Easy application"}')
ON CONFLICT (id) DO UPDATE SET 
    description = EXCLUDED.description,
    images = EXCLUDED.images,
    product_specs = EXCLUDED.product_specs,
    features = EXCLUDED.features;

-- 4. Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    customer_name VARCHAR NOT NULL,
    shipping_address TEXT NOT NULL,
    total_amount NUMERIC NOT NULL,
    status VARCHAR DEFAULT 'Processing',
    payment_method VARCHAR DEFAULT 'Cash on Delivery',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Create Order Items Array (Junction)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR REFERENCES products(id),
    title VARCHAR NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC NOT NULL
);
