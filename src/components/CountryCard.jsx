import { Link } from 'react-router-dom';
import './CountryCard.css';

const CountryCard = ({ country }) => {
  const formatPopulation = (population) => {
    return population.toLocaleString();
  };

  return (
    <Link
      to={`/country/${country.name.common}`}
      className="country-card-link"
    >
      <article className="country-card">
        <div className="country-flag">
          <img
            src={country.flags.svg}
            alt={`Flag of ${country.name.common}`}
            loading="lazy"
          />
        </div>
        <div className="country-info">
          <h2 className="country-name">{country.name.common}</h2>
          <div className="country-details">
            <p className="detail-item">
              <span className="detail-label">Population:</span>
              <span className="detail-value">{formatPopulation(country.population)}</span>
            </p>
            <p className="detail-item">
              <span className="detail-label">Region:</span>
              <span className="detail-value">{country.region}</span>
            </p>
            <p className="detail-item">
              <span className="detail-label">Capital:</span>
              <span className="detail-value">
                {country.capital ? country.capital[0] : 'N/A'}
              </span>
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default CountryCard;