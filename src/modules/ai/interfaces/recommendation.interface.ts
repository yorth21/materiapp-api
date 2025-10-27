export interface CourseRecommendation {
  courseId: number;
  courseCode: string;
  courseName: string;
  semester: number;
  credits: number;
  calendar: string | null;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  canEnroll: boolean;
  missingPrerequisites?: string[];
}

export interface StudentAcademicProgress {
  studentId: string;
  currentSemester: number;
  totalCreditsCompleted: number;
  totalCreditsRequired: number;
  completedCourses: CompletedCourse[];
  currentCurriculum: CurriculumInfo;
}

export interface CompletedCourse {
  courseId: number;
  courseCode: string;
  courseName: string;
  semester: number;
  credits: number;
  completedAt: Date;
}

export interface CurriculumInfo {
  curriculumId: number;
  version: string;
  programName: string;
  totalSemesters: number;
  totalCredits: number;
}

export interface RecommendationRequest {
  currentSemester: string; // 'A' | 'B'
  maxCredits?: number;
  preferredSchedule?: 'morning' | 'afternoon' | 'evening' | 'any';
  includeElectives?: boolean;
}

export interface RecommendationResponse {
  recommendations: CourseRecommendation[];
  totalRecommendedCredits: number;
  academicProgress: {
    completionPercentage: number;
    semestersRemaining: number;
    onTrack: boolean;
  };
  analysis: string;
  warnings?: string[];
}
