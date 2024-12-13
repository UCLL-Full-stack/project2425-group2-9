import { Role } from '@prisma/client';
import { Request } from 'express';

declare module 'express-serve-static-core' {
    interface Request {
        customer?: {
            id: string;
            role: Role;
            // Add other properties as needed
        };
    }
}