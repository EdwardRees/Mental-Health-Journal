import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import admin from "../middleware/admin";
import verify from "../middleware/verify";
import optional from "../middleware/optional";

const tagRouter = (prisma: PrismaClient) => {
  const router = Router();

  router.get("/", async (req: Request, res: Response) =>
    res.send("Tag Endpoint")
  );

  router.get("/all", async (req: Request, res: Response) => {
    let tags = await prisma.tag.findMany();
    res.send(tags);
  });

  router.post("/create", async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({
        error: "Please provide all required fields",
      });
    }
    let tag = await prisma.tag.findMany({ where: { name } });
    if (tag.length > 0) {
      return res.status(400).send({
        error: "Tag already exists",
      });
    }
    await prisma.tag
      .create({
        data: {
          name,
        },
      })
      .then((tag) => res.send(tag))
      .catch((err) => res.status(500).send(err));
  });

  router.post("/update", async (req: Request, res: Response) => {
    const { id, name } = req.body;
    if (!id || !name) {
      return res.status(400).send({
        error: "Please provide all required fields",
      });
    }
    await prisma.tag
      .update({
        where: {
          id: parseInt(id),
        },
        data: {
          name,
        },
      })
      .then((tag) => res.send(tag))
      .catch((err) => res.status(500).send(err));
  });

  // TODO - change privacy?
  router.delete("/delete", async (req: Request, res: Response) => {
    const { id } = req.body;
    if (!id) {
      return res.status(400).send({
        error: "Please provide all required fields",
      });
    }
    await prisma.hasTag.deleteMany({ where: { tagId: parseInt(id) } });
    await prisma.tag
      .delete({
        where: {
          id: parseInt(id),
        },
      })
      .then((tag) => res.send(tag))
      .catch((err) => res.status(500).send(err));
  });

  router.put("/attach", [verify], async (req: any, res: Response) => {
    const { user } = req.user;
    const { userId } = user;
    const { tagId, postId } = req.body;
    if (!userId || !tagId || !postId) {
      return res.status(400).send({
        error: "Please provide all required fields",
      });
    }
    let post = await prisma.blogPost.findMany({
      where: { id: parseInt(postId), authorId: parseInt(userId) },
    });
    if (!post) {
      return res.status(400).send({
        error: "Post not found",
      });
    }
    let tag = await prisma.tag.findMany({
      where: { id: parseInt(tagId) },
    });
    if (!tag) {
      return res.status(400).send({
        error: "Tag not found",
      });
    }
    let previouslyAttached = await prisma.hasTag.findMany({
      where: {
        tagId: parseInt(tagId),
        postId: parseInt(postId),
      },
    });
    if (previouslyAttached.length > 0) {
      return res.status(400).send({
        error: "Tag already attached to post",
      });
    }
    let attachedPost = await prisma.hasTag.create({
      data: {
        tagId: parseInt(tagId),
        postId: parseInt(postId),
      },
    });
    await prisma.blogPost.update({
      where: { id: parseInt(postId) },
      data: {
        tags: {
          connect: {
            id: attachedPost.id,
          },
        },
      },
    });
    res.send(attachedPost);
  });

  router.put("/detach", [verify], async (req: any, res: Response) => {
    const { user } = req.user;
    const { userId } = user;
    const { tagId, postId } = req.body;
    if (!userId || !tagId || !postId) {
      return res.status(400).send({
        error: "Please provide all required fields",
      });
    }
    let post = await prisma.blogPost.findMany({
      where: { id: parseInt(postId), authorId: parseInt(userId) },
    });
    if (!post) {
      return res.status(400).send({
        error: "Post not found",
      });
    }
    let tag = await prisma.tag.findMany({
      where: { id: parseInt(tagId) },
    });
    if (!tag) {
      return res.status(400).send({
        error: "Tag not found",
      });
    }
    let previouslyAttached = await prisma.hasTag.findMany({
      where: {
        tagId: parseInt(tagId),
        postId: parseInt(postId),
      },
    });
    if (previouslyAttached.length === 0) {
      return res.status(400).send({
        error: "Tag not attached to post",
      });
    }
    let detachedPost = await prisma.hasTag.deleteMany({
      where: {
        tagId: parseInt(tagId),
        postId: parseInt(postId),
      },
    });
    res.send(detachedPost);
  });

  router.get("/:id", [optional], async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        error: "Please provide all required fields",
      });
    }
    await prisma.tag
      .findMany({
        where: {
          id: parseInt(id),
        },
      })
      .then((tag) => res.send(tag))
      .catch((err) => res.status(500).send(err));
  });

  router.get("/posts/:id", [optional], async (req: any, res: Response) => {
    const { user } = req.user;
    const { userId } = user;
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        error: "Please provide all required fields",
      });
    }
    let tagged = await prisma.hasTag.findMany({
      where: {
        tagId: parseInt(id),
      },
    });
    if (!tagged) {
      return res.status(400).send({
        error: "Tag not found",
      });
    }
    let posts = [] as any;
    for (let tag in tagged) {
      let post: any = await prisma.blogPost.findUnique({
        where: {
          id: tagged[tag].postId,
        },
      });
      if (post !== null || post !== undefined) {
        if (post.published === true) {
          posts.push(post);
        } else if (user !== undefined || user !== null) {
          if (post.authorId === parseInt(userId)) {
            posts.push(post);
          }
        }
      }
    }
    res.send(posts);
  });

  return router;
};

export default tagRouter;
