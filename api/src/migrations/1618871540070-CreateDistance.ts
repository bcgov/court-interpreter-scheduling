import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDistance1618871540070 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS distance (
                id SERIAL PRIMARY KEY,
                intp_addr character varying NOT NULL,
                court_addr character varying NOT NULL,
                distance numeric
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "distance"
        `);
  }
}
