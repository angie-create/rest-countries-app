const BASE_URL = 'https://restcountries.com/v3.1';
const FALLBACK_DATA_URL = '/rest-countries-api-with-color-theme-switcher-master/data.json';

// Transform old format to new format for compatibility
const transformCountryData = (oldCountry) => {
  return {
    name: {
      common: oldCountry.name,
      nativeName: oldCountry.nativeName ? { [Object.keys(oldCountry.nativeName)[0] || 'native']: { common: Object.values(oldCountry.nativeName)[0] || oldCountry.name } } : null
    },
    capital: oldCountry.capital ? [oldCountry.capital] : null,
    region: oldCountry.region,
    subregion: oldCountry.subregion,
    population: oldCountry.population,
    flags: {
      svg: oldCountry.flags?.svg || oldCountry.flag || '',
      png: oldCountry.flags?.png || oldCountry.flag || ''
    },
    cca3: oldCountry.alpha3Code,
    tld: oldCountry.topLevelDomain,
    currencies: oldCountry.currencies ? Object.fromEntries(
      Object.entries(oldCountry.currencies).map(([key, curr]) => [key, { name: curr.name }])
    ) : null,
    languages: oldCountry.languages ? Object.fromEntries(
      oldCountry.languages.map((lang, index) => [`lang${index}`, lang])
    ) : null,
    borders: oldCountry.borders
  };
};

export const countriesAPI = {
  getAllCountries: async () => {
    try {
      const response = await fetch(`${BASE_URL}/all?fields=name,capital,region,population,flags,cca3`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn('API failed, falling back to local data:', error);
      try {
        const fallbackResponse = await fetch(FALLBACK_DATA_URL);
        if (!fallbackResponse.ok) {
          throw new Error(`Fallback data fetch failed: ${fallbackResponse.status}`);
        }
        const fallbackData = await fallbackResponse.json();
        return fallbackData.map(transformCountryData);
      } catch (fallbackError) {
        console.error('Both API and fallback failed:', fallbackError);
        throw new Error('Unable to load countries data');
      }
    }
  },

  getCountryByName: async (name) => {
    try {
      const response = await fetch(`${BASE_URL}/name/${name}?fullText=true`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data[0];
    } catch (error) {
      console.warn('API failed, falling back to local data for country:', name, error);
      try {
        const fallbackResponse = await fetch(FALLBACK_DATA_URL);
        if (!fallbackResponse.ok) {
          throw new Error(`Fallback data fetch failed: ${fallbackResponse.status}`);
        }
        const fallbackData = await fallbackResponse.json();
        const country = fallbackData.find(country =>
          country.name.toLowerCase() === name.toLowerCase()
        );
        if (!country) {
          throw new Error(`Country "${name}" not found in fallback data`);
        }
        return transformCountryData(country);
      } catch (fallbackError) {
        console.error('Both API and fallback failed:', fallbackError);
        throw new Error(`Unable to load country data for ${name}`);
      }
    }
  },

  getCountriesByRegion: async (region) => {
    try {
      const response = await fetch(`${BASE_URL}/region/${region}?fields=name,capital,region,population,flags,cca3`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn('API failed, falling back to local data for region:', region, error);
      try {
        const fallbackResponse = await fetch(FALLBACK_DATA_URL);
        if (!fallbackResponse.ok) {
          throw new Error(`Fallback data fetch failed: ${fallbackResponse.status}`);
        }
        const fallbackData = await fallbackResponse.json();
        const countries = fallbackData.filter(country =>
          country.region.toLowerCase() === region.toLowerCase()
        );
        return countries.map(transformCountryData);
      } catch (fallbackError) {
        console.error('Both API and fallback failed:', fallbackError);
        throw new Error(`Unable to load countries data for region ${region}`);
      }
    }
  },

  getCountriesByCode: async (codes) => {
    try {
      const response = await fetch(`${BASE_URL}/alpha?codes=${codes.join(',')}&fields=name,cca3`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn('API failed, falling back to local data for border codes:', codes, error);
      try {
        const fallbackResponse = await fetch(FALLBACK_DATA_URL);
        if (!fallbackResponse.ok) {
          throw new Error(`Fallback data fetch failed: ${fallbackResponse.status}`);
        }
        const fallbackData = await fallbackResponse.json();
        const countries = fallbackData.filter(country =>
          codes.includes(country.alpha3Code)
        );
        return countries.map(country => ({
          name: { common: country.name },
          cca3: country.alpha3Code
        }));
      } catch (fallbackError) {
        console.error('Both API and fallback failed:', fallbackError);
        throw new Error(`Unable to load border countries data`);
      }
    }
  }
};