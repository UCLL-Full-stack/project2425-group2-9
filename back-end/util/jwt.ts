import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';


const privateKey = fs.readFileSync(path.resolve(process.cwd(), process.env.JWT_PRIVATE_KEY || './keys/private.key'), 'utf8');
const publicKey = fs.readFileSync(path.resolve(process.cwd(), process.env.JWT_PUBLIC_KEY || './keys/public.key'), 'utf8');

/**
 * Generate a JWT token using RS256 algorithm
 * @param {Object} payload - The payload to include in the JWT
 * @param {string} payload.username - The username of the user
 * @param {Role} payload.role - The role of the user
 * @returns {string} - The signed JWT token
 */
const generateJwtToken = ({ username, role }: { username: string, role: Role }): string => {
    if (!privateKey) {
        throw new Error('JWT private key is not defined.');
    }
    return jwt.sign({ username, role }, privateKey, { algorithm: 'RS256', expiresIn: '24h' });
};

/**
 * Verify a JWT token using RS256 algorithm
 * @param {string} token - The JWT token to verify
 * @returns {Object} - The decoded payload if the token is valid
 */
const verifyJwtToken = (token: string): any => {
    if (!publicKey) {
        throw new Error('JWT public key is not defined.');
    }
    return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
};

export { generateJwtToken, verifyJwtToken };