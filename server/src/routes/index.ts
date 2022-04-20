import { Application } from 'express';
import { PrismaClient } from '@prisma/client';
import authRouter from './auth';
//import userProfileRoutes from './user-profile';
//import gratitudeJournalRoutes from './gratitude-journal';
// import affirmationRoutes from './affirmation';
// import moodJournalRoutes from './mood-journal';

/**
 * Routes for the server
 */
export default (app: Application, prisma: PrismaClient) => {
  /**
   * Routes for authentication
   */
  authRouter(app, prisma);
  /**
   * Routes for user profile
   */
  
  /**
   * Routes for gratitude journal
   */
  
  /**
   * Routes for affirmation
   */
  
  /**
   * Routes for mood journal
   */

}  

