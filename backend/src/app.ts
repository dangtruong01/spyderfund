import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from './api/routes'; // This would import the API routes you've set up
import { checkAuth } from './api/middlewares/checkAuth';

const app: Express = express();

// Basic middleware
app.use(cors()); // Set up CORS
app.use(helmet()); // Helps secure your apps by setting various HTTP headers
app.use(express.json()); // Body parser middleware
app.use(morgan('dev')); // Logging middleware

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'Healthy' });
});

// API routes
app.use('/api', apiRoutes);

app.get('/protected-route', checkAuth, (req, res) => {
    // If the middleware doesn't stop the request, proceed with your controller logic
    res.json({ message: 'This is a protected route' });
});

// Catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error('Not Found');
    next(error);
});

// Error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

export default app;
