import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import verify from "../middleware/verify";
import jwt from "jsonwebtoken";
export type UserWhereUniqueInput = {
  email?: string | null
}
/**
 * Prisma client used for connecting to the database
 *
 * @param prisma Prisma Client
 */
const authRouter = (prisma: PrismaClient) => {
  const router = Router();

  router.get("/", (req: Request, res: Response) => {
    res.send("Authentication route");
  });

  router.post("/register", async (req: Request, res: Response) => {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).send({
        error: "Please provide an email, password, and username"
      });
    }
    // encrypt password with bcrypt
    let hash = bcrypt.hashSync(password, 10);

    await prisma.user
      .create({
        data: {
          auth: {
            create: {
              username: username,
              email: email,
              password: hash,
            },
          },
        },
      })
      .then((user) => {
        const accessToken: any = process.env.ACCESS_TOKEN_SECRET;
        // jwt sign user
        const token = jwt.sign({ user }, accessToken);

        res.send({ user, token });
      });
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
          email: email
        },
      })
      .then((user: any) => {
        if (!user) {
          return res.status(400).send({
            error: "User does not exist",
          });
        }
        // compare password with hash
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
          return res.status(400).send({
            error: "Invalid password",
          });
        }
        const accessToken: any = process.env.ACCESS_TOKEN_SECRET;
        // jwt sign user
        const token = jwt.sign({ user }, accessToken);

        res.send({ user, token });
      });
  });

  return router;
};

export default authRouter;
