import BreadCrumbs from "@/components/layouts/bread-crumbs";
import FollowButton from "@/components/ui/follow-button";
import { getFollowStatus } from "@/lib/actions";
import { fetchMe, fetchUser } from "@/lib/apis";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [user, currentUser] = await Promise.all([
    fetchUser(id),
    fetchMe().catch(() => null),
  ]);

  const following = await prisma.user.findMany({
    where: {
      followers: {
        some: {
          followerId: id,
        },
      },
    },
    include: {
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  const followStatuses = await Promise.all(
    following.map(async (followedUser) => ({
      userId: followedUser.id,
      isFollowing: currentUser ? await getFollowStatus(followedUser.id) : false,
    }))
  );

  const followStatusMap = Object.fromEntries(
    followStatuses.map((status) => [status.userId, status.isFollowing])
  );

  return (
    <>
      <BreadCrumbs title={`${user.name}がフォロー中 🐾`} />
      <div className="mx-auto max-w-5xl">
        <div className="mt-8 bg-white p-4">
          <h2 className="mb-4 text-lg font-semibold">フォロー中</h2>
          {following.length === 0 ? (
            <p className="text-center text-gray-500">
              まだ誰もフォローしていません
            </p>
          ) : (
            <div className="space-y-4">
              {following.map((followedUser) => (
                <div
                  key={followedUser.id}
                  className="flex items-center justify-between border-b pb-4 last:border-b-0"
                >
                  <Link
                    href={`/users/${followedUser.id}`}
                    className="flex items-center space-x-4"
                  >
                    {followedUser.image && (
                      <Image
                        className="aspect-[1/1] rounded-full object-cover"
                        src={followedUser.image}
                        width={48}
                        height={48}
                        alt={`${followedUser.name}のアイコン`}
                      />
                    )}
                    <div>
                      <p className="font-semibold">{followedUser.name}</p>
                      <p className="text-sm text-gray-600">
                        投稿{followedUser._count.posts}件 • フォロワー
                        {followedUser._count.followers}人
                      </p>
                    </div>
                  </Link>
                  {currentUser && currentUser.id !== followedUser.id && (
                    <FollowButton
                      targetUserId={followedUser.id}
                      initialIsFollowing={followStatusMap[followedUser.id]}
                      isOwnProfile={false}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}