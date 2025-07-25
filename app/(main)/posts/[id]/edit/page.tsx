import BreadCrumbs from "@/components/layouts/bread-crumbs";
import { deletePost, updatePost } from "@/lib/actions";
import { fetchPost } from "@/lib/apis";
import Image from "next/image";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await fetchPost(id);
  const updatePostWithId = updatePost.bind(null, id);
  const deletePostWithId = deletePost.bind(null, id);
  return (
    <>
      <BreadCrumbs title="投稿編集 🐾" />
      <div className="mx-auto max-w-5xl">
        <div className="mt-8 grid grid-cols-1 gap-1 bg-white md:grid-cols-2">
          <Image
            className="aspect-[1/1] w-full object-cover"
            src={post.image}
            width={640}
            height={640}
            alt="post image"
          />
          <div className="p-2">
            <h3 className="mb-2 font-semibold">オーナー</h3>
            <div className="flex rounded border bg-white p-2">
              {post.user.image && (
                <Image
                  className="block aspect-square size-12 rounded-full object-cover"
                  src={post.user.image}
                  width={96}
                  height={96}
                  alt="user icon"
                />
              )}
              <div className="pl-4">
                <div>
                  <p className="text-lg font-semibold text-black">
                    {post.user.name}
                  </p>
                  <p className="whitespace-pre-wrap text-sm font-medium">
                    {post.user.description}
                  </p>
                </div>
              </div>
            </div>
            <form action={updatePostWithId}>
              <h3 className="mt-2 font-semibold">キャプション</h3>
              <textarea
                name="caption"
                rows={8}
                className="mt-2 w-full rounded border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-blue-500"
              >
                {post.caption}
              </textarea>
              <div className="mt-4 flex items-center">
                <button
                  className="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900"
                  type="submit"
                >
                  更新
                </button>
                <Link
                  href={`/posts/${post.id}`}
                  className="ml-4 rounded border p-2 text-xs"
                >
                  投稿詳細へ
                </Link>
              </div>
            </form>
            <form action={deletePostWithId}>
              <button
                type="submit"
                className="mt-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25"
              >
                削除
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
