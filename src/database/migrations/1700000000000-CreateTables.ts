import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1700000000000 implements MigrationInterface {
  name = 'CreateTables1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "login" character varying NOT NULL,
                "password" character varying NOT NULL,
                "version" integer NOT NULL DEFAULT '1',
                "createdAt" bigint NOT NULL,
                "updatedAt" bigint NOT NULL,
                CONSTRAINT "UQ_a62473490b3e4578fd683235c5e" UNIQUE ("login"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "artists" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "grammy" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_09b823d4607d2675dc4ffa82261" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "albums" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "year" integer NOT NULL,
                "artistId" uuid,
                CONSTRAINT "PK_838ebae24d2e12082670ffc95d7" PRIMARY KEY ("id"),
                CONSTRAINT "FK_ed378d7c337efd4d5c8396a77a1" FOREIGN KEY ("artistId") 
                REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE NO ACTION
            )
        `);

    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "tracks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "artistId" uuid,
                "albumId" uuid,
                "duration" integer NOT NULL,
                CONSTRAINT "PK_242a37ffc7870380f0e1dfc3a28" PRIMARY KEY ("id"),
                CONSTRAINT "FK_f27e8c200e8b6a6f9e7d05b7a91" FOREIGN KEY ("artistId") 
                REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE NO ACTION,
                CONSTRAINT "FK_b105d945c4c185395daca91606a" FOREIGN KEY ("albumId") 
                REFERENCES "albums"("id") ON DELETE SET NULL ON UPDATE NO ACTION
            )
        `);

    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "favorites" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "entityId" uuid NOT NULL,
                "entityType" character varying(20) NOT NULL,
                CONSTRAINT "PK_173d1e4d3c1c714de6bfb8e7d0d" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS "IDX_favorites_entity" 
            ON "favorites" ("entityId", "entityType")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "favorites"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tracks"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "albums"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "artists"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
