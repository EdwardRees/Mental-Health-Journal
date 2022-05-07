import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import admin from "../middleware/admin";
import verify from "../middleware/verify";

const commentRouter = (prisma: PrismaClient) => {
  const router = Router();

  router.get("/", async (req: Request, res: Response) =>
    res.send("Comment Endpoint")
  );

  router.get("/all", [admin], async (req: Request, res: Response) => {
    let comments = await prisma.comment.findMany();
    res.send(comments);
  });

  router.put("/create", [verify], async (req: any, res: Response) => {
    const { user } = req.user;
    const { userId } = user;
    const { postId, content } = req.body;
    if (!userId || !postId || !content) {
      return res.status(400).send({
        error: "Please provide all required fields",
      });
    }

    let post = await prisma.blogPost.findUnique({
      where: { id: parseInt(postId) },
    });
    if (!post) {
      return res.status(400).send({
        error: "Post not found",
      });
    }
    let comment = await prisma.comment.create({
      data: {
        postId: parseInt(postId),
        authorId: parseInt(userId),
        content: content,
      },
    });

    await prisma.blogPost.update({
      where: { id: parseInt(postId) },
      data: {
        comments: {
          connect: {
            id: comment.id,
          },
        },
      },
    });
    res.send(comment);
  });

  router.get("/:id", async (req: any, res: Response) => {
    const { id } = req.params;
    let comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });
    if (!comment) {
      return res.status(400).send({
        error: "Comment not found",
      });
    }
    return res.send(comment);
  });

  router.put("/update", [verify], async (req: any, res: Response) => {
    const { user } = req.user;
    const { userId } = user;
    const { commentId, content } = req.body;
    if (!userId || !commentId || !content) {
      return res.status(400).send({
        error: "Please provide all required fields",
      });
    }

    let comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
    });
    if (!comment) {
      return res.status(400).send({
        error: "Comment not found",
      });
    }
    if (comment.authorId !== parseInt(userId)) {
      return res.status(400).send({
        error: "You are not authorized to update this comment",
      });
    }
    await prisma.comment
      .update({
        where: { id: parseInt(commentId) },
        data: {
          content: content,
        },
      })
      .then((comment) => res.send(comment))
      .catch((err) => res.status(500).send(err));
  });

  router.delete("/delete/:id", [admin], async (req: any, res: Response) => {
    const { id } = req.params;
    let comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });
    if (!comment) {
      return res.status(400).send({
        error: "Comment not found",
      });
    }
    await prisma.comment
      .delete({
        where: { id: parseInt(id) },
      })
      .then((deleted) => res.send(deleted))
      .catch((err) => res.status(500).send(err));
  });

  return router;
};

export default commentRouter;
