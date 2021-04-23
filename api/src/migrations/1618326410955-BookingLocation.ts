import { MigrationInterface, QueryRunner } from 'typeorm';

export class BookingLocation1618326410955 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE booking ADD COLUMN IF NOT EXISTS court_location_id INT NULL DEFAULT NULL REFERENCES court_location(id) ON DELETE SET NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE booking DROP COLUMN IF EXISTS court_location;`);
  }
}
