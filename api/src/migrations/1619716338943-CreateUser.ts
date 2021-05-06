import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1619716338943 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE  IF NOT EXISTS "user" (
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
        kc_id character varying  NOT NULL,
        first_name character varying,
        last_name character varying,
        created_at timestamp without time zone NOT NULL DEFAULT now(),
        updated_at timestamp without time zone NOT NULL DEFAULT now(),
        location_id integer,
        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id),
        CONSTRAINT "FK_93e37a8413a5745a9b52bc3c0c1" FOREIGN KEY ("locationId")
          REFERENCES public.court_location (id) MATCH SIMPLE
          ON UPDATE NO ACTION
          ON DELETE SET NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE "user"
    `);
  }
}
