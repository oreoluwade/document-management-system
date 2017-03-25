/* eslint-disable import/no-extraneous-dependencies */

import express from 'express';
import webpack from 'webpack';
import path from 'path';
import open from 'open';
import config from '../webpack.config.dev';

const port = parseInt(process.env.PORT, 10) || 1803;

/* eslint-disable no-console */

const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, '../client/src/index.html'));
});

app.listen(port, (error) => {
  if (error) {
    console.log(error);
  } else if (process.env.NODE_ENV !== 'test') {
    open(`http://localhost:${port}`);
    console.log(`server running on port ${port}`);
  }
});

export default app;
