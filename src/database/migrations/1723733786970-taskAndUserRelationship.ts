import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskAndUserRelationship1723733786970
  implements MigrationInterface
{
  name = 'TaskAndUserRelationship1723733786970';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "updated_by"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_by"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_by"`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "created_by"`);
    await queryRunner.query(`ALTER TABLE "tasks" ADD "created_by" integer`);
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_9fc727aef9e222ebd09dc8dac08" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_9fc727aef9e222ebd09dc8dac08"`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "created_by"`);
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "created_by" character varying(300)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "updated_by" character varying(300)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "created_by" character varying(300)`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "updated_by" character varying(300)`,
    );
  }
}
