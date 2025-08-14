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

  const followers = await prisma.user.findMany({
    where: {
      following: {
        some: {
          followingId: id,
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
    followers.map(async (follower) => ({
      userId: follower.id,
      isFollowing: currentUser ? await getFollowStatus(follower.id) : false,
    }))
  );

  const followStatusMap = Object.fromEntries(
    followStatuses.map((status) => [status.userId, status.isFollowing])
  );

  return (
    <>
      <BreadCrumbs title={`${user.name}のフォロワー 🐾`} />
      <div className="mx-auto max-w-5xl">
        <div className="mt-8 bg-white p-4">
          <h2 className="mb-4 text-lg font-semibold">フォロワー</h2>
          {followers.length === 0 ? (
            <p className="text-center text-gray-500">
              まだフォロワーがいません
            </p>
          ) : (
            <div className="space-y-4">
              {followers.map((follower) => (
                <div
                  key={follower.id}
                  className="flex items-center justify-between border-b pb-4 last:border-b-0"
                >
                  <Link
                    href={`/users/${follower.id}`}
                    className="flex items-center space-x-4"
                  >
                    {follower.image && (
                      <Image
                        className="aspect-[1/1] rounded-full object-cover"
                        src={follower.image}
                        width={48}
                        height={48}
                        alt={`${follower.name}のアイコン`}
                      />
                    )}
                    <div>
                      <p className="font-semibold">{follower.name}</p>
                      <p className="text-sm text-gray-600">
                        投稿{follower._count.posts}件 • フォロワー
                        {follower._count.followers}人
                      </p>
                    </div>
                  </Link>
                  {currentUser && currentUser.id !== follower.id && (
                    <FollowButton
                      targetUserId={follower.id}
                      initialIsFollowing={followStatusMap[follower.id]}
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