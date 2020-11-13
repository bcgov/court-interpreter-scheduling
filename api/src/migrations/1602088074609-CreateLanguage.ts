import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLanguage1602088074609 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS language (
                name character varying PRIMARY KEY,
                created_at timestamp without time zone NOT NULL DEFAULT now(),
                updated_at timestamp without time zone NOT NULL DEFAULT now()
            );
            
            -- Indices -------------------------------------------------------
            
            CREATE UNIQUE INDEX IF NOT EXISTS "PK_7df7d1e250ea2a416f078a631fb" ON language(name text_ops);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "PK_7df7d1e250ea2a416f078a631fb"`);
    await queryRunner.query(`DROP TABLE "language"`);
  }
}
