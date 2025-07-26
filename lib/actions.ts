"use server";

import prisma from "@/lib/prisma";
import { put } from "@vercel/blob";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const passwordConfirmation = formData.get("passwordConfirmation") as string;

  const user = await prisma.user.findFirst({ where: { email } });

  if (user) {
    return "このメールアドレスはすでに使われています。";
  }

  if (password != passwordConfirmation) {
    return "パスワードと確認用パスワードが一致しません。";
  }

  const bcryptedPassword = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: bcryptedPassword,
      },
    });
  } catch (error) {
    console.error(error);
    return "新規登録に失敗しました。";
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
  const email = "user+1@example.com";
  const user = await prisma.user.findFirstOrThrow({
    where: { email },
  });
  const text = formData.get("text") as string;

  const post = await prisma.post.findFirstOrThrow({
    where: { id, userId: user.id },
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
  const currentEmail = "user+1@example.com";
  const user = await prisma.user.findFirstOrThrow({
    where: { email: currentEmail },
  });
  const data = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    image: user.image,
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

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function createPost(formData: FormData) {
  const email = "user+1@example.com";
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
