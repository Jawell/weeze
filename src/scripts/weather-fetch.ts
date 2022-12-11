import https from 'https';
import { format, subDays, addDays } from 'date-fns';
import { postgresConnection } from '../connections/postgres.connection';
import { WeatherEntity } from '../entities/weather.entity';
import { CityEntity } from '../entities/city.entity';

type Coordinates = {
  lat: number;
  lng: number;
};

type HourlyData = {
  time: Date[];
  temperature_2m: string[];
  windspeed_10m: string[];
  winddirection_10m: string[];
};

type WeatherData = {
  hourly: HourlyData;
};

const apiDataModelMap = {
  temperature_2m: 'temperature',
  windspeed_10m: 'windSpeed',
  winddirection_10m: 'windDirection',
};

const API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

async function fetchWeather(coordinates: Coordinates, startDay: string, endDay: string): Promise<WeatherData> {
  const url = new URL(API_BASE_URL);
  url.searchParams.set('latitude', coordinates.lat.toString());
  url.searchParams.set('longitude', coordinates.lng.toString());
  url.searchParams.set('hourly', 'temperature_2m,windspeed_10m,winddirection_10m');
  url.searchParams.set('timezone', 'Europe/London');
  url.searchParams.set('end_date', endDay);
  url.searchParams.set('start_date', startDay);

  return new Promise((resolve, reject) => {
    https
      // decodeURIComponent used because API can't work with encoded value
      .get(decodeURIComponent(url.href), (response) => {
        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          resolve(JSON.parse(data));
        });
      })
      .on('error', (err) => {
        reject('Error: ' + err.message);
      });
  });
}

function splitWeatherDataByChunks(weatherData: WeatherData) {
  const weatherDataKeys = Object.keys(weatherData.hourly).filter((key) => key !== 'time');

  // the result contains an object with 7 chunks of 24 items
  const chunkedData = {
    temperature: [],
    windSpeed: [],
    windDirection: [],
  };
  const chunkSize = 24; // 24 hours
  weatherDataKeys.forEach((key: string) => {
    chunkedData[apiDataModelMap[key]] = weatherData.hourly[key].reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / chunkSize);
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }
      resultArray[chunkIndex].push(item);
      return resultArray;
    }, []);
  });
  return chunkedData;
}

function convertValues(values: string[]) {
  return values.map((value) => parseFloat(value));
}

async function weatherFetch() {
  await postgresConnection.initialize();
  const weatherRepository = await postgresConnection.getRepository(WeatherEntity);
  const cityRepository = await postgresConnection.getRepository(CityEntity);

  const cities = await cityRepository.find();

  const DAYS = 7;
  const now = Date.now();
  const startDay = format(subDays(now, DAYS - 1), 'yyyy-MM-dd');
  const endDay = format(now, 'yyyy-MM-dd');

  // make requests for 3 city parallel with 6 sec pause
  console.info('Fetched data for cities:');
  const chunkSize = 3;
  for (let i = 0; i < cities.length; i += chunkSize) {
    const cityChunk = cities.slice(i, i + chunkSize);
    setTimeout(async () => {
      await Promise.all(
        cityChunk.map(async (city) => {
          const weatherData = await fetchWeather({ lat: city.lat, lng: city.lng }, startDay, endDay);

          // split week data by 24 hour chunks
          const weatherChunks = splitWeatherDataByChunks(weatherData);

          for (let i = 0; i < DAYS; i += 1) {
            await weatherRepository.save({
              day: format(addDays(new Date(startDay), i), 'yyyy-MM-dd'),
              temperature: convertValues(weatherChunks.temperature[i]),
              windSpeed: convertValues(weatherChunks.windSpeed[i]),
              windDirection: convertValues(weatherChunks.windDirection[i]),
              city: { id: city.id },
            });
          }
          console.info(city.name);
        }),
      );
    }, 2000 * i);
  }

  return;
}

weatherFetch();
