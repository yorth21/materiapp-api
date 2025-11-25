import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1764032960324 implements MigrationInterface {
    name = 'Init1764032960324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "campuses" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "city" character varying(100) NOT NULL, "address" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_d6a06870edd505bfc2d002cb728" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "schools" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "code" character varying(50) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "campus_id" integer NOT NULL, CONSTRAINT "UQ_35e8277da52a915513e3ece8cf9" UNIQUE ("code"), CONSTRAINT "PK_95b932e47ac129dd8e23a0db548" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "programs" ("id" SERIAL NOT NULL, "code" character varying(50) NOT NULL, "name" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "school_id" integer NOT NULL, CONSTRAINT "UQ_11924ca2e0cb47a8d9400bada03" UNIQUE ("code"), CONSTRAINT "PK_d43c664bcaafc0e8a06dfd34e05" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "courses" ("id" SERIAL NOT NULL, "code" character varying(20) NOT NULL, "name" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_86b3589486bac01d2903e22471c" UNIQUE ("code"), CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "student_courses" ("student_curriculum_id" integer NOT NULL, "course_in_curriculum_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fe1c4cccc046daf0f000916453d" PRIMARY KEY ("student_curriculum_id", "course_in_curriculum_id"))`);
        await queryRunner.query(`CREATE TABLE "courses_in_curriculum" ("id" SERIAL NOT NULL, "semester" integer NOT NULL, "calendar" character(2) NOT NULL, "type" character(1) NOT NULL, "credits" integer NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "curriculum_id" integer NOT NULL, "course_id" integer NOT NULL, "prerequisite_id" integer, CONSTRAINT "PK_da51d767e795c627a41a0b4c27f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "curricula" ("id" SERIAL NOT NULL, "version" character varying(20) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL, "program_id" integer NOT NULL, CONSTRAINT "PK_7c5dd2066e2bbf3b6ad0a71c567" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "student_curricula" ("id" SERIAL NOT NULL, "semester" integer NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "user_id" uuid NOT NULL, "curriculum_id" integer NOT NULL, CONSTRAINT "PK_192dde3473dbf6ea6bb12d8719e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "keycloak_id" uuid NOT NULL, "email" character varying(255) NOT NULL, "username" character varying(255) NOT NULL, "first_name" character varying(100), "last_name" character varying(100), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97b5061278a40c1dead71c1b889" UNIQUE ("keycloak_id"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "schools" ADD CONSTRAINT "FK_4f036564a21641e3806c941b55f" FOREIGN KEY ("campus_id") REFERENCES "campuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "programs" ADD CONSTRAINT "FK_d7a5344bdbf4566726fdc7c0a27" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_courses" ADD CONSTRAINT "FK_ec2617a631c36b4caf4173859d6" FOREIGN KEY ("student_curriculum_id") REFERENCES "student_curricula"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_courses" ADD CONSTRAINT "FK_e4a486f4220ddf67c7bb4627ed9" FOREIGN KEY ("course_in_curriculum_id") REFERENCES "courses_in_curriculum"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "courses_in_curriculum" ADD CONSTRAINT "FK_94331f70a9c64f032867be42804" FOREIGN KEY ("curriculum_id") REFERENCES "curricula"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "courses_in_curriculum" ADD CONSTRAINT "FK_b392036ff337a91465dfe6cefbe" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "courses_in_curriculum" ADD CONSTRAINT "FK_d6cf9e92eb60370adfbd48e981b" FOREIGN KEY ("prerequisite_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "curricula" ADD CONSTRAINT "FK_6186c47ace232293268fb7ba2c3" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_curricula" ADD CONSTRAINT "FK_7d819feb94c94276e1244daf69d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_curricula" ADD CONSTRAINT "FK_b799bdb82cc2606390a5ef3e0b6" FOREIGN KEY ("curriculum_id") REFERENCES "curricula"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_curricula" DROP CONSTRAINT "FK_b799bdb82cc2606390a5ef3e0b6"`);
        await queryRunner.query(`ALTER TABLE "student_curricula" DROP CONSTRAINT "FK_7d819feb94c94276e1244daf69d"`);
        await queryRunner.query(`ALTER TABLE "curricula" DROP CONSTRAINT "FK_6186c47ace232293268fb7ba2c3"`);
        await queryRunner.query(`ALTER TABLE "courses_in_curriculum" DROP CONSTRAINT "FK_d6cf9e92eb60370adfbd48e981b"`);
        await queryRunner.query(`ALTER TABLE "courses_in_curriculum" DROP CONSTRAINT "FK_b392036ff337a91465dfe6cefbe"`);
        await queryRunner.query(`ALTER TABLE "courses_in_curriculum" DROP CONSTRAINT "FK_94331f70a9c64f032867be42804"`);
        await queryRunner.query(`ALTER TABLE "student_courses" DROP CONSTRAINT "FK_e4a486f4220ddf67c7bb4627ed9"`);
        await queryRunner.query(`ALTER TABLE "student_courses" DROP CONSTRAINT "FK_ec2617a631c36b4caf4173859d6"`);
        await queryRunner.query(`ALTER TABLE "programs" DROP CONSTRAINT "FK_d7a5344bdbf4566726fdc7c0a27"`);
        await queryRunner.query(`ALTER TABLE "schools" DROP CONSTRAINT "FK_4f036564a21641e3806c941b55f"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "student_curricula"`);
        await queryRunner.query(`DROP TABLE "curricula"`);
        await queryRunner.query(`DROP TABLE "courses_in_curriculum"`);
        await queryRunner.query(`DROP TABLE "student_courses"`);
        await queryRunner.query(`DROP TABLE "courses"`);
        await queryRunner.query(`DROP TABLE "programs"`);
        await queryRunner.query(`DROP TABLE "schools"`);
        await queryRunner.query(`DROP TABLE "campuses"`);
    }

}
