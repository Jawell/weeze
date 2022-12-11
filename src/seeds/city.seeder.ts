import type { Seeder, Factory } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { CityEntity } from '../entities/city.entity';
import { getCountries } from '../country-data/getCounties';
import { PopularCityEntity } from '../entities/popular-city.entity';

export default class CityAndPopularitySeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const capitals = getCountries({ filters: { region: 'Europe' } })
      .map((country) => {
        if (country.cities.length === 0) {
          return null;
        }
        const cityInfo = country.cities.find((city) => city.name === country.capital);
        if (cityInfo) {
          return {
            name: country.capital,
            lat: Math.trunc(parseFloat(cityInfo.latitude) * 100) / 100,
            lng: Math.trunc(parseFloat(cityInfo.longitude) * 100) / 100,
          };
        }
        return null;
      })
      .filter(Boolean);

    // filter kacaps from Europe
    const goodCities = capitals.filter((capital) => capital.name !== 'Moscow');

    await connection.createQueryBuilder().insert().into(CityEntity).values(goodCities).execute();

    const cityRepository = await connection.getRepository(CityEntity);
    const firstCity = await cityRepository.find({
      take: 1,
    });

    await connection.getRepository(PopularCityEntity).save({
      city: { id: firstCity[0].id },
      searchCount: '100',
    });
  }
}
