import { getCurrentUser } from "@/src/lib/auth";
import connectDB from "@/src/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    // Login with web
    const cookieStore = await getCurrentUser(req);
    if (!cookieStore) {
      return NextResponse.json(
        { error: "Yo're not authenticate" },
        { status: 401 },
      );
    }
    return NextResponse.json(cookieStore, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Errors" },
      { status: 500 },
    );
  }
}
