import BreadCrumbs from "@/components/layouts/bread-crumbs";
import UserSkeleton from "@/components/skeletons/user-skeleton";
import FollowButton from "@/components/ui/follow-button";
import { getFollowCounts, getFollowStatus } from "@/lib/actions";
import { fetchMe, fetchUser } from "@/lib/apis";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <>
      <BreadCrumbs title="オーナー 🐾" />
      <Suspense fallback={<UserSkeleton />}>
        <UserDetail params={params} />
      </Suspense>
    </>
  );
}

async function UserDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [user, currentUser, isFollowing, followCounts] = await Promise.all([
    fetchUser(id),
    fetchMe().catch(() => null),
    getFollowStatus(id),
    getFollowCounts(id),
  ]);
  const isOwnProfile = currentUser?.id === user.id;
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mt-8 flex bg-white p-4">
        {user.image && (
          <Image
            className="block aspect-[1/1] rounded-full object-cover"
            src={user.image}
            width={96}
            height={96}
            alt="user icon"
          />
        )}

        <div className="flex flex-1 justify-between pl-4">
          <div>
            <p className="text-lg font-semibold text-black">{user.name}</p>
            <p className="whitespace-pre-wrap font-medium">{user.description}</p>
            <div className="mt-4 flex gap-6">
              <p className="text-sm font-semibold text-black">
                投稿{user.posts.length}件
              </p>
              <Link href={`/users/${user.id}/followers`} className="text-sm font-semibold text-black hover:underline">
                フォロワー{followCounts.followersCount}人
              </Link>
              <Link href={`/users/${user.id}/following`} className="text-sm font-semibold text-black hover:underline">
                フォロー中{followCounts.followingCount}人
              </Link>
            </div>
          </div>
          <div>
            <FollowButton
              targetUserId={user.id}
              initialIsFollowing={isFollowing}
              isOwnProfile={isOwnProfile}
            />
          </div>
        </div>
      </div>
      <div className="my-8 bg-white">
        <div className="grid grid-cols-3 gap-1">
          {user.posts.map((post) => {
            return (
              <Link href={`/posts/${post.id}`} key={post.id}>
                {post.image && (
                  <Image
                    className="aspect-[1/1] w-full object-cover"
                    src={post.image}
                    width={400}
                    height={400}
                    alt="user icon"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
