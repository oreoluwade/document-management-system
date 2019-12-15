const webpack = require('webpack');
const path = require('path');
const express = require('express');
const open = require('open');
const compression = require('compression');
const app = require('../server/app');
const config = require('../webpack.config.dev');

const port = process.env.PORT || 7070;

/* eslint-disable no-console */
const env = (process.env.NODE_ENV || 'development') === 'development';
if (env) {
  const compiler = webpack(config);
  app.use(
    require('webpack-dev-middleware')(compiler, {
      noInfo: true,
      publicPath: config.output.publicPath
    })
  );

  app.use(require('webpack-hot-middleware')(compiler));
} else {
  app.use(express.static('dist'));
  app.use(compression());
}

app.get('*', (request, response) => {
  response.sendFile(
    path.join(__dirname, `../${env ? 'client' : 'dist'}/index.html`)
  );
});

app.listen(port, error => {
  if (error) {
    console.log(error);
  }
  if (env) open(`http://localhost:${port}`);
  console.log(`Server running on port ${port}`);
});

module.exports = app;
