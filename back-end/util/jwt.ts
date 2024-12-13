import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken';
const generateJwtToken = ({ username, role} : {username : string, role : Role}): string => {
    const options = { expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`, issuer: 'veso_app' };

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT secret is not defined.');
        }
        return jwt.sign({ username, role }, secret, options);
    } catch (error) {
        console.log(error);
        throw new Error(`Error generating JWT token, see server log for details.`);
    }
};

export  { generateJwtToken }