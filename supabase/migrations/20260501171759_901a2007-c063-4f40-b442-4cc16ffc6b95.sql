-- Replace broad SELECT on avatars with a more restricted policy
DROP POLICY IF EXISTS "Avatars public read" ON storage.objects;

-- Allow viewing only when the file path is fully known (no listing)
-- Public URLs still work because they go through the storage CDN, which uses service role.
CREATE POLICY "Avatars readable by owner"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );