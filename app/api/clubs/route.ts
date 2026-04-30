import connectDB from "@/src/lib/mongodb";
import { ClubModel, getClubById } from "@/src/models/clubs/club_m";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const club_id = searchParams.get("_id");
  try {
    await connectDB();
    if (club_id) {
      const data = await getClubById(club_id);
      return NextResponse.json({ response: data }, { status: 200 });
    }
    const total = await ClubModel.countDocuments();
    const data_clubs = await ClubModel.find();
    return NextResponse.json({ total, response: data_clubs }, { status: 200 });
  } catch (error: any) {
    let error_response = error.message ? error.message : "Server Error";
    return NextResponse.json({ error: error_response }, { status: 404 });
  }
}
