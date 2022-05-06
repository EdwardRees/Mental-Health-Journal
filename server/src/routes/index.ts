import { PrismaClient } from "@prisma/client";
import { Application } from "express";
import affirmationRouter from "./affirmation";
import authRouter from "./auth";
import gratitudeRouter from "./gratitude";
import moodRouter from "./mood";
import userRouter from "./user";
import passwordResetRouter from "./passwordreset";
import generalEntryRouter from "./general";

/**
 * Routes for the server
 */
export default (app: Application, prisma: PrismaClient) => {
  /**
   * Routes for authentication
   */
  app.use("/api/auth", authRouter(prisma));

  /**
   * Routes for user
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
  app.use("/api/mood", moodRouter(prisma));

  /**
   * Routes for general journal entries
   */
  app.use("/api/generalEntry", generalEntryRouter(prisma));

  /**
   * Routes for password reset
   */
  app.use("/api/password-reset", passwordResetRouter(prisma));
};
