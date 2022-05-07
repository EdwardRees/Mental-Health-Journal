import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import admin from "../middleware/admin";
import verify from "../middleware/verify";

/**
 * User Router
 *
 * @param prisma Prisma client to access the database
 */
const userRouter = (prisma: PrismaClient) => {
  const router = Router();

  /**
   * @desc Check user endpoint
   * @method GET
   * @route /api/user
   * @privacy public
   */
  router.get("/", async (req: Request, res: Response) => {
    res.send("User Endpoint");
  });

  /**
   * @desc Get all users
   * @method GET
   * @route /api/user/all
   * @privacy private: only admins can access this endpoint
   */
  router.get("/all", [admin], async (req: Request, res: Response) => {
    let users = await prisma.user.findMany();
    res.send(users);
  });

  /**
   * @desc Get a user by id
   * @method POST
   * @route /api/user/:id
   * @privacy private: only a verified user can access this endpoint
   */
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
  });

  /**
   * @desc Get a user by email
   * @method GET
   * @route /api/get/:id
   * @privacy private: only a verified user can access this endpoint
   */
  router.get("/get/:id", [verify], async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        error: "Please provide an id",
      });
    }
    let user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    let userId = user?.id as number;
    let gratitude = await prisma.gratitudeEntry.findMany({
      where: { userId },
    });
    let affirmation = await prisma.affirmationEntry.findMany({
      where: { userId },
    });
    let mood = await prisma.moodEntry.findMany({ where: { userId } });

    res.status(200).send({ user: { gratitude, affirmation, mood } });
  });

  return router;
};

export default userRouter;
