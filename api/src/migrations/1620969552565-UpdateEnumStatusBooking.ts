import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEnumStatusBooking1620969552565 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        DO $$
        BEGIN
            IF  EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status_enum') THEN
                ALTER TYPE "booking_status_enum" RENAME VALUE 'CANCELLED' TO 'Cancelled';
            END IF;
        END
        $$; 
    `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
          DO $$
          BEGIN
              IF  EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status_enum') THEN
                  ALTER TYPE "booking_status_enum" RENAME VALUE 'Cancelled' TO 'CANCELLED';
              END IF;
          END
          $$; 
      `,
    );
  }
}
