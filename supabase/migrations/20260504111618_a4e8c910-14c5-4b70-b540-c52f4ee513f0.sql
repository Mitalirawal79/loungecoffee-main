
-- Products: add category, stock, sku
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'bestseller',
  ADD COLUMN IF NOT EXISTS stock integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sku text;

CREATE UNIQUE INDEX IF NOT EXISTS products_sku_unique ON public.products(sku);

-- Order items: store SKU snapshot
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS product_sku text;

-- SKU prefix helper
CREATE OR REPLACE FUNCTION public.sku_prefix_for_category(_category text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT CASE lower(coalesce(_category, ''))
    WHEN 'drinks' THEN 'DR'
    WHEN 'espresso' THEN 'ES'
    WHEN 'merchandise' THEN 'MR'
    WHEN 'merch' THEN 'MR'
    WHEN 'home' THEN 'HM'
    WHEN 'bestseller' THEN 'BS'
    ELSE upper(substr(regexp_replace(coalesce(_category, 'gn'), '[^a-zA-Z]', '', 'g') || 'GN', 1, 2))
  END;
$$;

-- Auto-generate SKU on insert / when category changes
CREATE OR REPLACE FUNCTION public.assign_product_sku()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  prefix text;
  next_num int;
  candidate text;
BEGIN
  IF NEW.sku IS NULL OR NEW.sku = '' OR (TG_OP = 'UPDATE' AND NEW.category IS DISTINCT FROM OLD.category AND (NEW.sku IS NULL OR split_part(NEW.sku, '-', 1) <> public.sku_prefix_for_category(NEW.category))) THEN
    prefix := public.sku_prefix_for_category(NEW.category);
    SELECT COALESCE(MAX( NULLIF(regexp_replace(split_part(sku, '-', 2), '[^0-9]', '', 'g'), '')::int ), 0) + 1
      INTO next_num
      FROM public.products
      WHERE sku LIKE prefix || '-%';
    LOOP
      candidate := prefix || '-' || lpad(next_num::text, 3, '0');
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.products WHERE sku = candidate);
      next_num := next_num + 1;
    END LOOP;
    NEW.sku := candidate;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_assign_product_sku ON public.products;
CREATE TRIGGER trg_assign_product_sku
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.assign_product_sku();

-- Backfill SKUs for existing products
UPDATE public.products SET sku = NULL WHERE sku IS NULL;
-- Trigger fires on update; nudge each row so SKUs get assigned
UPDATE public.products SET category = category WHERE sku IS NULL;

-- Allow extra order statuses: processing
DO $$ BEGIN
  ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'processing';
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
