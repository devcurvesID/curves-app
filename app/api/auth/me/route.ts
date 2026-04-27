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
  } catch (error: any) {
    let error_response = error.message ? error.message : "Server Error";
    return NextResponse.json({ error: error_response }, { status: 500 });
  }
}
