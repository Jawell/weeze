import type { NextFunction, Request, Response } from 'express';
import { postgresConnection } from '../connections/postgres.connection';
import { PopularCityEntity } from '../entities/popular-city.entity';
import { CityEntity } from '../entities/city.entity';

export const cityPopularityMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const city = req.query.city as string;

  const cityRepository = await postgresConnection.getRepository(CityEntity);
  const cityRecord = await cityRepository.findOne({
    select: ['id'],
    where: { name: city },
  });

  if (!cityRecord) {
    return res.status(404).json({
      error: `${city} doesn't exist`,
    });
  }

  const popularityRepository = await postgresConnection.getRepository(PopularCityEntity);
  const popularityRecord = await popularityRepository.findOne({
    select: ['id', 'searchCount', 'city'],
    where: {
      city: { id: cityRecord.id },
    },
  });

  const popularity = BigInt(popularityRecord?.searchCount ?? 0);

  const newPopularity = {
    ...(popularityRecord ? popularityRecord : {}),
    city: { id: cityRecord.id },
    searchCount: (popularity + 1n).toString(),
  };

  await popularityRepository.save(newPopularity);
  next();
};
