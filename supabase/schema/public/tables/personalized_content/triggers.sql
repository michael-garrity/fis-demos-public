CREATE TRIGGER handle_updated_at BEFORE
UPDATE ON public.personalized_content FOR EACH ROW
EXECUTE FUNCTION moddatetime ('updated_at');