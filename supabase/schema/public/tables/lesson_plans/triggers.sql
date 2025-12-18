CREATE TRIGGER handle_updated_at BEFORE
UPDATE ON public.lesson_plans FOR EACH ROW
EXECUTE FUNCTION moddatetime ('updated_at');