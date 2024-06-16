import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../../types/types';

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;

    if (authHeader) {
        // Get token from the Authorization header
        const token = req.header('Authorization')?.split(' ')[1]; // Bearer TOKEN

        // Check if no token
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        // Verify token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as UserPayload;
            req.user = decoded;
            next();
        } catch (err) {
            res.status(401).json({ msg: 'Token is not valid' });
        }
    } else {
        res.sendStatus(401);
    }
};
