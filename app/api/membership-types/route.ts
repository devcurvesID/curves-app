import connectDB from "@/src/lib/mongodb";
import {
  getMemberShipTypeById,
  MemberShipTypeModel,
} from "@/src/models/membership-types/membership_type_m";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const membership_id = searchParams.get("_id");
  try {
    await connectDB();
    if (membership_id) {
      const data = await getMemberShipTypeById(membership_id);
      return NextResponse.json({ response: data }, { status: 200 });
    }
    const total = await MemberShipTypeModel.countDocuments();
    const data_membership = await MemberShipTypeModel.find();
    return NextResponse.json(
      { total, response: data_membership },
      { status: 200 },
    );
  } catch (error: any) {
    let error_response = error.message ? error.message : "Server Error";
    return NextResponse.json({ error: error_response }, { status: 404 });
  }
}
