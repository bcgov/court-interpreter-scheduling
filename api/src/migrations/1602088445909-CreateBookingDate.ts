import { query } from 'express';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBookingDate1602088445909 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bookingDate_period_enum') THEN
              CREATE TYPE "bookingDate_period_enum" AS ENUM('MORNING', 'AFTERNOON', 'WHOLE_DAY');
            END IF;
        END
        $$;      
      `,
    );

    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "bookingDate" (
                id SERIAL PRIMARY KEY,
                date timestamp without time zone NOT NULL,
                period "bookingDate_period_enum" NOT NULL DEFAULT 'MORNING'::"bookingDate_period_enum",
                arrival_time time without time zone,
                created_at timestamp without time zone NOT NULL DEFAULT now(),
                updated_at timestamp without time zone NOT NULL DEFAULT now(),
                "bookingId" integer REFERENCES booking(id) ON DELETE CASCADE ON UPDATE CASCADE
            );
            
            -- Indices -------------------------------------------------------
            
            CREATE UNIQUE INDEX IF NOT EXISTS "PK_06800e1b58c15fb3ae3316ae95f" ON "bookingDate"(id int4_ops);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "PK_06800e1b58c15fb3ae3316ae95f"`);
    await queryRunner.query(`DROP TABLE "bookingDate"`);
    await queryRunner.query(`DROP TYPE "bookingDate_period_enum"`);
  }
}
