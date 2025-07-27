import { NextResponse } from "next/server";

export async function GET() {
  const data = {
    title: "hello world!",
  };
  return NextResponse.json(data);
}
