import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1619716338943 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    //     await queryRunner.query(`
    //     CREATE TABLE IF NOT EXISTS user (
    //         id SERIAL PRIMARY KEY,
    //         kc_id character varying NOT NULL,
    //         gu_id character varying,
    //         first_name character varying NOT NULL,
    //         last_name character varying,
    //         distance real,
    //         created_at timestamp without time zone NOT NULL DEFAULT now(),
    //         updated_at timestamp without time zone NOT NULL DEFAULT now()
    //     )
    // `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //     await queryRunner.query(`
    //     DROP TABLE "user"
    // `);
  }
}
