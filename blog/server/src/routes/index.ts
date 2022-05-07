import { PrismaClient } from "@prisma/client";
import { Application } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import blogRouter from "./blog";

export default (app: Application, prisma: PrismaClient) => {
  app.use("/api/auth", authRouter(prisma));
  app.use("/api/user", userRouter(prisma));
  app.use("/api/blog", blogRouter(prisma));

  // TODO - add user routes
  // TODO - add blogpost routes
  // TODO - add comment routes
  // TODO - add like routes
  // TODO - add password reset routes
};
