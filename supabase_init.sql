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

INSERT INTO products (id, title, brand, category, verified, tag, rating, reviews, "priceCurrent", "priceOld", discount, unit) VALUES
('p1', 'UltraTech Cement OPC 53', 'UltraTech', 'Cement', true, 'Best Seller', 4.6, 2340, 380, 420, '10% OFF', 'per bag (50kg)'),
('p2', 'Tata Tiscon TMT Bar Fe500D', 'Tata Steel', 'Steel & TMT', true, 'Top Rated', 4.8, 1890, 62500, 68000, '8% OFF', 'per tonne'),
('p3', 'First Class Red Bricks', 'Local Supplier', 'Bricks & Blocks', true, 'Bulk Deal', 4.3, 870, 8, 10, '20% OFF', 'per piece'),
('p4', 'Finolex CPVC Pipes 1"', 'Finolex', 'Plumbing', true, null, 4.5, 560, 245, 280, '12% OFF', 'per 3m length'),
('p5', 'Havells LifeLine Wire 1.5mm', 'Havells', 'Electricals', true, 'Popular', 4.7, 1230, 1450, 1650, '12% OFF', 'per 90m coil'),
('p6', 'Asian Paints Ace Exterior', 'Asian Paints', 'Paint & Finishes', true, null, 4.4, 980, 2150, 2500, '14% OFF', 'per 20 L')
ON CONFLICT (id) DO NOTHING;

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
