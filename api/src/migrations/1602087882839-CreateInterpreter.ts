import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInterpreter1602087882839 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE  IF NOT EXISTS interpreter (
            id SERIAL PRIMARY KEY,
            first_name character varying NOT NULL,
            last_name character varying NOT NULL,
            address character varying,
            city character varying,
            province character varying,
            postal character varying,
            home_phone character varying,
            business_phone character varying,
            phone character varying,
            email character varying,
            supplier character varying,
            gst character varying,
            comments character varying,
            contract_extension boolean,
            contract_termination boolean,
            created_at timestamp without time zone NOT NULL DEFAULT now(),
            updated_at timestamp without time zone NOT NULL DEFAULT now()
        );
        
        -- Indices -------------------------------------------------------
        
        CREATE UNIQUE INDEX IF NOT EXISTS "PK_df38d00438c8a2300ce50d022ee" ON interpreter(id int4_ops);
        
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "PK_df38d00438c8a2300ce50d022ee"`);
    await queryRunner.query(`DROP TABLE "interpreter"`);
  }
}
