import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial11743847181094 implements MigrationInterface {
    name = 'Initial11743847181094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "VerificationToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "VerificationToken"`);
    }

}
