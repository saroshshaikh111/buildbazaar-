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
('p1', 'UltraTech Cement OPC 53', 'UltraTech', 'Cement', true, 'Best Seller', 4.8, 2340, 450, 480, '6% OFF', 'per bag (50kg)', 'Premium quality Ordinary Portland Cement (OPC) of 53 Grade. Ideal for high-strength concrete applications in residential and commercial buildings. Manufactured using high-quality raw materials for superior durability.', 
'{"https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1590060417673-42846eaae8ee?auto=format&fit=crop&q=80&w=800"}', 
'{"grade": "53 Grade", "type": "OPC", "setting_time_initial": "30 mins", "setting_time_final": "600 mins", "compressive_strength_28d": "53 MPa", "standard": "IS 12269"}', 
'{"High compressive strength", "Fast setting", "Durable structures", "Low heat of hydration"}'),

('p2', 'Tata Tiscon TMT Bars 12mm', 'Tata Steel', 'Steel & TMT', true, 'Top Rated', 4.9, 1120, 65500, 68000, '4% OFF', 'per tonne', 'High-ductility TMT rebars with superior earthquake resistance and bonding strength. Produced using Virgin Steel through the primary route for maximum purity.', 
'{"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1533044113278-df0962ae3496?auto=format&fit=crop&q=80&w=800"}', 
'{"grade": "Fe 550D", "diameter": "12mm", "length": "12m", "standard": "IS 1786", "elongation": "16% min", "weldability": "Superior"}', 
'{"Superior earthquake resistance", "Excellent bendability", "Corrosion resistant", "Consistent rib pattern"}'),

('p3', 'First Class Red Bricks', 'Local Supplier', 'Bricks & Blocks', true, 'Bulk Deal', 4.3, 870, 8, 10, '20% OFF', 'per piece', 'Naturally burnt red clay bricks. High thermal insulation and durability for traditional masonry. Traditional frog-indent for better mortar bonding.', 
'{"https://images.unsplash.com/photo-1582266255745-9e3f9b42360c?q=80&w=800", "https://images.unsplash.com/photo-1590069230005-db3937107792?q=80&w=800"}', 
'{"compressive_strength": "10.0 N/mm2", "water_absorption": "< 15%", "size": "9 x 4.5 x 3 inch", "type": "First Class"}', 
'{"Eco-friendly", "Thermal insulation", "Low maintenance", "Uniform color and shape"}'),

('p4', 'Finolex CPVC Pipes 1"', 'Finolex', 'Plumbing', true, null, 4.5, 560, 245, 280, '12% OFF', 'per 3m length', 'High-quality CPVC pipes for hot and cold water distribution. Lead-free and non-toxic. ASTM D2846 compliant for plumbing systems.', 
'{"https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800", "https://images.unsplash.com/photo-1542318712-9c4c47d7c17b?q=80&w=800"}', 
'{"material": "CPVC", "diameter": "1 inch", "standard": "ASTM D2846", "temp_rating": "Up to 93°C", "pressure_rating": "SDR 11"}', 
'{"Corrosion resistant", "Easy installation", "Bacteriological resistance", "High heat stability"}'),

('p5', 'Havells LifeLine Wire 1.5mm', 'Havells', 'Electricals', true, 'Popular', 4.7, 1230, 1450, 1650, '12% OFF', 'per 90m coil', 'Flame Retardant (FR) PVC insulated industrial cables. High insulation and safety for home wiring. Oxygen-free copper for high conductivity.', 
'{"https://images.unsplash.com/photo-1558486012-817176f84c6d?q=80&w=800", "https://images.unsplash.com/photo-1621905235858-529a605bdc6d?q=80&w=800"}', 
'{"gauge": "1.5 mm", "length": "90m", "voltage": "1100V", "conductor": "Pure Copper", "insulation": "FR PVC"}', 
'{"Flame retardant", "99.9% pure copper", "High thermal stability", "High insulation resistance"}'),

('p6', 'Asian Paints Ace Exterior', 'Asian Paints', 'Paint & Finishes', true, null, 4.4, 980, 2150, 2500, '14% OFF', 'per 20 L', 'Water-based exterior wall finish. Provides protection against UV-rays and moderate weather conditions. Anti-algal and weather-resistant properties.', 
'{"https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=800", "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800"}', 
'{"type": "Emulsion", "finish": "Matt", "coverage": "50-60 sq.ft/L", "dilution": "40% with water"}', 
'{"Weather resistant", "Anti-algal", "Easy application", "Fast drying"}')
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
    pincode VARCHAR(6),
    project_name VARCHAR, -- For site tagging
    gstin VARCHAR(15),     -- For B2B invoicing
    total_amount NUMERIC NOT NULL,
    delivery_date DATE,
    delivery_slot VARCHAR, -- e.g., 'Morning (8AM-12PM)'
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
