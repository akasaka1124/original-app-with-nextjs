import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-200 p-6">
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className="text-xl text-gray-800 md:text-3xl md:leading-normal">
            <strong>愛犬との思い出写真は一生もの。</strong>
            <br />
            みんなに愛犬画像をシェアしよう。
          </p>
          <Link
            href="/register"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-800 px-6 py-3 text-sm font-medium text-white hover:bg-blue-600"
          >
            <span>さっそく始める</span>
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image
            src="/hero-desktop.png"
            width={1000}
            height={620}
            className="hidden md:block"
            alt="Desktop Screenshots"
          />
          <Image
            src="/hero-mobile.png"
            width={560}
            height={760}
            className="block md:hidden"
            alt="Mobile Screenshots"
          />
        </div>
      </div>
    </div>
  );
}
