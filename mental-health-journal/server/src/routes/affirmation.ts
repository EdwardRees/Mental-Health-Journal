import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import admin from "../middleware/admin";
import verify from "../middleware/verify";

/**
 * Affirmation router
 * @param prisma Prisma client to access the database
 */
const affirmationRouter = (prisma: PrismaClient) => {
  const router = Router();

  /**
   * @desc Check affirmation endpoint
   * @method GET
   * @route /api/affirmation
   * @privacy public
   */
  router.get("/", async (req: Request, res: Response) => {
    res.send("Affirmation Endpoint");
  });

  /**
   * @desc Get all affirmation entries
   * @method GET
   * @route /api/affirmation/all
   * @privacy private: only admins can access this endpoint
   */
  router.get("/all", [admin], async (req: Request, res: Response) => {
    let affirmationEntries = await prisma.affirmationEntry.findMany();
    res.send(affirmationEntries);
  });

  /**
   * @desc Create a affirmation entry for a user id
   * @method POST
   * @route /api/affirmation/create/:userId
   * @privacy private: only a verified user can access this endpoint
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
   * @desc Get affirmation entries for user by id
   * @method GET
   * @route /api/affirmation/user/:userId
   * @privacy private: only a verified user can access this endpoint
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
   * @desc Get affirmation entries by id
   * @method GET
   * @route /api/affirmation/get/:id
   * @privacy private: only a verified user can access this endpoint
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
   * @desc Update an affirmation entry by id
   * @method PUT
   * @route /api/affirmation/update/:userId/:affirmationId
   * @privacy private: only a verified user can access this endpoint
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

  /**
   * @desc Delete an affirmation entry by id
   * @method DELETE
   * @route /api/affirmation/delete/:affirmationId
   * @privacy private: only a verified user can access this endpoint
   */
  router.delete(
    `/delete/:id`,
    [verify],
    async (req: Request, res: Response) => {
      const { id } = req.params;
      if (!id) {
        return res.status(400).send({
          error: "Please provide an id",
        });
      }
      await prisma.affirmationEntry
        .delete({
          where: {
            id: parseInt(id),
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
