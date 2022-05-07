import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import verify from "../middleware/verify";
import admin from "../middleware/admin";

const userRouter = (prisma: PrismaClient) => {
  const router = Router();

  router.get("/", async (req: Request, res: Response) =>
    res.send("User endpoint")
  );

  router.get("/all", [admin], async (req: Request, res: Response) => {
    let users = await prisma.user.findMany();
    res.send(users);
  });


  return router;
};

export default userRouter;
