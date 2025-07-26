import BreadCrumbs from "@/components/layouts/bread-crumbs";
import UsersSkeleton from "@/components/skeletons/users-skeleton";
import { fetchUsers } from "@/lib/apis";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <BreadCrumbs title="オーナー一覧 🐾" />
      <Suspense fallback={<UsersSkeleton />}>
        <Users />
      </Suspense>
    </>
  );
}

async function Users() {
  const users = await fetchUsers();
  return (
    <div className="mx-auto my-8 max-w-5xl bg-white shadow-sm">
      <div className="grid grid-cols-1 gap-1  lg:grid-cols-2">
        {users.map((user) => {
          return (
            <Link href={`/users/${user.id}`} key={user.id}>
              <div className="flex bg-white p-4">
                {user.image && (
                  <Image
                    className="block aspect-[1/1] size-12 rounded-full object-cover"
                    src={user.image}
                    width={96}
                    height={96}
                    alt="user icon"
                  />
                )}
                <div className="pl-4">
                  <div>
                    <p className="text-lg font-semibold text-black">
                      {user.name}
                    </p>
                    <p className="whitespace-pre-wrap font-medium">
                      {user.description}
                    </p>
                    <div className="mt-4 flex">
                      <p className="text-sm font-semibold text-black">
                        投稿{user._count.posts}件、コメント
                        {user._count.comments}件
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
