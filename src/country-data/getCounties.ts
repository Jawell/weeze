import countries from './countries+cities.json';
import { dataFilter } from './utils';

export type Translations = 'kr' | 'pt' | 'nl' | 'hr' | 'fa' | 'de' | 'es' | 'fr' | 'ja' | 'it' | 'cn';

export type City = {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
};

export interface Country {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  numeric_code: string;
  phone_code: string;
  capital: string;
  currency: string;
  currency_symbol: string;
  tld: string;
  native: string;
  region: string;
  subregion: string;
  timezones: {
    zoneName: string;
    gmtOffset: number;
    gmtOffsetName: string;
    abbreviation: string;
    tzName: string;
  }[];
  translations: Record<Translations, string>;
  latitude: string;
  longitude: string;
  emoji: string;
  emojiU: string;
  cities: City[];
}

type Args = {
  filters?: {
    region: string;
  };
};

export function getCountries(args?: Args): Country[] {
  let data = countries as Country[];
  if (args?.filters !== undefined) {
    const { filters } = args;
    data = dataFilter(data, filters);
  }
  return data;
}
