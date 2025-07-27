"use client";

import { logout } from "@/lib/actions";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  image: string | null;
  name: string;
  email: string;
  description: string | null;
};
export default function NavigationMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const passname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((me) => setUser(me));
  }, [passname]);
  return (
    <div className="relative inline-block sm:ms-6 sm:items-center">
      <button
        id="menu-button"
        className="my-6 inline-flex items-center rounded-md border border-transparent bg-white px-3 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
        onClick={() => setShowMenu(true)}
      >
        {user?.image && (
          <Image
            className="mr-2 block aspect-square size-6 rounded-full object-cover"
            src={user.image}
            width={64}
            height={64}
            alt="user logo"
          />
        )}
        <div>{user?.name}</div>
        <div className="ms-1">
          <svg
            className="size-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>
      <div
        className={clsx(
          "absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none",
          { block: showMenu, hidden: !showMenu },
        )}
        onClick={() => setShowMenu(false)}
      >
        <div className="py-1">
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm text-gray-700"
          >
            ダッシュボード
          </Link>
        </div>
        <div className="py-1">
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700"
          >
            プロフィール
          </Link>
        </div>
        <div className="py-1">
          <Link
            href="/posts/create"
            className="block px-4 py-2 text-sm text-gray-700"
          >
            投稿作成
          </Link>
        </div>
        <div className="py-1">
          <Link href="/posts" className="block px-4 py-2 text-sm text-gray-700">
            新着投稿
          </Link>
        </div>
        <div className="py-1">
          <Link href="/users" className="block px-4 py-2 text-sm text-gray-700">
            オーナー
          </Link>
        </div>
        <div className="py-1">
          <form action={logout}>
            <button
              type="submit"
              className="block px-4 py-2 text-sm text-gray-700"
            >
              ログアウト 🐾
            </button>
          </form>
        </div>
      </div>
      {showMenu && (
        <div
          className="fixed left-0 top-0 h-screen w-screen"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
