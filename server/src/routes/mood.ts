import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import verify from "../middleware/verify";

const moodRouter = (prisma: PrismaClient) => {
  const router = Router();

  router.get("/", async (req: Request, res: Response) => {
    let moodEntries = await prisma.moodEntry.findMany();
    res.send(moodEntries);
  });

  router.post(
    "/create/:userId",
    [verify],
    async (req: Request, res: Response) => {
      const { userId } = req.params;
      const { mood, date, emotions, moodScore } = req.body;
      if (!userId || !mood || !date) {
        return res.status(400).send({
          error: "Please provide a userId, mood, and date",
        });
      }
      await prisma.moodEntry
        .create({
          data: {
            user: {
              connect: {
                id: parseInt(userId),
              },
            },
            mood: mood,
            date: date,
            emotions: emotions.split(","),
            moodScore: parseInt(moodScore),
          },
        })
        .then((moodEntry) => {
          res.send(moodEntry);
        })
        .catch((err) => res.status(500).send(err));
    }
  );
  return router;
};

export default moodRouter;
