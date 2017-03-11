// The application entry point
import http from 'http';
import app from './app'; // The express app

const port = parseInt(process.env.PORT, 10) || 9000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
console.log(`server running on port ${port}`);

