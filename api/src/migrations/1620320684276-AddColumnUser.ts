import { MigrationInterface, QueryRunner } from 'typeorm';

const Table = `"user"`;

export class AddColumnUser1620320684276 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE ${Table} ADD COLUMN IF NOT EXISTS "gu_id" character varying;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE ${Table} DROP COLUMN IF EXISTS "gu_id";`);
  }
}
