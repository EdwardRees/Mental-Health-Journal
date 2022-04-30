import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import admin from "../middleware/admin";
import verify from "../middleware/verify";
import bcrypt, { hash } from "bcrypt";

/**
 * Generate a Reset Code
 */
const generateResetCode = () => {
  // Create a random string of 9 characters long with uppercase, lowercase, and digit values
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let resetCode = "";
  for (let i = 0; i < 9; i++) {
    resetCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return resetCode;
};

/**
 * Router to handle password reset components
 * @param prisma Prisma Client to access database
 */
const passwordResetRouter = (prisma: PrismaClient) => {
  const router = Router();

  /**
   * @desc Check password reset endpoint
   * @method GET
   * @route /api/password-reset/
   * @privacy public
   */
  router.get("/", async (req: Request, res: Response) => {
    res.send("Password Reset Endpoint");
  });

  /**
   * @desc Request a password reset
   * @method POST
   * @route /api/password-reset/request
   * @privacy public
   */
  router.post("/request", async (req: Request, res: Response) => {
    let token = generateResetCode();
    let { userId } = req.body;
    if (!userId) {
      return res.status(400).send({
        error: "Please provide a userId",
      });
    }
    await prisma.passwordReset.create({
      data: {
        user: {
          connect: {
            id: parseInt(userId),
          },
        },
        token: token,
        expiresAt: new Date(Date.now() + 3600000),
        used: false,
      },
    }).then((data) => {
      res.send(data);
    }).catch((err) => res.status(500).send(err));
  });

  router.post("/reset", async (req: Request, res: Response) => {
    let { userId, password, token } = req.body;
    userId = parseInt(userId);
    if (!userId || !password) {
      return res.status(400).send({
        error: "Please provide a userId and password",
      });
    }
    let validReset = await prisma.passwordReset.findMany({
      where: {
        user: {
          id: userId,
        },
        token: token,
        used: false,
      },
    });
    if (validReset.length === 0) {
      return res.status(400).send({
        error: "Invalid token",
      });
    }
    if(validReset[0].expiresAt < new Date()) {
      return res.status(400).send({
        error: "Token has expired",
      });
    }
    let hash = bcrypt.hashSync(password, 10);
    await prisma.auth.update({
      where: {
        id: userId,
      },
      data: {
        password: hash
      },
    });
    await prisma.passwordReset.deleteMany({
      where: {
        user: {
          id: userId
        },
      },
    });
    res.send({msg: "Password reset successful"});
  });

  return router;
};

export default passwordResetRouter;
