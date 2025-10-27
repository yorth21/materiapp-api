import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVwCurriculumProgress1761540382698
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE VIEW vw_curriculum_progress AS
      SELECT
        cic.curriculum_id,
        cla.version,
        scla.student_id,
        scla.id AS student_curriculum_id,
        cic.id AS course_in_curriculum_id,
        cic.semester,
        cic.credits,
        cic.calendar,
        c.code AS course_code,
        c.name AS course_name,
        pr.code AS prerequisite_code,
        pr.name AS prerequisite_name,
        (scse.course_in_curriculum_id IS NOT NULL) AS approved
      FROM courses_in_curriculum cic
      JOIN curricula cla
        ON cla.id = cic.curriculum_id
      JOIN courses c
        ON c.id = cic.course_id
      LEFT JOIN courses pr
        ON pr.id = cic.prerequisite_id
      LEFT JOIN student_curricula scla
        ON scla.curriculum_id = cic.curriculum_id
      LEFT JOIN student_courses scse
        ON scse.course_in_curriculum_id = cic.id
       AND scse.student_curriculum_id = scla.id;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP VIEW IF EXISTS vw_curriculum_progress;
    `);
  }
}
