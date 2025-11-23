import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCourseType1763919500485 implements MigrationInterface {
    name = 'AddCourseType1763919500485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses_in_curriculum" ADD "type" character(1)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses_in_curriculum" DROP COLUMN "type"`);
    }

}
