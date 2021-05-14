import { MigrationInterface, QueryRunner } from 'typeorm';

const Table = 'interpreter';

export class AddColumnSiteCodeInterpreter1620926295786 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE ${Table} ADD COLUMN IF NOT EXISTS "site_code" character varying;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE ${Table} DROP COLUMN IF EXISTS "site_code";`);
  }
}
