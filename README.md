### System requirements

- `make` (GNU Make) >= 3.81
- `node` >= 16.0.0
- `yarn` >= 1.22.18
- `docker` >= 20.10.20
- `docker-compose` >= 2.12.1

### Initial steps

1. `$ make init` - install `node_modules`, init migrations, run seeds
2. `$ yarn weather:fetch` - run a script to fetch weather for available cities

### API

API available on `http://localhost:3000`, with global prefix `/api/v1`

#### cURL

| command                                                                                       | description                                                                                                                                                                    |
|-----------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `$ curl --location --request GET 'localhost:3000/api/v1/weather/available-cities'`            | Get available cities                                                                                                                                                           |
| `$ curl --location --request GET 'localhost:3000/api/v1/weather?city=<CITY>&date=<DAY>'`      | Get weather for a city. `CITY` - name of city `DAY` - Allowed a relative day (`today`, `tomorrow`, `yesterday`) and date in ISO format (`2022-12-09` or `2022-12-09T14:00:00`) |
| `$ curl --location --request GET 'localhost:3000/api/v1/weather/temperature-avg?city=<CITY>'` | Get AVG (for all time) temperature for city. `CITY` - name of city                                                                                                             |
| `$ curl --location --request GET 'localhost:3000/api/v1/weather/popular-city'`                | Get most searched city                                                                                                                                                         |

### Description

A Country data was used from [this](https://github.com/dr5hn/countries-states-cities-database) repository. It's hard to find a good package. So, I just save a time.  

I don't know a Weather API throughput, so I made a little throttling.
