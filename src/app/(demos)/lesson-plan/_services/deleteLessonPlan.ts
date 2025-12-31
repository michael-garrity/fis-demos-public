/**
 * API function to delete an existing Lesson Plan record by ID.
 * @param id The ID of the course outline to delete.
 */
export const deleteLessonPlan = async (id: string): Promise<string> => {
  const response = await fetch(`/api/lesson-plan/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete course (ID: ${id}): ${errorText}`);
  }

  return id;
};
