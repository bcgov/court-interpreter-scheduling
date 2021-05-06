import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventEntity1619727566425 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS interpreter_event (
                id uuid NOT NULL DEFAULT uuid_generate_v4(),
                previous character varying COLLATE pg_catalog."default" NOT NULL,
                updated character varying COLLATE pg_catalog."default" NOT NULL,
                created_at timestamp without time zone NOT NULL DEFAULT now(),
                "interpreterId" integer,
                "userId" uuid,
                CONSTRAINT "PK_458a225e9db15623fb0b8ce7225" PRIMARY KEY (id),
                CONSTRAINT "FK_b34d5dc19d9f98a2e4ccf8f268d" FOREIGN KEY ("interpreterId")
                    REFERENCES public.interpreter (id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE SET NULL,
                CONSTRAINT "FK_12c1a00ef6ce42969bdee40523b2398d" FOREIGN KEY ("userId")
                    REFERENCES public.user (id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE SET NULL
            )
        `);
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS booking_event (
                id uuid NOT NULL DEFAULT uuid_generate_v4(),
                previous character varying COLLATE pg_catalog."default" NOT NULL,
                updated character varying COLLATE pg_catalog."default" NOT NULL,
                created_at timestamp without time zone NOT NULL DEFAULT now(),
                "bookingId" integer,
                "userId" uuid,
                CONSTRAINT "PK_020993a41994bae310ecd6c17a5" PRIMARY KEY (id),
                CONSTRAINT "FK_4585f6a538cbc19413fa2e3455b" FOREIGN KEY ("bookingId")
                    REFERENCES public.booking (id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE SET NULL,
                CONSTRAINT "FK_9c503c24c5544e6fab1e953d1b86366e" FOREIGN KEY ("userId")
                    REFERENCES public.user (id) MATCH SIMPLE
                    ON UPDATE NO ACTION
                    ON DELETE SET NULL
            )
        `);

    await queryRunner.query(
      `ALTER TABLE booking ADD COLUMN IF NOT EXISTS events uuid  REFERENCES booking_event(id) ON DELETE SET NULL;`,
    );

    await queryRunner.query(
      `ALTER TABLE interpreter ADD COLUMN IF NOT EXISTS events uuid REFERENCES interpreter_event(id) ON DELETE SET NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE interpreter DROP COLUMN IF EXISTS "events";`);
    await queryRunner.query(`ALTER TABLE booking DROP COLUMN IF EXISTS "events";`);
    await queryRunner.query(`DROP TABLE "interpreter_event";`);
    await queryRunner.query(`DROP TABLE "booking_event";`);
  }
}
