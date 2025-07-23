import BreadCrumbs from "@/components/layouts/bread-crumbs";
import { fetchPosts } from "@/lib/apis";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
  return (
    <>
      <BreadCrumbs title="新着投稿 🐾" />
      <Posts />
    </>
  );
}

async function Posts() {
  const posts = await fetchPosts();
  console.log(posts);
  return (
    <div className="mx-auto my-8 max-w-5xl bg-white">
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => {
          return (
            <Link key={post.id} href={`/posts/${post.id}`}>
              <Image
                className="aspect-[1/1] w-full object-cover"
                src={post.image}
                alt="posts"
                width={400}
                height={400}
              />
              <div className="flex items-center justify-between border p-1">
                <div className="flex items-center">
                  {post.user.image && (
                    <Image
                      className="block aspect-square size-6 rounded-full object-cover"
                      src={post.user.image}
                      width={32}
                      height={32}
                      alt="user icon"
                    />
                  )}
                  <p className="ml-2 text-sm font-semibold text-black">
                    {post.user.name}
                  </p>
                </div>
                <p className="hidden text-xs text-gray-500 md:block">
                  {post.createdAt.toLocaleString("ja-JP")}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
