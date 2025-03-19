// app/api/track/route.ts

import { NextResponse } from "next/server";

const errorChance = 0.1;

export async function POST(request: Request) {
  // Simulate error chance:
  if (Math.random() <= errorChance) {
    return NextResponse.json(null, { status: 500 });
  }

  const { id, from = undefined, to = undefined } = await request.json();

  if (!id || typeof from === "undefined" || typeof to === "undefined") {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  console.log("Tracking event:", { id, from, to });
  return new NextResponse(null, { status: 204 });
}
