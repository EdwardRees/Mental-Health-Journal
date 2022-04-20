import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import verify from "../middleware/verify";

/**
 * Affirmation router
 * @param prisma Prisma client to access the database
 */
const affirmationRouter = (prisma: PrismaClient) => {
  const router = Router();

  /**
   * Get all affirmation entries
   */
  router.get("/", async (req: Request, res: Response) => {
    let affirmationEntries = await prisma.affirmationEntry.findMany();
    res.send(affirmationEntries);
  });

  /**
   * Create a affirmation entry for a user id
   */
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
        })
        .catch((err) => res.status(500).send(err));
    }
  );

  /**
   * Get affirmation entries for user by id
   */
  router.get("/user/:userId", [verify], async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).send({
        error: "Please provide a userId",
      });
    }
    await prisma.affirmationEntry
      .findMany({
        where: {
          user: {
            id: parseInt(userId),
          },
        },
      })
      .then((affirmationEntry) => {
        res.send(affirmationEntry);
      })
      .catch((err) => res.status(500).send(err));
  });

  /**
   * Get affirmation entries by id
   */
  router.get("/get/:id", [verify], async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        error: "Please provide an id",
      });
    }
    await prisma.affirmationEntry
      .findUnique({
        where: {
          id: parseInt(id),
        },
      })
      .then((affirmationEntry) => {
        res.send(affirmationEntry);
      })
      .catch((err) => res.status(500).send(err));
  });

  /**
   * Update an affirmation entry by id
   */
  router.put(
    "/update/:userId/:affirmationId",
    [verify],
    async (req: Request, res: Response) => {
      const { userId, affirmationId } = req.params;
      const { affirmation, date } = req.body;
      if (!userId || !affirmation || !date) {
        return res.status(400).send({
          error: "Please provide a userId, affirmation, and date",
        });
      }
      await prisma.affirmationEntry
        .update({
          where: {
            id: parseInt(affirmationId),
          },
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
        })
        .catch((err) => res.status(500).send(err));
    }
  );

  return router;
};

export default affirmationRouter;
