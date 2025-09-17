import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCountryDetail } from '../hooks/useCountries';
import { countriesAPI } from '../services/api';
import './CountryDetailPage.css';

const CountryDetailPage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { country, loading, error } = useCountryDetail(name);
  const [borderCountries, setBorderCountries] = useState([]);
  const [borderLoading, setBorderLoading] = useState(false);

  useEffect(() => {
    if (country?.borders && country.borders.length > 0) {
      const fetchBorderCountries = async () => {
        try {
          setBorderLoading(true);
          const borderData = await countriesAPI.getCountriesByCode(country.borders);
          setBorderCountries(borderData);
        } catch (err) {
          console.error('Error fetching border countries:', err);
        } finally {
          setBorderLoading(false);
        }
      };

      fetchBorderCountries();
    }
  }, [country]);

  const formatPopulation = (population) => {
    return population.toLocaleString();
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleBorderCountryClick = (countryName) => {
    navigate(`/country/${countryName}`);
  };

  if (loading) {
    return (
      <div className="country-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading country details...</p>
        </div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="country-detail-page">
        <div className="error-container">
          <h2>Country not found</h2>
          <p>{error || 'The requested country could not be found.'}</p>
          <button onClick={handleBackClick}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="country-detail-page">
      <button className="back-button" onClick={handleBackClick}>
        <span className="back-arrow">←</span>
        Back
      </button>

      <div className="country-detail-content">
        <div className="country-flag-large">
          <img
            src={country.flags.svg}
            alt={`Flag of ${country.name.common}`}
          />
        </div>

        <div className="country-information">
          <h1 className="country-title">{country.name.common}</h1>

          <div className="country-details-grid">
            <div className="details-column">
              <div className="detail-item">
                <span className="detail-label">Native Name:</span>
                <span className="detail-value">
                  {country.name.nativeName
                    ? Object.values(country.name.nativeName)[0]?.common || country.name.common
                    : country.name.common
                  }
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Population:</span>
                <span className="detail-value">{formatPopulation(country.population)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Region:</span>
                <span className="detail-value">{country.region}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Sub Region:</span>
                <span className="detail-value">{country.subregion || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Capital:</span>
                <span className="detail-value">
                  {country.capital ? country.capital.join(', ') : 'N/A'}
                </span>
              </div>
            </div>

            <div className="details-column">
              <div className="detail-item">
                <span className="detail-label">Top Level Domain:</span>
                <span className="detail-value">
                  {country.tld ? country.tld.join(', ') : 'N/A'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Currencies:</span>
                <span className="detail-value">
                  {country.currencies
                    ? Object.values(country.currencies).map(currency => currency.name).join(', ')
                    : 'N/A'
                  }
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Languages:</span>
                <span className="detail-value">
                  {country.languages
                    ? Object.values(country.languages).join(', ')
                    : 'N/A'
                  }
                </span>
              </div>
            </div>
          </div>

          {country.borders && country.borders.length > 0 && (
            <div className="border-countries-section">
              <span className="border-label">Border Countries:</span>
              <div className="border-countries">
                {borderLoading ? (
                  <span className="border-loading">Loading...</span>
                ) : (
                  borderCountries.map((borderCountry) => (
                    <button
                      key={borderCountry.cca3}
                      className="border-country-button"
                      onClick={() => handleBorderCountryClick(borderCountry.name.common)}
                    >
                      {borderCountry.name.common}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryDetailPage;