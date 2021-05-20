import { MigrationInterface, QueryRunner } from 'typeorm';

const Table = 'booking';

export class AddColumnMOABooking1621292615427 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE ${Table} ADD COLUMN IF NOT EXISTS "method_of_appearance" character varying;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE ${Table} DROP COLUMN IF EXISTS "method_of_appearance";`);
  }
}
