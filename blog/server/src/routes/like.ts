import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import admin from "../middleware/admin";
import verify from "../middleware/verify";

const likeRouter = (prisma: PrismaClient) => {
  const router = Router();

  router.get("/", async (req: Request, res: Response) =>
    res.send("Like Endpoint")
  );

  router.get("/all", [admin], async (req: Request, res: Response) => {
    let likes = await prisma.like.findMany();
    res.send(likes);
  });

  router.put("/like", [verify], async (req: any, res: Response) => {
    const { user } = req.user;
    const { userId } = user;
    const { postId } = req.body;
    if (!userId || !postId) {
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
    let userLiked = await prisma.like.findMany({
      where: {
        userId: parseInt(userId),
        postId: parseInt(postId),
      },
    });
    if (userLiked.length > 0) {
      return res.status(400).send({
        error: "User already liked this post",
      });
    }
    let like = await prisma.like.create({
      data: {
        postId: parseInt(postId),
        userId: parseInt(userId),
      },
    });
    await prisma.blogPost
      .update({
        where: { id: parseInt(postId) },
        data: {
          likes: {
            connect: {
              id: like.id,
            },
          },
        },
      })
      .then((blogPost) => res.send(blogPost))
      .catch((err) => res.status(500).send(err));
  });
  router.put("/unlike", [verify], async (req: any, res: Response) => {
    const { user } = req.user;
    const { userId } = user;
    const { postId } = req.body;
    if (!userId || !postId) {
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
    let userLiked = await prisma.like.findMany({
      where: {
        userId: parseInt(userId),
        postId: parseInt(postId),
      },
    });
    if (userLiked.length === 0) {
      return res.status(400).send({
        error: "User not liked this post",
      });
    }

    await prisma.like
      .deleteMany({
        where: {
          postId: parseInt(postId),
          userId: parseInt(userId),
        },
      })
      .then((unliked) => res.send(unliked))
      .catch((err) => res.status(500).send(err));
  });

  return router;
};

export default likeRouter;
