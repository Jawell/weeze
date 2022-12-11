import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CityEntity } from './city.entity';

@Entity('weather')
export class WeatherEntity extends BaseEntity {
  @Column({
    type: 'numeric',
    array: true,
    precision: 5,
    scale: 2,
  })
  temperature: number[];

  @Column({
    type: 'numeric',
    array: true,
    precision: 5,
    scale: 2,
  })
  windSpeed: number[];

  @Column({
    type: 'smallint',
    array: true,
  })
  windDirection: number[];

  // this index handled in migration
  @Index('WEATHER_DAY_INDEX', { synchronize: false })
  @Column({
    type: 'date',
  })
  day: string;

  @ManyToOne(() => CityEntity, (city) => city.weather, { onDelete: 'CASCADE' })
  city: CityEntity;
}
