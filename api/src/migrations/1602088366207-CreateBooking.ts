import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBooking1602088366207 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status_enum') THEN
                CREATE TYPE "booking_status_enum" AS ENUM('Pending', 'Booked', 'CANCELLED');
            END IF;
        END
        $$; 
      `,
    );

    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS booking (
                id SERIAL PRIMARY KEY,
                "caseName" character varying NOT NULL,
                room character varying,
                status booking_status_enum NOT NULL DEFAULT 'Pending'::booking_status_enum,
                registry character varying,
                file character varying,
                "interpretFor" character varying,
                "requestedBy" character varying,
                federal boolean NOT NULL DEFAULT false,
                reason character varying,
                prosecutor character varying,
                comment character varying,
                created_at timestamp without time zone NOT NULL DEFAULT now(),
                updated_at timestamp without time zone NOT NULL DEFAULT now(),
                "interpreterId" integer REFERENCES interpreter(id),
                "languageName" character varying REFERENCES language(name)
            );
            
            -- Indices -------------------------------------------------------
            
            CREATE UNIQUE INDEX IF NOT EXISTS "PK_49171efc69702ed84c812f33540" ON booking(id int4_ops);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "PK_49171efc69702ed84c812f33540"`);
    await queryRunner.query(`DROP TABLE "booking"`);
    await queryRunner.query(`DROP TYPE "booking_status_enum"`);
  }
}
