CREATE TRIGGER handle_updated_at BEFORE
UPDATE ON public.lessons FOR EACH ROW
EXECUTE FUNCTION moddatetime ('updated_at');