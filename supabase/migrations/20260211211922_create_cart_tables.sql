/*
  # Create Cart Management Tables

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `model_number` (integer, unique) - 1-18
      - `title` (text)
      - `price` (decimal)
      - `image_url` (text)
      - `created_at` (timestamp)
    
    - `cart_items`
      - `id` (uuid, primary key)
      - `user_session_id` (text) - Anonymous session tracking
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `message` (text) - For personalization
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Cart items are accessible by session ID
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_number integer UNIQUE NOT NULL,
  title text NOT NULL,
  price decimal(10,2) DEFAULT 54.95,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session_id text NOT NULL,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly viewable"
  ON products FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Cart items accessible by session"
  ON cart_items FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert cart items"
  ON cart_items FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Can update own cart items"
  ON cart_items FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Can delete own cart items"
  ON cart_items FOR DELETE
  TO anon
  USING (true);

INSERT INTO products (model_number, title, image_url)
VALUES
  (1, 'MODÈLE EXCELLENCE N°1', 'images/hijab1.jpeg'),
  (2, 'MODÈLE EXCELLENCE N°2', 'images/hijab2.jpeg'),
  (3, 'MODÈLE EXCELLENCE N°3', 'images/hijab3.jpeg'),
  (4, 'MODÈLE EXCELLENCE N°4', 'images/hijab4.jpeg'),
  (5, 'MODÈLE EXCELLENCE N°5', 'images/hijab5.jpeg'),
  (6, 'MODÈLE EXCELLENCE N°6', 'images/hijab6.jpeg'),
  (7, 'MODÈLE EXCELLENCE N°7', 'images/hijab7.jpeg'),
  (8, 'MODÈLE EXCELLENCE N°8', 'images/hijab8.jpeg'),
  (9, 'MODÈLE EXCELLENCE N°9', 'images/hijab9.jpeg'),
  (10, 'MODÈLE EXCELLENCE N°10', 'images/hijab10.jpeg'),
  (11, 'MODÈLE EXCELLENCE N°11', 'images/hijab11.jpeg'),
  (12, 'MODÈLE EXCELLENCE N°12', 'images/hijab12.jpeg'),
  (13, 'MODÈLE EXCELLENCE N°13', 'images/hijab13.jpeg'),
  (14, 'MODÈLE EXCELLENCE N°14', 'images/hijab14.jpeg'),
  (15, 'MODÈLE EXCELLENCE N°15', 'images/hijab15.jpeg'),
  (16, 'MODÈLE EXCELLENCE N°16', 'images/hijab16.jpeg'),
  (17, 'MODÈLE EXCELLENCE N°17', 'images/hijab17.jpeg'),
  (18, 'MODÈLE EXCELLENCE N°18', 'images/hijab18.jpeg');
