import { useState } from 'react';
import './FilterDropdown.css';

const REGIONS = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

const FilterDropdown = ({ selectedRegion, onRegionChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleRegionSelect = (region) => {
    onRegionChange(region);
    setIsOpen(false);
  };

  const handleClearFilter = () => {
    onRegionChange('');
    setIsOpen(false);
  };

  return (
    <div className="filter-dropdown">
      <button
        className="filter-button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Filter by region"
      >
        <span className="filter-text">
          {selectedRegion || 'Filter by Region'}
        </span>
        <span className={`filter-arrow ${isOpen ? 'open' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="filter-menu" role="listbox">
          {selectedRegion && (
            <button
              className="filter-option clear-option"
              onClick={handleClearFilter}
              role="option"
            >
              Clear Filter
            </button>
          )}
          {REGIONS.map((region) => (
            <button
              key={region}
              className={`filter-option ${selectedRegion === region ? 'selected' : ''}`}
              onClick={() => handleRegionSelect(region)}
              role="option"
              aria-selected={selectedRegion === region}
            >
              {region}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;