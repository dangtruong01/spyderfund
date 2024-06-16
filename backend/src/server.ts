import http from 'http';
import app from './app'; // Import the express app
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PORT = process.env.BACKEND_PORT || 3000;
app.set('port', PORT);

const server = http.createServer(app);

server.listen(PORT);
server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
    console.log(`Listening on ${bind}`);
});
