-- =====================================================
-- NISSAN FLEET CATALOG DATABASE SCHEMA
-- =====================================================

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- =====================================================
-- BASE TABLES AND LOOKUPS
-- =====================================================

-- Makes table
CREATE TABLE IF NOT EXISTS makes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    logo_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Models table
CREATE TABLE IF NOT EXISTS models (
    id SERIAL PRIMARY KEY,
    make_id INTEGER NOT NULL REFERENCES makes(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(make_id, name)
);

-- Model years table
CREATE TABLE IF NOT EXISTS model_years (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL UNIQUE CHECK (year >= 1900 AND year <= 2100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trims table
CREATE TABLE IF NOT EXISTS trims (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Body types table
CREATE TABLE IF NOT EXISTS body_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drive types table
CREATE TABLE IF NOT EXISTS drive_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- VEHICLE TABLES
-- =====================================================

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    body_model_code_id INTEGER,
    model_year_id INTEGER NOT NULL REFERENCES model_years(id),
    make_id INTEGER NOT NULL REFERENCES makes(id),
    model_id INTEGER NOT NULL REFERENCES models(id),
    trim_id INTEGER NOT NULL REFERENCES trims(id),
    body_type_id INTEGER NOT NULL REFERENCES body_types(id),
    drive_type_id INTEGER NOT NULL REFERENCES drive_types(id),
    primary_identification_id INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicle identifications table
CREATE TABLE IF NOT EXISTS vehicle_identifications (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    value VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    issued_by VARCHAR(100),
    issued_date DATE,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicle pricing table
CREATE TABLE IF NOT EXISTS vehicle_pricing (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    intro_msrp DECIMAL(10,2) NOT NULL,
    factory_dealer_invoice DECIMAL(10,2) NOT NULL,
    dealer_net DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_vehicles_model_year_id ON vehicles(model_year_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_make_id ON vehicles(make_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_model_id ON vehicles(model_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_trim_id ON vehicles(trim_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_body_type_id ON vehicles(body_type_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_drive_type_id ON vehicles(drive_type_id);

CREATE INDEX IF NOT EXISTS idx_vehicle_identifications_vehicle_id ON vehicle_identifications(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_identifications_type ON vehicle_identifications(type);
CREATE INDEX IF NOT EXISTS idx_vehicle_identifications_is_primary ON vehicle_identifications(is_primary);

CREATE INDEX IF NOT EXISTS idx_vehicle_pricing_vehicle_id ON vehicle_pricing(vehicle_id);

CREATE INDEX IF NOT EXISTS idx_models_make_id ON models(make_id);
CREATE INDEX IF NOT EXISTS idx_model_years_year ON model_years(year);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE makes ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE trims ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE drive_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_identifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_pricing ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access" ON makes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON models FOR SELECT USING (true);
CREATE POLICY "Public read access" ON model_years FOR SELECT USING (true);
CREATE POLICY "Public read access" ON trims FOR SELECT USING (true);
CREATE POLICY "Public read access" ON body_types FOR SELECT USING (true);
CREATE POLICY "Public read access" ON drive_types FOR SELECT USING (true);
CREATE POLICY "Public read access" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON vehicle_identifications FOR SELECT USING (true);
CREATE POLICY "Public read access" ON vehicle_pricing FOR SELECT USING (true);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE makes IS 'Vehicle manufacturers';
COMMENT ON TABLE models IS 'Vehicle models by manufacturer';
COMMENT ON TABLE model_years IS 'Model years available';
COMMENT ON TABLE trims IS 'Vehicle trim levels';
COMMENT ON TABLE body_types IS 'Vehicle body types (Sedan, SUV, etc.)';
COMMENT ON TABLE drive_types IS 'Vehicle drive types (FWD, AWD, etc.)';
COMMENT ON TABLE vehicles IS 'Main vehicle records';
COMMENT ON TABLE vehicle_identifications IS 'Vehicle identification numbers (VIN, etc.)';
COMMENT ON TABLE vehicle_pricing IS 'Vehicle pricing information';

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample makes
INSERT INTO makes (name, logo_url) VALUES 
('Nissan', 'https://example.com/nissan-logo.png')
ON CONFLICT (name) DO NOTHING;

-- Insert sample model years
INSERT INTO model_years (year) VALUES 
(2025), (2024), (2023)
ON CONFLICT (year) DO NOTHING;

-- Insert sample body types
INSERT INTO body_types (name) VALUES 
('Sedan'), ('SUV'), ('Truck'), ('Hatchback')
ON CONFLICT (name) DO NOTHING;

-- Insert sample drive types
INSERT INTO drive_types (name) VALUES 
('FWD'), ('AWD'), ('RWD'), ('4WD')
ON CONFLICT (name) DO NOTHING;

-- Insert sample models
INSERT INTO models (make_id, name) VALUES 
(1, 'Altima'), (1, 'Rogue'), (1, 'Sentra'), (1, 'Maxima'), (1, 'Murano')
ON CONFLICT (make_id, name) DO NOTHING;

-- Insert sample trims
INSERT INTO trims (name) VALUES 
('S'), ('SR'), ('SL'), ('Platinum'), ('SV')
ON CONFLICT (name) DO NOTHING; 