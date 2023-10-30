const Query = {
  async posts(parent, args, { db, prisma }, info) {
    if (args.query) {
      const posts = await prisma.post.findMany();
      return posts.filter((post) => {
        return (
          post.title.toLowerCase().includes(args.query.toLowerCase()) ||
          post.body.toLowerCase().includes(args.query.toLowerCase())
        );
      });
    } else return await prisma.post.findMany();
  },
  async users(parent, args, { prisma }, info) {
    const { query } = args;

    if (query) {
      return await prisma.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
      });
    } else {
      return await prisma.user.findMany();
    }
  },
  async comments(parent, args, { prisma }, info) {
    return await prisma.comment.findMany();
  },
  me() {
    return {
      id: "1234",
      name: "Mike",
      email: "mike@gmail.com",
    };
  },
  post() {
    return {
      id: "123",
      title: "Cronicas de Narnia",
      body: "Gran libro basado en el Leon",
      published: true,
    };
  },
};

export { Query as default };
