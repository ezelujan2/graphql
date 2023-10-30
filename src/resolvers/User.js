const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const User = {
  posts(parent, args, context, info) {
    return prisma.post.findMany({
      where: {
        authorId: parent.id,
      },
    });
  },
  comments(parent, args, context, info) {
    return prisma.comment.findMany({
      where: {
        authorId: parent.id,
      },
    });
  },
};

export { User as default };
