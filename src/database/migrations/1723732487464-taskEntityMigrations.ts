import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskEntityMigrations1723732487464 implements MigrationInterface {
  name = 'TaskEntityMigrations1723732487464';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tasks" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying(300), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" character varying(300), "title" character varying NOT NULL, "detail" character varying, "due_date" date NOT NULL DEFAULT now(), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tasks"`);
  }
}
