ALTER TABLE public.inquiries
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS admin_notes text NOT NULL DEFAULT '';

ALTER TABLE public.inquiries
  ADD CONSTRAINT inquiries_status_valid CHECK (status IN ('new', 'in_review', 'quoted', 'completed', 'archived'));

GRANT SELECT, UPDATE, DELETE ON public.inquiries TO authenticated;

CREATE POLICY "Admins view inquiries"
ON public.inquiries FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins update inquiries"
ON public.inquiries FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins delete inquiries"
ON public.inquiries FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS homepage_wallpapers text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS theme jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS icons jsonb NOT NULL DEFAULT '{}'::jsonb;