import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import admin from "../middleware/admin";
import verify from "../middleware/verify";

const moodRouter = (prisma: PrismaClient) => {
  const router = Router();

  /**
   * @desc Check mood endpoint
   * @method GET
   * @route /api/mood
   * @privacy public
   */
  router.get("/", async (req: Request, res: Response) => {
    res.send("Mood Endpoint");
  });

  /**
   * @desc Get all mood entries
   * @method GET
   * @privacy private: only admins can access this endpoint
   * @route /api/mood/all
   */
  router.get("/all", [admin], async (req: Request, res: Response) => {
    let moodEntries = await prisma.moodEntry.findMany();
    res.send(moodEntries);
  });

  /**
   * @desc Create a new mood entry for a user id
   * @method POST
   * @privacy private: only a verified user can access this endpoint
   * @route /api/mood/create/:userId
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
   * @desc Get mood entries for user by id
   * @method GET
   * @privacy private: only a verified user can access this endpoint
   * @route /api/mood/user/:userId
   */
  router.get("/user/:userId", [verify], async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).send({
        error: "Please provide a userId",
      });
    }
    await prisma.moodEntry
      .findMany({
        where: {
          user: {
            id: parseInt(userId),
          },
        },
      })
      .then((moodEntries) => {
        res.send(moodEntries);
      })
      .catch((err) => res.status(500).send(err));
  });

  /**
   * @desc Get a mood entry by an id
   * @method GET
   * @privacy private: only a verified user can access this endpoint
   * @route /api/mood/get/:id
   */
  router.get("/get/:moodId", [verify], async (req: Request, res: Response) => {
    const { moodId } = req.params;
    if (!moodId) {
      return res.status(400).send({
        error: "Please provide a moodId",
      });
    }
    await prisma.moodEntry
      .findUnique({
        where: {
          id: parseInt(moodId),
        },
      })
      .then((moodEntry) => {
        res.send(moodEntry);
      })
      .catch((err) => res.status(500).send(err));
  });

  /**
   * @desc Update a mood entry by id
   * @method PUT
   * @privacy private: only a verified user can access this endpoint
   * @route api/mood/update/:id
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
   * @desc Delete a mood entry by id
   * @method DELETE
   * @privacy private: only a verified user can access this endpoint
   * @route api/mood/delete/:id
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
