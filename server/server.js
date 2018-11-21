import server from './app';

const port = process.env.port || 9000;

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}`);
});
