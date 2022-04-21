import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import verify from "../middleware/verify";

const moodRouter = (prisma: PrismaClient) => {
  const router = Router();

  router.get("/", async (req: Request, res: Response) => {
    let moodEntries = await prisma.moodEntry.findMany();
    res.send(moodEntries);
  });

  /**
   * @route GET /mood/:id Get mood entry by id
   */
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

  /**
   * @route PUT api/mood/update/:id
   */
  router.put("/update/:id", [verify], async (req: Request, res: Response) => {
    const { id } = req.params;
    const { mood, date, emotions, moodScore } = req.body;
    if (!id || !mood || !date) {
      return res.status(400).send({
        error: "Please provide an id, mood, and date",
      });
    }
    await prisma.moodEntry
      .update({
        where: {
          id: parseInt(id),
        },
        data: {
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
  });

  /**
   * @route DELETE api/mood/delete/:id
   */
  router.delete(
    "/delete/:id",
    [verify],
    async (req: Request, res: Response) => {
      const { id } = req.params;
      if (!id) {
        return res.status(400).send({
          error: "Please provide an id",
        });
      }
      await prisma.moodEntry
        .delete({
          where: {
            id: parseInt(id),
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
