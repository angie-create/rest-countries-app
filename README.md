# Frontend Mentor - REST Countries API with color theme switcher solution

![REST Countries App Screenshot](./preview.jpg)

This is a solution to the [REST Countries API with color theme switcher challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/rest-countries-api-with-color-theme-switcher-5cacc469fec04111f7b848ca). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- See all countries from the API on the homepage
- Search for a country using an `input` field
- Filter countries by region
- Click on a country to see more detailed information on a separate page
- Click through to the border countries on the detail page
- Toggle the color scheme between light and dark mode


### Links

- Solution URL: [GitHub Repository](https://github.com/angie-create/rest-countries-app)
- Live Site URL: [GitHub Pages](https://angie-create.github.io/rest-countries-app)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- [React](https://reactjs.org/) - JS library
- [Vite](https://vitejs.dev/) - Build tool
- [React Router](https://reactrouter.com/) - For client-side routing
- [REST Countries API](https://restcountries.com/) - External API for country data

### What I learned

This project was an excellent opportunity to practice several key React concepts and modern web development techniques:

#### 1. Custom React Hooks for Data Fetching
```js
export const useCountries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await countriesAPI.getAllCountries();
        setCountries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  return { countries, loading, error };
};
```

#### 2. Context API for Theme Management
```js
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

#### 3. Fallback API System
```js
// Robust API service with automatic fallback to local data
export const countriesAPI = {
  getAllCountries: async () => {
    try {
      const response = await fetch(`${BASE_URL}/all`);
      return await response.json();
    } catch (error) {
      console.warn('API failed, falling back to local data:', error);
      const fallbackResponse = await fetch(FALLBACK_DATA_URL);
      const fallbackData = await fallbackResponse.json();
      return fallbackData.map(transformCountryData);
    }
  }
};
```


### Useful resources

- [React Router Documentation](https://reactrouter.com/) - Essential for understanding client-side routing
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) - Helped implement the theming system
- [REST Countries API](https://restcountries.com/) - Comprehensive API documentation
- [Vite Documentation](https://vitejs.dev/) - Modern build tool with excellent developer experience

## Author

- Frontend Mentor - [@angie-create](https://www.frontendmentor.io/profile/angie-create)
- GitHub - [@angie-create](https://github.com/angie-create)
