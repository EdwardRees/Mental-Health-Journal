import { PrismaClient } from "@prisma/client";
import { Application } from "express";
import authRouter from './auth';


export default (app: Application, prisma: PrismaClient) => {

  app.use("/api/auth", authRouter(prisma));

  // TODO - add user routes
  // TODO - add blogpost routes
  // TODO - add comment routes
  // TODO - add like routes
  // TODO - add password reset routes

}