CREATE TRIGGER handle_updated_at BEFORE
UPDATE ON public.quizzes FOR EACH ROW
EXECUTE FUNCTION moddatetime ('updated_at');