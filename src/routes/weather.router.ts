import { Router } from 'express';
import { addDays, format, isValid } from 'date-fns';
import { postgresConnection } from '../connections/postgres.connection';
import { CityEntity } from '../entities/city.entity';
import { WeatherEntity } from '../entities/weather.entity';
import { cityValidationMiddleware, cityPopularityMiddleware } from '../middlewares';
import { PopularCityEntity } from '../entities/popular-city.entity';

enum RelativeDays {
  YESTERDAY = -1,
  TODAY = 0,
  TOMORROW = 1,
}

const WEATHER_DATE_FORMAT = 'yyyy-MM-dd';

const supportedRelativeDays = Object.keys(RelativeDays).map((key) => key.toLowerCase());

export const weatherRouter = Router();

const findWeather = async (city: string, date: string) => {
  const weatherRepository = await postgresConnection.getRepository(WeatherEntity);
  return weatherRepository.findOne({
    where: {
      city: {
        name: city,
      },
      day: date,
    },
  });
};

const relativeDayToDate = (relativeDay: RelativeDays) => {
  const now = new Date();
  return format(addDays(now, relativeDay), WEATHER_DATE_FORMAT);
};

weatherRouter.get('/available-cities', async (req, res) => {
  const availableCities = await postgresConnection.getRepository(CityEntity).find();
  return res.json(availableCities);
});

weatherRouter.get('/temperature-avg', cityValidationMiddleware, async (req, res) => {
  const city = req.query.city as string;

  const weatherRepository = await postgresConnection.getRepository(WeatherEntity);

  // avg for all time (week)
  const result = await weatherRepository
    .createQueryBuilder('weather')
    .select('avg((select avg(t) from unnest(temperature) as t))')
    .where('city.name = :city', { city })
    .leftJoin('weather.city', 'city')
    .getRawOne();

  return res.status(200).json({
    avg_temperature: result.avg,
  });
});

weatherRouter.get('/popular-city', async (req, res) => {
  const popularityRepository = await postgresConnection.getRepository(PopularCityEntity);

  const result = await popularityRepository
    .createQueryBuilder('popularity')
    .select(['city.name'])
    .where('search_count = (select max(search_count) from "popular-city")')
    .leftJoin('popularity.city', 'city')
    .limit(1)
    .getRawOne();

  return res.status(200).json({
    popular_city: result.city_name,
  });
});

weatherRouter.get('/', cityValidationMiddleware, cityPopularityMiddleware, async (req, res) => {
  const city = req.query.city as string;
  const date = req.query.date as string;

  if (!date) {
    return res.status(403).json({
      error: "'date' query param is required",
    });
  }

  const isDateRelative = supportedRelativeDays.indexOf(date) > -1;

  let record;
  if (isDateRelative) {
    const searchedDate = relativeDayToDate(RelativeDays[date.toUpperCase() as keyof RelativeDays]);
    record = await findWeather(city, searchedDate);
  } else {
    const dateInstance = new Date(date);
    const isDateValid = isValid(dateInstance);

    if (!isDateValid) {
      return res.status(403).json({
        error: "'date' query param is not valid date. Try ISO format",
      });
    }

    record = await findWeather(city, format(dateInstance, WEATHER_DATE_FORMAT));
  }

  if (record) {
    return res.json(record);
  }

  return res.status(404).json({
    error: `Weather not found for '${city}'`,
  });
});
