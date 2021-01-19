import {MigrationInterface, QueryRunner} from "typeorm";

export class Page12ContractColumn1610996660056 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE interpreter ADD COLUMN "page12_contract" BOOL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE interpreter DROP COLUMN "page12_contract"`,
        );
    }

}
