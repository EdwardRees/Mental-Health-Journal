import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import verify from "../middleware/verify";

/**
 * User Router
 *
 * @param prisma Prisma client to access the database
 */
const userRouter = (prisma: PrismaClient) => {
  const router = Router();

  router.get("/", async (req: Request, res: Response) => {
    let users = await prisma.user.findMany();
    res.send(users);
  });

  router.post("/get", [verify], async (req: Request, res: Response) => {
    const { id } = req.body;
    if (!id) {
      return res.status(400).send({
        error: "Please provide an id",
      });
    }
    await prisma.user
      .findUnique({
        where: {
          id: parseInt(id),
        },
      })
      .then((user) => {
        res.send(user);
      });
  })

  return router;
};

export default userRouter;