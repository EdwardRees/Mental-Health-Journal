import { PrismaClient } from "@prisma/client";
import { Application } from "express";
import authRouter from "./auth";
import userRouter from "./user";

export default (app: Application, prisma: PrismaClient) => {
  app.use("/api/auth", authRouter(prisma));
  app.use("/api/user", userRouter(prisma));

  // TODO - add user routes
  // TODO - add blogpost routes
  // TODO - add comment routes
  // TODO - add like routes
  // TODO - add password reset routes
};
