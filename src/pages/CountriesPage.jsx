import { useState, useMemo } from 'react';
import { useCountries } from '../hooks/useCountries';
import CountryCard from '../components/CountryCard';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import './CountriesPage.css';

const CountriesPage = () => {
  const { countries, loading, error } = useCountries();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  const filteredCountries = useMemo(() => {
    let filtered = countries;

    if (searchTerm) {
      filtered = filtered.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRegion) {
      filtered = filtered.filter(country =>
        country.region === selectedRegion
      );
    }

    return filtered.sort((a, b) => a.name.common.localeCompare(b.name.common));
  }, [countries, searchTerm, selectedRegion]);

  if (loading) {
    return (
      <div className="countries-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading countries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="countries-page">
        <div className="error-container">
          <h2>Error loading countries</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="countries-page">
      <div className="controls-section">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <FilterDropdown
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
        />
      </div>

      <div className="countries-grid">
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country) => (
            <CountryCard
              key={country.cca3}
              country={country}
            />
          ))
        ) : (
          <div className="no-results">
            <h3>No countries found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountriesPage;