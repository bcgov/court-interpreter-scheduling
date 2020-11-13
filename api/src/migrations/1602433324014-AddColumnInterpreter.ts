import { MigrationInterface, QueryRunner } from 'typeorm';

const Table = 'interpreter';

export class AddColumnInterpreter1602433324014 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ${Table} ADD COLUMN "criminal_record_check" VARCHAR`,
    );
    await queryRunner.query(`ALTER TABLE ${Table} ADD COLUMN "fax" VARCHAR`);
    await queryRunner.query(
      `ALTER TABLE ${Table} ADD COLUMN "email_alt" VARCHAR`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ${Table} DROP COLUMN "criminal_record_check"`,
    );
    await queryRunner.query(`ALTER TABLE ${Table} DROP COLUMN "fax"`);
    await queryRunner.query(`ALTER TABLE ${Table} DROP COLUMN "email_alt"`);
  }
}
