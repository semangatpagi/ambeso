-- Add product_type column to products table
ALTER TABLE public.products 
ADD COLUMN product_type text NOT NULL DEFAULT 'roasted_coffee';

-- Add is_coffee column to distinguish coffee vs non-coffee products
ALTER TABLE public.products 
ADD COLUMN is_coffee boolean NOT NULL DEFAULT true;

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Storage policies for product images
CREATE POLICY "Product images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Create tracking_codes table for analytics management
CREATE TABLE public.tracking_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  code_type text NOT NULL, -- 'google_analytics', 'fb_pixel', 'tiktok_pixel', 'google_tag'
  code_id text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on tracking_codes
ALTER TABLE public.tracking_codes ENABLE ROW LEVEL SECURITY;

-- RLS policies for tracking_codes
CREATE POLICY "Tracking codes are viewable by everyone"
ON public.tracking_codes FOR SELECT
USING (true);

CREATE POLICY "Admins can insert tracking codes"
ON public.tracking_codes FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update tracking codes"
ON public.tracking_codes FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete tracking codes"
ON public.tracking_codes FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_tracking_codes_updated_at
BEFORE UPDATE ON public.tracking_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();