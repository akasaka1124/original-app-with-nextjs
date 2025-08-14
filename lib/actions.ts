"use server";

import { auth, signIn, signOut } from "@/auth";
import prisma from "@/lib/prisma";
import { put } from "@vercel/blob";
import bcrypt from "bcrypt";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const RegisterUserSchema = z
  .object({
    name: z.string().min(1, "ユーザ名は必須です。"),
    email: z.string().email("メールアドレスの形式が正しくありません。"),
    password: z.string().min(8, "パスワードは8文字以上で設定してください。"),
    passwordConfirmation: z
      .string()
      .min(8, "確認用パスワードは8文字以上で設定してください。"),
  })
  .refine(
    (args) => {
      const { password, passwordConfirmation } = args;
      return password === passwordConfirmation;
    },
    {
      message: "パスワードと確認用パスワードが一致しません。",
      path: ["passwordConfirmation"],
    },
  )
  .refine(
    async (args) => {
      const { email } = args;
      const user = await prisma.user.findFirst({ where: { email } });
      return !user;
    },
    {
      message: "このメールアドレスはすでに使われています。",
      path: ["email"],
    },
  );
type RegisterUserState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    passwordConfirmation?: string[];
  };
  message?: string | null;
};

export async function registerUser(
  _state: RegisterUserState,
  formData: FormData,
): Promise<RegisterUserState> {
  const validatedFields = await RegisterUserSchema.safeParseAsync({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "ユーザー登録に失敗しました。",
    };
  }

  const { name, email, password } = validatedFields.data;

  const bcryptedPassword = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: bcryptedPassword,
      },
    });
    return {
      errors: {},
      message: "ユーザー登録に成功しました。",
    };
  } catch (error) {
    console.error(error);
    throw new Error("ユーザー登録に失敗しました。");
  }
}

export async function updatePost(id: string, formData: FormData) {
  const caption = formData.get("caption") as string;

  const post = await prisma.post.findFirstOrThrow({
    where: { id },
  });

  await prisma.post.update({
    where: { id: post.id },
    data: {
      caption,
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deletePost(id: string, _formData: FormData) {
  const post = await prisma.post.findFirstOrThrow({
    where: { id },
  });

  await prisma.post.delete({
    where: { id: post.id },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function createComment(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Invalid Request");
  const email = session.user.email;
  const user = await prisma.user.findFirstOrThrow({
    where: { email },
  });
  const text = formData.get("text") as string;

  const post = await prisma.post.findFirstOrThrow({
    where: { id },
  });

  await prisma.comment.create({
    data: {
      text,
      postId: post.id,
      userId: user.id,
    },
  });
  revalidatePath("/posts/" + id);
  redirect("/posts/" + id);
}

export async function updateMe(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Invalid Request");
  const currentEmail = session.user.email;
  const user = await prisma.user.findFirstOrThrow({
    where: { email: currentEmail },
  });
  const data: {
    name: string;
    email: string;
    description: string | null;
    image?: string; // imageをオプショナルにする
  } = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    description: formData.get("description") as string | null,
  };
  const imageFile = formData.get("image") as File;
  if (imageFile.size > 0) {
    const blob = await put(imageFile.name, imageFile, {
      access: "public",
      addRandomSuffix: true, // Ensure unique file names
    });
    data.image = blob.url;
  }

  await prisma.user.update({
    where: { id: user.id },
    data,
  });
  revalidatePath("/users");
  revalidatePath("/posts");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Invalid Request");
  const email = session.user.email;
  const caption = formData.get("caption") as string;
  const imageFile = formData.get("image") as File;
  const blob = await put(imageFile.name, imageFile, {
    access: "public",
  });

  const user = await prisma.user.findFirstOrThrow({
    where: { email },
  });

  await prisma.post.create({
    data: {
      caption,
      image: blob.url,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function authenticate(
  state: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "メールアドレスまたはパスワードが正しくありません。";
        default:
          return "エラーが発生しました。";
      }
    }
    throw error;
  }
}
export async function logout() {
  await signOut();
  redirect("/login");
}

export async function followUser(targetUserId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("認証が必要です");
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) {
    throw new Error("ユーザーが見つかりません");
  }

  if (currentUser.id === targetUserId) {
    throw new Error("自分自身をフォローすることはできません");
  }

  try {
    await prisma.follow.create({
      data: {
        followerId: currentUser.id,
        followingId: targetUserId,
      },
    });
    revalidatePath(`/users/${targetUserId}`);
    revalidatePath(`/profile`);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      throw new Error("すでにフォローしています");
    }
    throw error;
  }
}

export async function unfollowUser(targetUserId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("認証が必要です");
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) {
    throw new Error("ユーザーが見つかりません");
  }

  try {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: targetUserId,
        },
      },
    });
    revalidatePath(`/users/${targetUserId}`);
    revalidatePath(`/profile`);
  } catch (error) {
    throw new Error("フォロー解除に失敗しました");
  }
}

export async function getFollowStatus(targetUserId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.email) {
    return false;
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) {
    return false;
  }

  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUser.id,
        followingId: targetUserId,
      },
    },
  });

  return !!follow;
}

export async function getFollowCounts(userId: string) {
  const [followersCount, followingCount] = await Promise.all([
    prisma.follow.count({
      where: { followingId: userId },
    }),
    prisma.follow.count({
      where: { followerId: userId },
    }),
  ]);

  return { followersCount, followingCount };
}
