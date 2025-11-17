-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  origin TEXT NOT NULL,
  roast_level TEXT NOT NULL CHECK (roast_level IN ('light', 'medium', 'dark')),
  grind_type TEXT NOT NULL CHECK (grind_type IN ('whole-bean', 'ground', 'drip-bag')),
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  weight_g INTEGER NOT NULL DEFAULT 250,
  tasting_notes TEXT[],
  in_stock BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public read access for products (no auth required for browsing)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Create index for better query performance
CREATE INDEX idx_products_origin ON public.products(origin);
CREATE INDEX idx_products_roast ON public.products(roast_level);
CREATE INDEX idx_products_grind ON public.products(grind_type);
CREATE INDEX idx_products_featured ON public.products(featured) WHERE featured = true;

-- Insert sample products
INSERT INTO public.products (name, slug, description, origin, roast_level, grind_type, price, weight_g, tasting_notes, featured) VALUES
('Toraja Heritage', 'toraja-heritage', 'Premium single-origin coffee from the highlands of Toraja, known for its full body and earthy notes with hints of dark chocolate.', 'Toraja', 'dark', 'whole-bean', 185000, 250, ARRAY['dark chocolate', 'earthy', 'full body'], true),
('Gayo Mountain Gold', 'gayo-mountain-gold', 'Smooth medium roast from Aceh''s Gayo highlands, featuring bright citrus notes and a clean finish.', 'Gayo', 'medium', 'whole-bean', 165000, 250, ARRAY['citrus', 'bright', 'clean'], true),
('Mandheling Classic', 'mandheling-classic', 'Bold and complex coffee from North Sumatra with low acidity and syrupy body.', 'Mandheling', 'dark', 'ground', 175000, 250, ARRAY['low acidity', 'syrupy', 'spice'], true),
('Toraja Light Roast', 'toraja-light-roast', 'Delicate light roast showcasing the natural sweetness and floral notes of Toraja beans.', 'Toraja', 'light', 'whole-bean', 180000, 250, ARRAY['floral', 'sweet', 'fruity'], false),
('Gayo Ground', 'gayo-ground', 'Pre-ground Gayo coffee perfect for drip brewing. Medium roast with balanced flavor.', 'Gayo', 'medium', 'ground', 160000, 250, ARRAY['balanced', 'smooth', 'nutty'], false),
('DRIPEN Signature Pack', 'dripen-signature-pack', 'Portable drip bag coffee pack. Perfect for travel or office. Medium roast blend.', 'Sulawesi Blend', 'medium', 'drip-bag', 125000, 200, ARRAY['convenient', 'balanced', 'smooth'], true),
('DRIPEN Dark Roast', 'dripen-dark-roast', 'Bold portable drip bag with intense flavor. Perfect for those who love strong coffee.', 'Toraja', 'dark', 'drip-bag', 130000, 200, ARRAY['bold', 'intense', 'rich'], false),
('Sulawesi Sampler', 'sulawesi-sampler', 'Try all three roast levels with our sampler pack. 3x100g from different origins.', 'Mixed Origins', 'medium', 'whole-bean', 195000, 300, ARRAY['variety', 'discovery', 'sampler'], false);