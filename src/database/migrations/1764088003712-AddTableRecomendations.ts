import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableRecomendations1764088003712 implements MigrationInterface {
    name = 'AddTableRecomendations1764088003712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "student_curriculum_recommendations" ("id" SERIAL NOT NULL, "student_curriculum_id" integer NOT NULL, "payload" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1b969eae20e466ddf21ca476f0f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "student_curriculum_recommendations" ADD CONSTRAINT "FK_d5783259f593648c37e99a92bde" FOREIGN KEY ("student_curriculum_id") REFERENCES "student_curricula"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_curriculum_recommendations" DROP CONSTRAINT "FK_d5783259f593648c37e99a92bde"`);
        await queryRunner.query(`DROP TABLE "student_curriculum_recommendations"`);
    }

}
