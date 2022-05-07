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

  router.post("/getById", async (req: Request, res: Response) => {
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
      })
      .catch((err) => {
        res.status(400).send({
          error: "User not found",
        });
      });
  });

  router.post("/getByEmail", async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({
        error: "Please provide an email",
      });
    }
    await prisma.auth
      .findUnique({
        where: {
          email: email,
        },
      })
      .then(async (authUser: any) => {
        if (!authUser) {
          return res.status(400).send({
            error: "User not found",
          });
        }
        await prisma.user
          .findUnique({ where: { id: parseInt(authUser.userId) } })
          .then((user: any) => {
            return res.send(user);
          })
          .catch((err) => res.status(400).send(err));
      })
      .catch((err) => res.status(400).send(err));
  });

  router.post("/getByUsername", async (req: Request, res: Response) => {
    const { username } = req.body;
    if (!username) {
      return res.status(400).send({ error: "Please provide a username" });
    }
    await prisma.auth
      .findUnique({ where: { username: username } })
      .then(async (authUser: any) => {
        if (!authUser) {
          return res.status(400).send({ error: "User not found" });
        }
        await prisma.user
          .findUnique({
            where: {
              id: parseInt(authUser.userId),
            },
          })
          .then((user: any) => {
            return res.send(user);
          })
          .catch((err) => res.status(400).send(err));
      })
      .catch((err) => res.status(400).send(err));
  });


  return router;
};

export default userRouter;
