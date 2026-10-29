import type {
  InterviewFeedbackCategory,
  InterviewerCompetencyRating,
} from "@/features/admin/TalentHub/types/recruitment.types";

export type {
  InterviewFeedbackCategory,
  InterviewerCompetencyRating,
  InterviewerFeedbackWorklistItem,
} from "@/features/admin/TalentHub/types/recruitment.types";

export type InterviewerFeedbackValidationInput = {
  canSubmit: boolean;
  categories: InterviewFeedbackCategory[];
  ratings: Record<number, InterviewerCompetencyRating>;
  overallFeedback: string;
};
