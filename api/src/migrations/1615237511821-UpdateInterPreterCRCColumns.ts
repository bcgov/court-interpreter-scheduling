import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateInterPreterCRCColumns1615237511821 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {

    // Create Is date function
    await queryRunner.query(`CREATE OR REPLACE FUNCTION IS_DATE(s VARCHAR) RETURNS BOOLEAN AS $$ 
    BEGIN
      perform s::date;
      return true;
    exception when others then
      return false;
    END;
    $$ LANGUAGE plpgsql;`)

    // Renaming existing
    await queryRunner.query(`ALTER TABLE interpreter RENAME COLUMN criminal_record_check TO criminal_record_check_comment;`);

    // Adding new
    await queryRunner.query(`ALTER TABLE interpreter ADD COLUMN IF NOT EXISTS "criminal_record_check_date" TIMESTAMP WITHOUT TIME ZONE NULL;`);

    // Migrating valid dates to 
    await queryRunner.query(`WITH valid_dates AS (SELECT * FROM interpreter WHERE IS_DATE(criminal_record_check_comment) = TRUE)
    UPDATE interpreter
    SET criminal_record_check_date = TO_TIMESTAMP(valid_dates.criminal_record_check_comment, 'DD-Mon-YY')
    FROM valid_dates
    WHERE interpreter.id = valid_dates.id;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE interpreter DROP COLUMN IF EXISTS criminal_record_check_date;`);
    await queryRunner.query(`ALTER TABLE interpreter RENAME COLUMN criminal_record_check_comment TO criminal_record_check;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS IS_DATE;`);
  }

}
