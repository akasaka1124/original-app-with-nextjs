import BreadCrumbs from "@/components/layouts/bread-crumbs";
import IconSkeleton from "@/components/skeletons/icon-skeleton";
import UserSkeleton from "@/components/skeletons/user-skeleton";
import { getFollowCounts } from "@/lib/actions";
import { fetchDashboard } from "@/lib/apis";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <BreadCrumbs title="ダッシュボード 🐾" />
      <Suspense fallback={<UserSkeleton />}>
        <Dashboard />
      </Suspense>
    </>
  );
}

async function Dashboard() {
  const user = await fetchDashboard();
  const followCounts = user.id ? await getFollowCounts(user.id) : { followersCount: 0, followingCount: 0 };
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mt-8 flex bg-white p-4">
        {user.image && (
          <Image
            className="block aspect-[1/1] size-24 rounded-full object-cover"
            src={user.image}
            width={96}
            height={96}
            alt="user icon"
          />
        )}
        {!!user.image || <IconSkeleton />}
        <div className="pl-4">
          <p className="text-lg font-semibold text-black">{user.name}</p>
          {user.description && (
            <p className="whitespace-pre-wrap font-medium">
              {user.description}
            </p>
          )}
          {!!user.description || (
            <p className="whitespace-pre-wrap text-sm opacity-20">
              🐾🐾🐾 「プロフィールを編集」から
              <br />
              自己紹介を入力しましょう 🐾🐾🐾
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold text-black">
              投稿{user.posts.length}件
            </p>
            {user.id && (
              <>
                <Link
                  href={`/users/${user.id}/followers`}
                  className="text-sm font-semibold text-black hover:underline"
                >
                  フォロワー{followCounts.followersCount}人
                </Link>
                <Link
                  href={`/users/${user.id}/following`}
                  className="text-sm font-semibold text-black hover:underline"
                >
                  フォロー中{followCounts.followingCount}人
                </Link>
              </>
            )}
          </div>
          <div className="mt-2">
            <Link
              href="/profile"
              className="inline-block rounded border px-3 py-1 text-sm font-semibold text-black hover:bg-gray-50"
            >
              プロフィールを編集
            </Link>
          </div>
        </div>
      </div>
      <div className="my-8 grid grid-cols-3 gap-1 bg-white">
        {user.posts.map((post) => {
          return (
            <Link href={`/posts/${post.id}/edit`} key={post.id}>
              <Image
                key={post.id}
                className="aspect-[1/1] w-full object-cover"
                src={post.image}
                alt="post"
                width={300}
                height={300}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
