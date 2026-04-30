import connectDB from "@/src/lib/mongodb";
import { RoleModel, getRoleById } from "@/src/models/roles/role_m";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role_id = searchParams.get("_id");
  try {
    await connectDB();
    if (role_id) {
      const data = await getRoleById(role_id);
      return NextResponse.json({ response: data }, { status: 200 });
    }
    const total = await RoleModel.countDocuments();
    const data_clubs = await RoleModel.find();
    return NextResponse.json({ total, response: data_clubs }, { status: 200 });
  } catch (error: any) {
    let error_response = error.message ? error.message : "Server Error";
    return NextResponse.json({ error: error_response }, { status: 404 });
  }
}
