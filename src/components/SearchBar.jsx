import './SearchBar.css';

const SearchBar = ({ searchTerm, onSearchChange, placeholder = "Search for a country..." }) => {
  return (
    <div className="search-bar">
      <div className="search-icon">🔍</div>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search countries"
      />
    </div>
  );
};

export default SearchBar;