import { getDataUserByRole } from "@/src/controllers/users";
import connectDB from "@/src/lib/mongodb";
import { USER_ROLE_COACH } from "@/src/utils/constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user_role = await getDataUserByRole(req, USER_ROLE_COACH);
    return NextResponse.json(user_role, { status: 200 });
  } catch (error: any) {
    let error_response = error.message ? error.message : "Server Error";
    return NextResponse.json({ error: error_response }, { status: 404 });
  }
}
