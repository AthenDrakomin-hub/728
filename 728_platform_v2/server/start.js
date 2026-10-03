const { register } = require('tsconfig-paths');
register({
  baseUrl: __dirname,
  paths: {
    '@/*': ['src/*']
  }
});
require('./dist/index.js');
