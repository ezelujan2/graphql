import { v4 as uuidv4 } from "uuid";

const Mutation = {
  async deleteComment(parent, args, { prisma, pubsub }, info) {
    const deletedComment = await prisma.comment.delete({
      where: {
        id: parseInt(args.id, 10),
      },
    });

    if (!deletedComment) throw new Error("Comment not found");

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment,
      },
    });

    return deletedComment;
  },
  async deletePost(parent, args, { prisma, pubsub }, info) {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(args.id, 10) },
    });
    if (!post) throw new Error("Post not found");

    await prisma.comment.deleteMany({
      where: {
        postId: parseInt(args.id, 10),
      },
    });

    const deletedPost = await prisma.post.delete({
      where: {
        id: parseInt(args.id, 10),
      },
    });

    if (deletedPost.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: deletedPost,
        },
      });
    }

    return deletedPost;
  },
  async deleteUser(parent, args, { prisma, pubsub }, info) {
    const deleteId = parseInt(args.id, 10);

    const deletedUser = await prisma.user.findUnique({
      where: { id: deleteId },
    });

    if (!deletedUser) throw new Error("User not Found");

    const posts = await prisma.post.findMany({
      where: { authorId: deleteId },
    });

    for (const post of posts) {
      await prisma.comment.deleteMany({
        where: { postId: post.id },
      });
    }

    await prisma.post.deleteMany({ where: { authorId: deleteId } });
    await prisma.comment.deleteMany({ where: { authorId: deleteId } });

    const deletion = await prisma.user.delete({
      where: {
        id: deleteId,
      },
    });

    pubsub.publish("Users", {
      mutation: "DELETED",
      data: deletion,
    });

    return deletion;
  },
  async updateUser(parent, args, { prisma }, info) {
    let user = await prisma.user.findUnique({
      where: {
        id: parseInt(args.id, 10),
      },
    });
    let updates = { ...args.data };

    if (!user) throw new Error("User not found");

    if (typeof args.data.email === "string") {
      const emailTaken = await prisma.user.findUnique({
        where: { email: args.data.email },
      });
      if (emailTaken) throw new Error("Email already taken");
    }

    return await prisma.user.update({
      where: { id: parseInt(args.id, 10) },
      data: updates,
    });
  },
  async createComment(parent, args, { pubsub, prisma }, info) {
    const userExist = await prisma.user.findUnique({
      where: {
        id: parseInt(args.comment.author, 10),
      },
    });

    if (!userExist) throw new Error("User not found");

    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(args.comment.post, 10),
      },
    });

    if (post && post.published) {
      const comment = prisma.comment.create({
        data: {
          text: args.comment.text,
          authorId: parseInt(args.comment.author, 10),
          postId: parseInt(args.comment.post, 10),
        },
      });

      pubsub.publish(`comment ${args.comment.post}`, {
        comment: {
          mutation: "CREATED",
          data: comment,
        },
      });
      return comment;
    } else throw new Error("Post not found or published");
  },
  async updateComment(parent, args, { prisma, pubsub }, info) {
    const comment = prisma.comment.update({
      where: {
        id: parseInt(args.id, 10),
      },
      data: args.data,
    });

    if (!comment) throw new Error("Comment not found");

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment,
      },
    });

    return comment;
  },
  async createUser(parent, args, { db, prisma }, info) {
    const emailTaken = await prisma.user.findUnique({
      where: {
        email: args.data.email,
      },
    });

    if (emailTaken) {
      throw new Error("Email is already taken.");
    }

    const user = await prisma.user.create({
      data: args.data,
    });
    return user;
  },
  async createPost(parent, args, { prisma, pubsub }, info) {
    const userExist = await prisma.user.findUnique({
      where: {
        id: parseInt(args.post.author, 10),
      },
    });

    if (!userExist) throw new Error("User not found");

    const newPost = await prisma.post.create({
      data: {
        title: args.post.title,
        body: args.post.body,
        authorId: parseInt(args.post.author, 10),
        published: args.post.published,
      },
    });

    if (args.post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: newPost,
        },
      });
    }

    return newPost;
  },
  async updatePost(parent, args, { pubsub, prisma }, info) {
    const postId = parseInt(args.id, 10);
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const updates = { ...args.data };

    if (typeof updates.published === "boolean") {
      if (post.published !== updates.published) {
        pubsub.publish("post", {
          post: {
            mutation: updates.published ? "CREATED" : "DELETED",
            data: post,
          },
        });
      }
    } else if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post,
        },
      });
    }

    return prisma.post.update({
      where: { id: postId },
      data: updates,
    });
  },
};

export { Mutation as default };
