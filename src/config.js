const configDefault = {
  apiUrl: 'http://localhost:4000/api',
  loadLimit: 5,
};

const configProduction = {
  ...configDefault,
  apiUrl: 'https://sbk-backend.herokuapp.com/api',
};

const config =
  process.env.NODE_ENV === 'production' ? configProduction : configDefault;

export default config;
