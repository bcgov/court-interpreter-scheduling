import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateInterpreterAdminCol1617113768896
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adding new
    await queryRunner.query(
      `ALTER TABLE interpreter ADD COLUMN IF NOT EXISTS "admin_comments" VARCHAR;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE interpreter DROP COLUMN IF EXISTS admin_comments;`,
    );
  }
}
