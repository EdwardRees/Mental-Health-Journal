import { Application } from 'express';
import { PrismaClient } from '@prisma/client';
import authRouter from './auth';
import userRouter from './user';
import gratitudeRouter from './gratitude';
import affirmationRouter from './affirmation';
// import moodJournalRoutes from './mood-journal';

/**
 * Routes for the server
 */
export default (app: Application, prisma: PrismaClient) => {
  /**
   * Routes for authentication
   */
  app.use("/api/auth", authRouter(prisma));

  /**
   * Routes for user profile
   */
  app.use("/api/user", userRouter(prisma));
  /**
   * Routes for gratitude journal
   */
  app.use("/api/gratitude", gratitudeRouter(prisma));
  
  /**
   * Routes for affirmation
   */
  app.use("/api/affirmation", affirmationRouter(prisma));
  
  /**
   * Routes for mood journal
   */

}  

