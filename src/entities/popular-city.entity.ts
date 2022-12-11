import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CityEntity } from './city.entity';
import { BaseEntity } from './base.entity';

@Entity('popular-city')
export class PopularCityEntity extends BaseEntity {
  @JoinColumn()
  @OneToOne(() => CityEntity, { onDelete: 'CASCADE' })
  city: CityEntity;

  @Column({
    name: 'search_count',
    type: 'bigint',
    unsigned: true,
  })
  searchCount: string;
}
