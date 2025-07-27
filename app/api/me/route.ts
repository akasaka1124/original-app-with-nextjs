import { fetchMe } from "@/lib/apis";
import { NextResponse } from "next/server";

export async function GET() {
  const me = await fetchMe();
  return NextResponse.json(me);
}
