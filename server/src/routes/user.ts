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

  return router;
};

export default userRouter;
