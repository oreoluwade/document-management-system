/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import webpack from 'webpack';
import colors from 'colors';
import webpackConfig from '../prod.config.babel';

process.env.NODE_ENV = 'production';

console.log('Generating minified bundle via Webpack...'.blue);

webpack(webpackConfig).run((err, stats) => {
  if (err) { // so a fatal error occurred. Stop here.
    console.log(err.bold.red);
    return 1;
  }

  const jsonStats = stats.toJson();

  if (jsonStats.hasErrors) {
    return jsonStats.errors.map(error => console.log(error.red));
  }

  if (jsonStats.hasWarnings) {
    console.log('Webpack generated the following warnings: '.bold.yellow);
    jsonStats.warnings.map(warning => console.log(warning.yellow));
  }

  console.log(`Webpack stats: ${stats}`);

  // if we got this far, the build succeeded.
  console.log('Compiled in production mode, written to /dist.'.green);

  return 0;
});

