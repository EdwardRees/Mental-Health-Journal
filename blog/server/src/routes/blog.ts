import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import admin from "../middleware/admin";
import verify from "../middleware/verify";
import optional from "../middleware/optional";

const blogRouter = (prisma: PrismaClient) => {
  const router = Router();

  router.get("/", async (req: Request, res: Response) =>
    res.send("Blog Endpoint")
  );

  router.get("/all", [admin], async (req: Request, res: Response) => {
    let blogs = await prisma.blogPost.findMany();
    res.send(blogs);
  });

  router.post("/create", [verify], async (req: any, res: Response) => {
    const { user } = req.user;
    const { userId } = user;
    const { title, content } = req.body;
    if (!userId || !title || !content) {
      return res.status(400).send({
        error: "Please provide all required fields",
      });
    }
    let author = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });
    if (!author) {
      return res.status(400).send({
        error: "User not found",
      });
    }
    const { firstName, lastName } = author;
    const authorName = `${firstName} ${lastName}`;
    await prisma.blogPost
      .create({
        data: {
          title,
          content,
          authorName: authorName,
          authorId: parseInt(userId),
          likes: {
            create: [],
          },
          comments: {
            create: [],
          },
          tags: {
            create: [],
          },
          categories: {
            create: [],
          },
        },
      })
      .then((blogPost) => res.send(blogPost))
      .catch((err) => res.status(500).send(err));
  });

  router.put("/publish", [verify], async (req: any, res: Response) => {
    const { user } = req.user;
    const { userId } = user;
    const { id } = req.body;
    if (!userId || !id) {
      return res.status(400).send({
        error: "Please provide all required fields",
      });
    }
    await prisma.blogPost
      .updateMany({
        where: {
          id: parseInt(id),
          authorId: parseInt(userId),
        },
        data: {
          published: true,
          updatedAt: new Date(),
        },
      })
      .then((blogPost) => res.send(blogPost))
      .catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
  });
  router.put("/unpublish", [verify], async (req: any, res: Response) => {
    const { user } = req.user;
    const { userId } = user;
    const { id } = req.body;
    if (!userId || !id) {
      return res.status(400).send({
        error: "Please provide all required fields",
      });
    }
    await prisma.blogPost
      .updateMany({
        where: {
          id: parseInt(id),
          authorId: parseInt(userId),
        },
        data: {
          published: false,
          updatedAt: new Date(),
        },
      })
      .then((blogPost) => res.send(blogPost))
      .catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  router.get("/published", async (req: Request, res: Response) => {
    let blogs = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
    });
    res.send(blogs);
  });

  /**
   * @route GET /api/blog/:id
   * @desc Get blog post by id
   * @access Protected; If the user is logged in and not the author of the blog post and not published, they will not be able to access the blog post. If the user is logged in and the author of the blog post, they will be able to view the blog post. If the user is not logged in, they will not be able to view the blog post.
   */
  router.get("/:id", [optional], async (req: any, res: Response) => {
    const { id } = req.params;
    let blog = await prisma.blogPost.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!blog) {
      return res.status(400).send({
        error: "Blog not found",
      });
    }
    if (!blog.published && req.user === null) {
      return res.status(401).send({
        error: "Blog not published. Log in to view or publish.",
      });
    }
    if (!blog.published && req.user.user.userId !== blog.authorId) {
      return res.status(403).send({
        error: "Blog not published. Log in to publish.",
      });
    }
    return res.send(blog);
  });

  router.delete("/delete/:id", [verify], async (req: any, res: Response) => {
    const { user } = req.user;
    const { userId } = user;
    const { id } = req.params;
    if (!userId || !id) {
      return res.status(400).send({
        error: "Please provide all required fields",
      });
    }
    let blog = await prisma.blogPost.findMany({
      where: {
        id: parseInt(id),
        authorId: parseInt(userId),
      },
    });
    if (blog.length === 0) {
      return res.status(400).send({
        error: "Blog not found",
      });
    }
    await prisma.blogPost
      .deleteMany({
        where: {
          id: parseInt(id),
          authorId: parseInt(userId),
        },
      })
      .then((blogPost) => res.send(blogPost))
      .catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
  });

  router.post("/getLikes", [optional], async (req: any, res: Response) => {
    const { user } = req.user;
    const { userId } = user;
    const { id } = req.body;
    if (!id) {
      return res.status(400).send({
        error: "Please provide all required fields",
      });
    }
    let blog = await prisma.blogPost.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!blog) {
      return res.status(400).send({
        error: "Blog not found",
      });
    }
    if (!blog.published && req.user === null) {
      return res.status(401).send({
        error: "Blog not published. Log in to view or publish.",
      });
    }
    if (!blog.published && req.user.user.userId !== blog.authorId) {
      return res.status(403).send({
        error: "Blog not published. Log in to publish.",
      });
    }
    let likes = await prisma.like.findMany({
      where: {
        postId: parseInt(id),
      },
    });
    return res.send(likes);
  });

  router.post("/getComments",[optional], async (req: any, res: Response) => {
    const { user } = req.user;
    const { userId } = user;
    const { id } = req.body;
    if (!id) {
      return res.status(400).send({
        error: "Please provide all required fields",
      });
    }
    let blog = await prisma.blogPost.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!blog) {
      return res.status(400).send({
        error: "Blog not found",
      });
    }
    if (!blog.published && req.user === null) {
      return res.status(401).send({
        error: "Blog not published. Log in to view or publish.",
      });
    }
    if (!blog.published && req.user.user.userId !== blog.authorId) {
      return res.status(403).send({
        error: "Blog not published. Log in to publish.",
      });
    }
    let comments = await prisma.comment.findMany({
      where: {
        postId: parseInt(id),
      },
    });
    return res.send(comments);
  });

  router.post("/getTags", [optional], async (req: any, res: Response) => {
    const { user } = req.user;
    const { userId } = user;
    const { id } = req.body;
    if (!id) {
      return res.status(400).send({
        error: "Please provide all required fields",
      });
    }
    let blog = await prisma.blogPost.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!blog) {
      return res.status(400).send({
        error: "Blog not found",
      });
    }
    if (!blog.published && req.user === null) {
      return res.status(401).send({
        error: "Blog not published. Log in to view or publish.",
      });
    }
    if (!blog.published && req.user.user.userId !== blog.authorId) {
      return res.status(403).send({
        error: "Blog not published. Log in to publish.",
      });
    }
    let tags = await prisma.tag.findMany({
      where: {
        posts: {
          some: {
            postId: parseInt(id),
          }
        }
      }
    });
    return res.send(tags);
  });

  return router;
};

export default blogRouter;
