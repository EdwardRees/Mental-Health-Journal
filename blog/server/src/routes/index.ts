import { PrismaClient } from "@prisma/client";
import { Application } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import blogRouter from "./blog";
import likeRouter from "./like";
import commentRouter from "./comment";
import categoryRouter from './category';
import tagRouter from './tag';

export default (app: Application, prisma: PrismaClient) => {
  app.use("/api/auth", authRouter(prisma));
  app.use("/api/user", userRouter(prisma));
  app.use("/api/blog", blogRouter(prisma));
  app.use("/api/like", likeRouter(prisma));
  app.use("/api/comment", commentRouter(prisma));
  app.use("/api/category", categoryRouter(prisma));
  app.use("/api/tag", tagRouter(prisma));

  // TODO - add password reset routes
};
