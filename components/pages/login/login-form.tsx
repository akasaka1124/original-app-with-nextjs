"use client";
import Loader from "@/components/loaders/loader";
import { authenticate } from "@/lib/actions";
import clsx from "clsx";
import Link from "next/link";
import { useActionState } from "react";

export default function LoginForm() {
  const [error, action, isPending] = useActionState(authenticate, undefined);
  return (
    <form
      action={action}
      noValidate
      className={clsx("relative", { "opacity-20": isPending })}
    >
      {error && <p className="mb-4 text-xs text-red-500">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          メールアドレス
        </label>
        <input
          name="email"
          type="email"
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          パスワード
        </label>
        <input
          type="password"
          name="password"
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div className="mt-8 flex items-center justify-end">
        <Link
          className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          href="/register"
        >
          新規会員登録はこちら
        </Link>

        <button className="ml-4 inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900">
          ログイン
        </button>
      </div>
      {isPending && <Loader />}
    </form>
  );
}
