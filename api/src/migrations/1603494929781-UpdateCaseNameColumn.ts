import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCaseNameColumn1603494929781 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE booking ALTER COLUMN "caseName" DROP NOT NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE booking ALTER COLUMN "caseName" SET NOT NULL;`,
    );
  }
}
