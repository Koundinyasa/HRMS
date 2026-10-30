import type { InterviewerFeedbackValidationInput } from "../types/recruitment.types";

export function validateInterviewerFeedback({
  canSubmit,
  categories,
  ratings,
  overallFeedback,
}: InterviewerFeedbackValidationInput): string | null {
  if (!canSubmit) {
    return "Feedback cannot be submitted for this interview.";
  }
  if (
    categories.length === 0 ||
    categories.some((category) => !ratings[category.categoryId])
  ) {
    return "Rate every feedback category before submitting.";
  }
  if (!overallFeedback.trim()) {
    return "Overall feedback is required.";
  }
  return null;
}
