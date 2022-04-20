import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import verify from "../middleware/verify";

/**
 * Affirmation router
 * @param prisma Prisma client to access the database
 */
const affirmationRouter = (prisma: PrismaClient) => {
  const router = Router();

  router.get("/", async (req: Request, res: Response) => {
    let affirmationEntries = await prisma.affirmationEntry.findMany();
    res.send(affirmationEntries);
  });

  router.post(
    "/create/:userId",
    [verify],
    async (req: Request, res: Response) => {
      const { userId } = req.params;
      const { affirmation, date } = req.body;
      if (!userId || !affirmation || !date) {
        return res.status(400).send({
          error: "Please provide a userId, affirmation, and date",
        });
      }
      await prisma.affirmationEntry
        .create({
          data: {
            user: {
              connect: {
                id: parseInt(userId),
              },
            },
            affirmation: affirmation,
            date: date,
          },
        })
        .then((affirmationEntry) => {
          res.send(affirmationEntry);
        });
    }
  );

  return router;
};

export default affirmationRouter;