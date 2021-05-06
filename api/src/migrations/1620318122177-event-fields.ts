import { MigrationInterface, QueryRunner } from 'typeorm';

export class EventFields1620318122177 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE interpreter_event ADD COLUMN IF NOT EXISTS field character varying;
      ALTER TABLE interpreter_event ADD COLUMN IF NOT EXISTS subfield character varying;
      ALTER TABLE interpreter_event ADD COLUMN IF NOT EXISTS language character varying;
    `,
    );

    await queryRunner.query(
      `ALTER TABLE booking_event ADD COLUMN IF NOT EXISTS field character varying;
      ALTER TABLE booking_event ADD COLUMN IF NOT EXISTS subfield character varying;
      ALTER TABLE booking_event ADD COLUMN IF NOT EXISTS language character varying;
    `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE interpreter_event DROP COLUMN IF EXISTS field;
      ALTER TABLE interpreter_event DROP COLUMN IF EXISTS subfield;
      ALTER TABLE interpreter_event DROP COLUMN IF EXISTS language;
    `);

    await queryRunner.query(`
      ALTER TABLE booking_event DROP COLUMN IF EXISTS field;
      ALTER TABLE booking_event DROP COLUMN IF EXISTS subfield;
      ALTER TABLE booking_event DROP COLUMN IF EXISTS language;
    `);
  }
}
