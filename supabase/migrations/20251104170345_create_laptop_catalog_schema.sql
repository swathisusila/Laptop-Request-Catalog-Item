/*
  # Laptop Request Catalog Schema

  1. New Tables
    - `laptop_models`
      - `id` (uuid, primary key) - Unique identifier for each laptop model
      - `name` (text) - Name of the laptop model
      - `brand` (text) - Manufacturer brand
      - `processor` (text) - CPU specifications
      - `ram` (text) - RAM specifications
      - `storage` (text) - Storage specifications
      - `screen_size` (text) - Display size
      - `image_url` (text) - Product image URL
      - `price` (numeric) - Price in USD
      - `available` (boolean) - Availability status
      - `created_at` (timestamptz) - Record creation timestamp
    
    - `laptop_requests`
      - `id` (uuid, primary key) - Unique identifier for each request
      - `laptop_model_id` (uuid, foreign key) - Reference to laptop_models
      - `requester_name` (text) - Name of the person requesting
      - `requester_email` (text) - Email of the requester
      - `business_justification` (text) - Reason for the request
      - `status` (text) - Request status (pending, approved, rejected)
      - `created_at` (timestamptz) - Request submission timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on both tables
    - Public read access for laptop_models (catalog viewing)
    - Public insert access for laptop_requests (submitting requests)
    - Public read access for laptop_requests (viewing own requests)

  3. Initial Data
    - Seed sample laptop models for the catalog
*/

CREATE TABLE IF NOT EXISTS laptop_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL,
  processor text NOT NULL,
  ram text NOT NULL,
  storage text NOT NULL,
  screen_size text NOT NULL,
  image_url text DEFAULT '',
  price numeric NOT NULL,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS laptop_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  laptop_model_id uuid NOT NULL REFERENCES laptop_models(id) ON DELETE CASCADE,
  requester_name text NOT NULL,
  requester_email text NOT NULL,
  business_justification text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE laptop_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE laptop_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view laptop models"
  ON laptop_models FOR SELECT
  USING (true);

CREATE POLICY "Anyone can submit laptop requests"
  ON laptop_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view laptop requests"
  ON laptop_requests FOR SELECT
  USING (true);

INSERT INTO laptop_models (name, brand, processor, ram, storage, screen_size, image_url, price, available) VALUES
  ('MacBook Pro 14"', 'Apple', 'M3 Pro', '18GB', '512GB SSD', '14.2"', 'https://images.pexels.com/photos/18105/pexels-photo.jpg', 2499.00, true),
  ('ThinkPad X1 Carbon', 'Lenovo', 'Intel i7-1365U', '16GB', '512GB SSD', '14"', 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg', 1899.00, true),
  ('Dell XPS 15', 'Dell', 'Intel i9-13900H', '32GB', '1TB SSD', '15.6"', 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg', 2299.00, true),
  ('MacBook Air M2', 'Apple', 'M2', '16GB', '512GB SSD', '13.6"', 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg', 1499.00, true),
  ('HP Spectre x360', 'HP', 'Intel i7-1355U', '16GB', '512GB SSD', '13.5"', 'https://images.pexels.com/photos/7974/pexels-photo.jpg', 1699.00, true),
  ('Surface Laptop 5', 'Microsoft', 'Intel i7-1255U', '16GB', '512GB SSD', '15"', 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg', 1799.00, true)
ON CONFLICT DO NOTHING;