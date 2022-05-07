import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";

/**
 * Authentication router
 * @param prisma Prisma Client
 * @returns Router instance for auth routes
 */
const authRouter = (prisma: PrismaClient) => {
  const router: Router = Router();

  router.get("/", (req: Request, res: Response) =>
    res.send("Authentication route")
  );

  router.post("/register", async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, username } = req.body;
    if (!firstName || !lastName || !email || !password || !username) {
      return res.status(400).send({
        error:
          "Please provide an email, password, username, first name, and last name",
      });
    }
    let user = await prisma.auth.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      return res.status(400).send({ error: "User already exists!" });
    }
    user = await prisma.auth.findUnique({ where: { username: username } });
    if (user) {
      return res.status(400).send({ error: "Username already exists!" });
    }

    let hash = bcrypt.hashSync(password, 10);

    await prisma.user
      .create({
        data: {
          auth: {
            create: {
              email: email,
              password: hash,
              username: username,
            },
          },
          firstName: firstName,
          lastName: lastName,
          blogPosts: {
            create: [],
          },
          comments: { create: [] },
          likes: { create: [] },
          passwordReset: { create: [] },
        },
      })
      .then((user) => {
        const accessToken: any = process.env.ACCESS_TOKEN_SECRET;
        const token = jwt.sign({ user }, accessToken);
        res.send({ user, token });
      })
      .catch((err) => res.status(500).send(err));
  });

  router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        error: "Please provide an email and password",
      });
    }
    await prisma.auth
      .findUnique({
        where: {
          email: email,
        },
      })
      .then((user: any) => {
        if (!user) {
          return res.status(400).send({ error: "User does not exist!" });
        }
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
          return res.status(400).send({ error: "Invalid password!" });
        }
        const accessToken: any = process.env.ACCESS_TOKEN_SECRET;
        const token = jwt.sign({ user }, accessToken);
        res.send({ user, token });
      });
  });

  return router;
};

export default authRouter;
