/* eslint-disable import/no-extraneous-dependencies */
// This is the application entry point. server is set up here.
import webpack from 'webpack';
import path from 'path';
import express from 'express';
import open from 'open';
import compression from 'compression';
import app from '../server/app';
import config from '../webpack.config.dev';

const port = parseInt(process.env.PORT, 10) || 7070;

/* eslint-disable no-console */
const env = (process.env.NODE_ENV || 'development') === 'development';
if (env) {
  const compiler = webpack(config);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));
} else {
  app.use(express.static('dist'));
  app.use(compression());
}

app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, `../${env ? 'client' : 'dist'}/index.html`));
});

app.listen(port, (error) => {
  if (error) {
    console.log(error);
  }
  if (env) open(`http://localhost:${port}`);
  console.log(`server running on port ${port}`);
});

export default app;
