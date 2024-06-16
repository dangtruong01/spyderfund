import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

import { User as UserModel } from '../../models/user';
import { UserPayload } from '../../types/types';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const getNonceForSignature = async (req: Request, res: Response) => {
    const { ethereumAddress } = req.body;

    try {
        // Fetch or create a user record
        let user = await UserModel.findOne({ where: { ethereumAddress } });
        if (!user) {
            user = await UserModel.create({ ethereumAddress });
        }

        return res.json({ nonce: user.nonce });
    } catch (error) {
        const err = error as Error
        return res.status(500).json({ message: 'Error fetching nonce', error: err.message });
    }
};

export const verifyNonceAndAuthenticate = async (req: Request, res: Response) => {
    const { ethereumAddress, signature } = req.body;

    // Validate Ethereum address
    if (!ethers.utils.isAddress(ethereumAddress)) {
        return res.status(400).json({ message: 'Invalid Ethereum address' });
    }

    try {
        const user = await UserModel.findOne({ where: { ethereumAddress } });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Verify signature (using ethers.js utility functions)
        const message = `${user.nonce}`;
        const signingAddress = ethers.utils.verifyMessage(message, signature);
        console.log("hi ", signingAddress)

        if (signingAddress.toLowerCase() !== ethereumAddress.toLowerCase()) {
            return res.status(401).json({ message: 'Signature verification failed' });
        }

        // Update nonce for next login
        user.nonce = UserModel.generateNonce();
        await user.save();

        // User matched, create a JWT payload
        const payload: UserPayload = {
            id: user.id,
            ethereumAddress: user.ethereumAddress
        };

        // Sign token with user information
        const token = jwt.sign(
            payload,
            JWT_SECRET, // Make sure you have your secret stored in the .env file
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.header('Authorization', 'Bearer ' + token);

        return res.json({ success: true, token: 'Bearer ' + token });
    } catch (error) {
        const err = error as Error
        return res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};
