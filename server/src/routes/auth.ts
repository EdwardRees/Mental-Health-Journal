import { Application, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
/**
 * Prisma client used for connecting to the database
 * 
 * @param app express application
 * @param prisma Prisma Client 
 */
const authRouter = (app: Application, prisma: PrismaClient) => {
    app.get('/auth/', (req: Request, res: Response) => {
        res.send('Auth page');
    });
}

export default authRouter;
