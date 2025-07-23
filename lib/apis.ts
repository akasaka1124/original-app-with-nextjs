import prisma from "@/lib/prisma";

export async function fetchDashboard() {
  const email = "user+1@example.com";
  try {
    return await prisma.user.findFirstOrThrow({
      where: { email },
      select: {
        id: true,
        name: true,
        image: true,
        description: true,
        posts: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch.");
  }
}

export async function fetchPosts() {
  try {
    return await prisma.post.findMany({
      select: {
        id: true,
        caption: true,
        image: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch posts.");
  }
}

export async function fetchPost(id: string) {
  try {
    return await prisma.post.findFirstOrThrow({
      where: { id },
      select: {
        id: true,
        image: true,
        caption: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            description: true,
          },
        },
        comments: {
          select: {
            id: true,
            text: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                image: true,
                description: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch post.");
  }
}

export async function fetchUsers() {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        image: true,
        description: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch users.");
  }
}

export async function fetchUser(id: string) {
  try {
    return await prisma.user.findFirstOrThrow({
      where: { id },
      select: {
        id: true,
        name: true,
        image: true,
        description: true,
        posts: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function fetchMe() {
  const email = "user+1@example.com";
  try {
    return await prisma.user.findFirstOrThrow({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        description: true,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Me.");
  }
}
