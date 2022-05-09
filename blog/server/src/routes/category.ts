import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import admin from "../middleware/admin";
import verify from "../middleware/verify";
import optional from "../middleware/optional";

const categoryRouter = (prisma: PrismaClient) => {
  const router = Router();

  router.get("/", async (req: Request, res: Response) =>
    res.send("Category Endpoint")
  );

  router.get("/all", async (req: Request, res: Response) => {
    let categories = await prisma.category.findMany();
    res.send(categories);
  });

  router.post("/new", async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({
        error: "Please provide all required fields",
      });
    }
    await prisma.category
      .create({
        data: {
          name,
        },
      })
      .then((category) => res.send(category))
      .catch((err) => res.status(500).send(err));
  });

  router.post("/update", async (req: Request, res: Response) => {
    const { id, name } = req.body;
    if (!id || !name) {
      return res.status(400).send({
        error: "Please provide all required fields",
      });
    }
    await prisma.category
      .update({
        where: {
          id: parseInt(id),
        },
        data: {
          name,
        },
      })
      .then((category) => res.send(category))
      .catch((err) => res.status(500).send(err));
  });

  router.post("/delete", async (req: Request, res: Response) => {
    const { id } = req.body;
    if (!id) {
      return res.status(400).send({
        error: "Please provide all required fields",
      });
    }
    await prisma.category
      .delete({
        where: {
          id: parseInt(id),
        },
      })
      .then((category) => res.send(category))
      .catch((err) => res.status(500).send(err));
  });

  router.put("/attach", [verify], async (req: any, res: Response) => {
    const { user } = req.user;
    const { userId } = user;
    const { categoryId, postId } = req.body;
    if (!userId || !categoryId || !postId) {
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
    let category = await prisma.category.findMany({
      where: { id: parseInt(categoryId) },
    });
    if (!category) {
      return res.status(400).send({
        error: "Category not found",
      });
    }
    let previouslyAttached = await prisma.hasCategory.findMany({
      where: {
        categoryId: parseInt(categoryId),
      },
    });

    if (previouslyAttached.length > 0) {
      return res.status(400).send({
        error: "Category already attached to post",
      });
    }
    let attachedPost = await prisma.hasCategory.create({
      data: {
        categoryId: parseInt(categoryId),
        postId: parseInt(postId),
      },
    });
    res.send(attachedPost);
  });

  router.put("/detach", [verify], async (req: any, res: Response) => {
    const { user } = req.user;
    const { userId } = user;
    const { categoryId, postId } = req.body;
    if (!userId || !categoryId || !postId) {
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
    let category = await prisma.category.findMany({
      where: { id: parseInt(categoryId) },
    });
    if (!category) {
      return res.status(400).send({
        error: "Category not found",
      });
    }
    let previouslyAttached = await prisma.hasCategory.findMany({
      where: {
        categoryId: parseInt(categoryId),
        postId: parseInt(postId),
      },
    });
    if (previouslyAttached.length === 0) {
      return res.status(400).send({
        error: "Category not attached to post",
      });
    }
    let attachedPost = await prisma.hasCategory.deleteMany({
      where: {
        categoryId: parseInt(categoryId),
        postId: parseInt(postId),
      },
    });
    res.send(attachedPost);
  });

  router.get("/:id", [optional], async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        error: "Please provide all required fields",
      });
    }
    await prisma.category
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
    let categories = await prisma.hasCategory.findMany({
      where: {
        categoryId: parseInt(id),
      },
    });
    if (!categories) {
      return res.status(400).send({
        error: "Category not found",
      });
    }
    let posts = [] as any;
    for (let category in categories) {
      let post: any = await prisma.blogPost.findUnique({
        where: {
          id: categories[category].postId,
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

export default categoryRouter;
