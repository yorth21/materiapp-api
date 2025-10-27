import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'vw_curriculum_progress' })
export class CurriculumProgressView {
  @ViewColumn({ name: 'curriculum_id' })
  curriculumId: number;

  @ViewColumn({ name: 'version' })
  version: string;

  @ViewColumn({ name: 'student_id' })
  studentId: string;

  @ViewColumn({ name: 'student_curriculum_id' })
  studentCurriculumId: number;

  @ViewColumn({ name: 'course_in_curriculum_id' })
  courseInCurriculumId: number;

  @ViewColumn({ name: 'semester' })
  semester: number;

  @ViewColumn({ name: 'credits' })
  credits: number;

  @ViewColumn({ name: 'calendar' })
  calendar: string | null;

  @ViewColumn({ name: 'course_code' })
  courseCode: string;

  @ViewColumn({ name: 'course_name' })
  courseName: string;

  @ViewColumn({ name: 'prerequisite_code' })
  prerequisiteCode: string | null;

  @ViewColumn({ name: 'prerequisite_name' })
  prerequisiteName: string | null;

  @ViewColumn({ name: 'approved' })
  approved: boolean;
}
