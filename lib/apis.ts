import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function fetchDashboard() {
  const session = await auth();
  //sessionの取得をすることができる
  if (!session?.user?.email) throw new Error("Invalid Request");
  const email = session.user.email;
  try {
    const user = await prisma.user.findFirst({
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
    
    if (!user) {
      // ユーザーが見つからない場合は、新規ユーザーとして扱う
      return {
        id: "",
        name: session.user.name || "新規ユーザー",
        image: session.user.image || null,
        description: null,
        posts: [],
      };
    }
    
    return user;
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
  const session = await auth();
  //sessionの取得をすることができる
  if (!session?.user?.email) throw new Error("Invalid Request");
  const email = session.user.email;
  try {
    const user = await prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        description: true,
      },
    });
    
    if (!user) {
      // ユーザーが見つからない場合はエラーを投げる
      throw new Error("User not found. Please register first.");
    }
    
    return user;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Me.");
  }
}
