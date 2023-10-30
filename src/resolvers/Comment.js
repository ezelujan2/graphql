const Comment = {
  async post(parent, args, { prisma }, info) {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(parent.postId, 10),
      },
    });
    return post;
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

export { Comment as default };
