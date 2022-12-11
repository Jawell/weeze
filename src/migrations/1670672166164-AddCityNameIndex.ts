import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCityNameIndex1670672166164 implements MigrationInterface {
  private readonly TABLE_NAME = 'city';

  private readonly INDEX_NAME = 'CITY_NAME_INDEX';

  private readonly COLUMN_NAME = 'name';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE INDEX ${this.INDEX_NAME} ON ${this.TABLE_NAME} USING HASH (${this.COLUMN_NAME});`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(this.TABLE_NAME, this.INDEX_NAME);
  }
}
