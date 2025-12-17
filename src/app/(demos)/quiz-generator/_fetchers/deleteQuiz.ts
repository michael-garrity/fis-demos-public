/**
 * API function to delete an existing Quiz record by ID.
 * @param id The ID of the quiz to delete.
 */
export async function deleteQuiz (id: string) {
  const response = await fetch(`/api/quizzes/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete quiz (ID: ${id}): ${errorText}`);
  }

  return id;
};
