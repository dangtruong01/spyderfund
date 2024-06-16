import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import crypto from 'crypto';

export class User extends Model {
    public id!: number;
    public ethereumAddress!: string; // Store the user's Ethereum address
    public nonce!: string; // Nonce used for authentication
    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Method to generate a nonce
    static generateNonce(): string {
        return crypto.randomBytes(16).toString('hex');
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ethereumAddress: {
        type: DataTypes.STRING(42),
        allowNull: false,
        unique: true,
    },
    nonce: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: () => User.generateNonce(),
    },
}, {
    tableName: 'users',
    sequelize
});
