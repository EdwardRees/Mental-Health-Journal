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

  router.get("/get/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        error: "Please provide an id",
      });
    }
    let user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) {
      return res.status(400).send({
        error: "User not found",
      });
    }
    let userId = user?.id as number;
    let blogPosts = await prisma.blogPost.findMany({
      where: {
        authorId: userId,
      },
    });
    res.status(200).send({ user: { ...user, blogPosts } });
  });

  router.put("/edit/firstname", [verify], async (req: any, res: Response) => {
    const { firstName } = req.body;
    if (!firstName) {
      return res.status(400).send({
        error: "Please provide a first name",
      });
    }
    const { user } = req.user;
    const { userId } = user;
    await prisma.user
      .update({
        where: {
          id: userId,
        },
        data: {
          firstName,
        },
      })
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  router.put("/edit/lastname", [verify], async (req: any, res: Response) => {
    const { lastName } = req.body;
    if (!lastName) {
      return res.status(400).send({
        error: "Please provide a last name",
      });
    }
    const { user } = req.user;
    const { userId } = user;
    await prisma.user
      .update({
        where: {
          id: userId,
        },
        data: {
          lastName,
        },
      })
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  router.delete("/:id", [admin], async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        error: "Please provide an id",
      });
    }
    await prisma.auth.delete({
      where: {
        id: parseInt(id),
      },
    });
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.send("User deleted");
  });

  return router;
};

export default userRouter;
