import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { WeatherEntity } from './weather.entity';

@Entity('city')
export class CityEntity extends BaseEntity {
  // this index handled in migration
  @Index('CITY_NAME_INDEX', { synchronize: false })
  @Column({
    type: 'varchar',
    length: 32,
  })
  name: string;

  @Column({
    type: 'real',
  })
  lat: number;

  @Column({
    type: 'real',
  })
  lng: number;

  @OneToMany(() => WeatherEntity, (weather) => weather.city)
  weather: WeatherEntity[];
}
