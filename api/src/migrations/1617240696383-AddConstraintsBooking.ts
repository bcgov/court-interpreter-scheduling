import { MigrationInterface, QueryRunner } from 'typeorm';

const Table = 'booking';

/**
 * add onDelete SET_NULL constraint to booking to avoid deleting interpreters error
 */

export class AddConstraintsBooking1617240696383 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE ${Table}
        DROP CONSTRAINT "booking_interpreterId_fkey"
    `);

    await queryRunner.query(`ALTER TABLE ${Table}
        DROP CONSTRAINT "booking_languageName_fkey"
    `);

    await queryRunner.query(`ALTER TABLE ${Table}
        ADD CONSTRAINT "FK_30d4169f85af47189aef535d348" FOREIGN KEY ("languageName")
        REFERENCES public.language (name) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
    `);

    await queryRunner.query(`ALTER TABLE ${Table}
        ADD CONSTRAINT "FK_5878dadef8ee4355f9685890bfd" FOREIGN KEY ("interpreterId")
        REFERENCES public.interpreter (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE ${Table}
        DROP CONSTRAINT "FK_30d4169f85af47189aef535d348"
    `);
    await queryRunner.query(`ALTER TABLE ${Table}
        DROP CONSTRAINT "FK_5878dadef8ee4355f9685890bfd"
    `);
  }
}
