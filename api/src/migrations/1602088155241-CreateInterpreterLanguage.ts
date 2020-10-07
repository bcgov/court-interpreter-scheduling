import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInterpreterLanguage1602088155241
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'interpreterLanguage_level_enum') THEN
              CREATE TYPE "interpreterLanguage_level_enum" AS ENUM('1', '2', '3', '4');
            END IF;
        END
        $$;      
      `,
    );

    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "interpreterLanguage" (
                id SERIAL PRIMARY KEY,
                level "interpreterLanguage_level_enum" NOT NULL DEFAULT '1'::"interpreterLanguage_level_enum",
                comment_on_level character varying,
                created_at timestamp without time zone NOT NULL DEFAULT now(),
                updated_at timestamp without time zone NOT NULL DEFAULT now(),
                "interpreterId" integer REFERENCES interpreter(id) ON DELETE CASCADE,
                "languageName" character varying REFERENCES language(name)
            );
            
            -- Indices -------------------------------------------------------
            
            CREATE UNIQUE INDEX IF NOT EXISTS "PK_95f711f2132f9b818706b1fc3ce" ON "interpreterLanguage"(id int4_ops);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "PK_95f711f2132f9b818706b1fc3c"`);
    await queryRunner.query(`DROP TABLE "interpreterLanguage"`);
    await queryRunner.query(`DROP TYPE "interpreterLanguage_level_enum"`);
  }
}
