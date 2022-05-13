import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import admin from "../middleware/admin";
import verify from "../middleware/verify";

/**
 *
 * @param prisma Prisma client to access the database
 * @returns router with all the routes for General Journal Entries
 */
const generalEntryRouter = (prisma: PrismaClient) => {
  const router = Router();

  /**
   * @desc Check general entry endpoint
   * @method GET
   * @route /api/generalEntry
   * @privacy public
   */
  router.get("/", async (req: Request, res: Response) =>
    res.send("General Journal Endpoint")
  );

  /**
   * @desc Get all general entries
   * @method GET
   * @route /api/generalEntry/all
   * @privacy private: only admins can access this endpoint
   */
  router.get("/all", [admin], async (req: Request, res: Response) => {
    let generalEntries = await prisma.generalEntry.findMany();
    res.send(generalEntries);
  });

  /**
   * @desc Create a general entry for a user id
   * @method POST
   * @route /api/generalEntry/create/:userId
   * @privacy private: only a verified user can access this endpoint
   */
  router.post(
    "/create/:userId",
    [verify],
    async (req: Request, res: Response) => {
      const { userId } = req.params;
      const { entryTitle, entryContent, date } = req.body;
      if (!userId || !entryTitle || !entryContent || !date) {
        return res.status(400).send({
          error: "Please provide a userId, entryTitle, entryContent, and date",
        });
      }
      await prisma.generalEntry
        .create({
          data: {
            user: {
              connect: {
                id: parseInt(userId),
              },
            },
            title: entryTitle,
            content: entryContent,
            date: date,
          },
        })
        .then((entry) => {
          res.send(entry);
        })
        .catch((err) => res.status(500).send(err));
    }
  );

  /**
   * @desc Get general entries for user by id
   * @method GET
   * @route /api/generalEntry/user/:userId
   * @privacy private: only a verified user can access this endpoint
   */
  router.get("/user/:userId", [verify], async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).send({
        error: "Please provide a userId",
      });
    }
    await prisma.generalEntry
      .findMany({
        where: {
          user: {
            id: parseInt(userId),
          },
        },
      })
      .then((entries) => {
        res.send(entries);
      })
      .catch((err) => res.status(500).send(err));
  });

  /**
   * @desc Get general entry by id
   * @method GET
   * @route /api/generalEntry/get/:id
   * @privacy private: only a verified user can access this endpoint
   */
  router.get("/get/:id", [verify], async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        error: "Please provide an id",
      });
    }
    await prisma.generalEntry
      .findUnique({
        where: {
          id: parseInt(id),
        },
      })
      .then((entry) => {
        res.send(entry);
      })
      .catch((err) => res.status(500).send(err));
  });

  /**
   * @desc Update a general entry by id
   * @method PUT
   * @route /api/generalEntry/update/:userId/:entryId
   * @privacy private: only a verified user can access this endpoint
   */
  router.put(
    "/update/:userId/:entryId",
    [verify],
    async (req: Request, res: Response) => {
      const { userId, entryId } = req.params;
      const { entryTitle, entryContent, date } = req.body;
      if (!userId || !entryId || !entryTitle || !entryContent || !date) {
        return res.status(400).send({
          error:
            "Please provide a userId, entryId, entryTitle, entryContent, and date",
        });
      }
      await prisma.generalEntry
        .update({
          where: {
            id: parseInt(entryId),
          },
          data: {
            user: {
              connect: {
                id: parseInt(userId),
              },
            },
            title: entryTitle,
            content: entryContent,
            date: date,
          },
        })
        .then((entry) => {
          res.send(entry);
        })
        .catch((err) => res.status(500).send(err));
    }
  );

  /**
   * @desc Delete a general entry by id
   * @method DELETE
   * @route /api/generalEntry/delete/:entryId
   * @privacy private: only a verified user can access this endpoint
   */
  router.delete(
    "/delete/:entryId",
    [verify],
    async (req: Request, res: Response) => {
      const { entryId } = req.params;
      if (!entryId) {
        return res.status(400).send({
          error: "Please provide an id",
        });
      }
      await prisma.generalEntry
        .delete({
          where: {
            id: parseInt(entryId),
          },
        })
        .then((entry) => {
          res.send(entry);
        })
        .catch((err) => res.status(500).send(err));
    }
  );

  return router;
};

export default generalEntryRouter;
