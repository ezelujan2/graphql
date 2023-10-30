const Post = {
  async comments(parent, args, { prisma }, info) {
    return await prisma.comment.findMany({
      where: {
        postId: parent.id,
      },
    });
  },
  async author(parent, args, { prisma }, info) {
    const author = await prisma.user.findUnique({
      where: {
        id: parent.authorId,
      },
    });
    return author;
  },
};

export { Post as default };
