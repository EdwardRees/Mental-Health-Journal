import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import admin from "../middleware/admin";
import verify from "../middleware/verify";

/**
 * Router to handle Gratitude journal components
 * @param prisma Prisma Client to access database
 */
const gratitudeRouter = (prisma: PrismaClient) => {
  const router = Router();

  /**
   * @desc Check Gratitude journal endpoint
   * @method GET
   * @route /api/gratitude
   * @privacy public
   */
  router.get("/", async (req: Request, res: Response) => {
    res.send("Gratitude Endpoint");
  });

  /**
   * @desc Get all gratitude entries
   * @method GET
   * @route /api/gratitude/all
   * @privacy private: only admins can access this endpoint
   */
  router.get("/all", [admin], async (req: Request, res: Response) => {
    let gratitudeEntries = await prisma.gratitudeEntry.findMany();
    res.send(gratitudeEntries);
  });

  /**
   * @desc Create a gratitude entry for a user id
   * @method POST
   * @route /api/gratitude/create/:userId
   * @privacy private: only a verified user can access this endpoint
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
   * @desc Get gratitude entries for user by id
   * @method GET
   * @route /api/gratitude/user/:userId
   * @privacy private: only a verified user can access this endpoint
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
   * @desc Get gratitude entry by id
   * @method GET
   * @route /api/gratitude/get/:id
   * @privacy private: only a verified user can access this endpoint
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
   * @desc Update a gratitude entry
   * @method PUT
   * @route /api/gratitude/update/:userId/:gratitudeId
   * @privacy private: only a verified user can access this endpoint
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

  /**
   * @desc Delete a gratitude entry
   * @method DELETE
   * @route /api/gratitude/delete/:gratitudeId
   * @privacy private: only a verified user can access this endpoint
   */
  router.delete(
    "/delete/:gratitudeId",
    [verify],
    async (req: Request, res: Response) => {
      const { gratitudeId } = req.params;
      if (!gratitudeId) {
        return res.status(400).send({
          error: "Please provide an id",
        });
      }
      await prisma.gratitudeEntry
        .delete({
          where: {
            id: parseInt(gratitudeId),
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
