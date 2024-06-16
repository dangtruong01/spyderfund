import { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fetchAndCalculate } from '../../utils/etherscanUtils';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const checkUser = () => {

}

export const checkTransaction = async (req: Request, res: Response) => {
    const { userAddress } = req.body;

    try {
        fetchAndCalculate(userAddress)
            .then(data => {
                res.json(data)
            })
            .catch(error => {
                const message = (error as Error).message || 'An unexpected error occurred';
                console.error(message);
                res.status(500).json({ error: message });
            });

    } catch (error) {
        const message = (error as Error).message || 'An unexpected error occurred';
        console.error(message);
        res.status(500).json({ error: message });
    }
};


export const doPeriodicCheck = () => {

}