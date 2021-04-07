import { MigrationInterface, QueryRunner } from 'typeorm';

export class CourtLocation1617825013778 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Table: court_location
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS court_location (
          id SERIAL PRIMARY KEY,
          location_name character varying NOT NULL,
          location_number int NOT NULL,
          address_line1 character varying,
          address_line2 character varying,
          city character varying,
          postal_code character varying,
          created_at timestamp without time zone NOT NULL DEFAULT now(),
          updated_at timestamp without time zone NOT NULL DEFAULT now()
        );`,
    );

    // Initial Data
    await queryRunner.query(
      `INSERT INTO court_location(location_name,location_number) VALUES ('KELOWNA','4801');
      INSERT INTO court_location(location_name,location_number) VALUES ('NEW WESTMINSTER','3581');
      INSERT INTO court_location(location_name,location_number) VALUES ('RICHMOND','2025');
      INSERT INTO court_location(location_name,location_number) VALUES ('ROBSON SQUARE','2045');
      INSERT INTO court_location(location_name,location_number) VALUES ('VANCOUVER','2040');
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "court_location";`);
  }
}
