import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWeatherDayIndex1670672745076 implements MigrationInterface {
  private readonly TABLE_NAME = 'weather';

  private readonly INDEX_NAME = 'WEATHER_DAY_INDEX';

  private readonly COLUMN_NAME = 'day';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE INDEX ${this.INDEX_NAME} ON ${this.TABLE_NAME} USING HASH (${this.COLUMN_NAME});`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(this.TABLE_NAME, this.INDEX_NAME);
  }
}
