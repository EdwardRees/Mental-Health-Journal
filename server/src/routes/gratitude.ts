import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import verify from "../middleware/verify";

/**
 * Router to handle Gratitude journal components
 * @param prisma Prisma Client to access database
 */
const gratitudeRouter = (prisma: PrismaClient) => {
  const router = Router();

  router.get("/", async (req: Request, res: Response) => {
    let gratitudeEntries = await prisma.gratitudeEntry.findMany();
    res.send(gratitudeEntries);
  });

  /**
   * Create a gratitude entry for a user id
   */
  router.post(
    "/create/:userId",
    [verify],
    async (req: Request, res: Response) => {
      const { userId } = req.params;
      const { gratitude, date } = req.body;
      if (!userId || !gratitude || !date) {
        return res.status(400).send({
          error: "Please provide a userId, gratitude, and date",
        });
      }
      await prisma.gratitudeEntry
        .create({
          data: {
            user: {
              connect: {
                id: parseInt(userId),
              },
            },
            gratitude: gratitude,
            date: date,
          },
        })
        .then((gratitudeEntry) => {
          res.send(gratitudeEntry);
        })
        .catch((err) => res.status(500).send(err));
    }
  );

  /**
   * Get gratitude entries for user by id
   */
  router.get("/user/:userId", [verify], async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).send({
        error: "Please provide a userId",
      });
    }
    await prisma.gratitudeEntry
      .findMany({
        where: {
          user: {
            id: parseInt(userId),
          },
        },
      })
      .then((gratitudeEntries) => {
        res.send(gratitudeEntries);
      })
      .catch((err) => res.status(500).send(err));
  });

  /**
   * Get gratitude entry by id
   */
  router.get("/get/:id", [verify], async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        error: "Please provide an id",
      });
    }
    await prisma.gratitudeEntry
      .findUnique({
        where: {
          id: parseInt(id),
        },
      })
      .then((gratitudeEntry) => {
        res.send(gratitudeEntry);
      })
      .catch((err) => res.status(500).send(err));
  });

  /**
   * Update a gratitude entry
   */
  router.put(
    "/update/:userId/:gratitudeId",
    [verify],
    async (req: Request, res: Response) => {
      const { userId, gratitudeId } = req.params;
      const { gratitude, date } = req.body;
      if (!userId || !gratitude || !date) {
        return res.status(400).send({
          error: "Please provide a userId, gratitude, and date",
        });
      }
      await prisma.gratitudeEntry
        .update({
          where: {
            id: parseInt(gratitudeId),
          },
          data: {
            user: {
              connect: {
                id: parseInt(userId),
              },
            },
            gratitude: gratitude,
            date: date,
          },
        })
        .then((gratitudeEntry) => {
          res.send(gratitudeEntry);
        })
        .catch((err) => res.status(500).send(err));
    }
  );

  return router;
};

export default gratitudeRouter;
