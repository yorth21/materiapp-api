import { Course } from '../../../../entities/course.entity';

export interface CurriculumCourseInfo {
  id: string; // course code
  cr: number; // credits
  sem: number; // semester
  cal: string; // calendar
  pre: string | null; // prerequisite course code
}

export interface CompletedCourseInfo {
  id: string; // course code
}

export interface RecommendationParameters {
  term: 'A' | 'B';
  currentSemester: number;
  maxCourses: number;
  minCourses: number;
}

export interface CourseRecommendationRequest {
  params: RecommendationParameters;
  pensum: CurriculumCourseInfo[];
  approvedCourses: string[];
}

export interface CourseRecommendationResponse {
  recommended: string[];
  why: string;
}

export interface GeneratedRecommendation {
  courses: Course[];
  rationale: string;
}
