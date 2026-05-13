import connectDB from "@/src/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;
  const { searchParams } = new URL(req.url);
  const offset = searchParams.get("offset");
  const limit = searchParams.get("limit");
  const phone = searchParams.get("phone");

  if (!["user", "role", "club", "user-member"].includes(provider)) {
    return NextResponse.json(
      {
        error: "provide not support",
      },
      { status: 404 },
    );
  }
  try {
    await connectDB();

    return NextResponse.json({ response: [] }, { status: 200 });
  } catch (error: any) {
    let error_response = error.message ? error.message : "Server Error";
    return NextResponse.json({ error: error_response }, { status: 404 });
  }
}
