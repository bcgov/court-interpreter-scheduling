import { MigrationInterface, QueryRunner } from 'typeorm';

const Table = 'interpreter';

export class AddColumnInterpreter1617056349218 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // general interpreters
    await queryRunner.query(`ALTER TABLE ${Table} ALTER COLUMN "page12_contract" TYPE VARCHAR`);

    // visual interpreters
    await queryRunner.query(`ALTER TABLE ${Table} ADD COLUMN "admin_comments" TEXT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // general interpreters
    await queryRunner.query(`ALTER TABLE ${Table} ALTER COLUMN "page12_contract" TYPE BOOL`);

    // visual interpreters
    await queryRunner.query(`ALTER TABLE ${Table} DROP COLUMN "admin_comments"`);
  }
}
