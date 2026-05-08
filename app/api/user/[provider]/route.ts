import { getDataStatusMemberByUserId } from "@/src/controllers/member-status";
import { insertNewUserToMongodb } from "@/src/controllers/users";
import {
  getDataLastWeighMeasureByUserId,
  getDataWeighMeasureByUserIdPerMonth,
  insertNewWorkOutWithUserLoginToMongodb,
} from "@/src/controllers/weighmeasures";
import {
  getDataLastWorkOutByUserId,
  getDataWorkOutByUserIdPerMonth,
} from "@/src/controllers/workouts";
import { hashPassword } from "@/src/helpers";
import { getUserLogin } from "@/src/lib/auth";
import connectDB from "@/src/lib/mongodb";
import { ClubModel } from "@/src/models/clubs/club_m";
import { getUserById } from "@/src/models/users/user_m";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;
  if (
    ![
      "logout",
      "verification",
      "member",
      "coach",
      "workout",
      "attendance",
    ].includes(provider)
  ) {
    return NextResponse.json(
      { error: "provider not support" },
      { status: 400 },
    );
  }
  try {
    if (provider === "logout") {
      const response = NextResponse.json({
        message: "User logout successfully",
      });
      response.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
      });
      return response;
    }
    // create data when member's want to workout with clubs
    if (provider === "attendance") {
      const response_data = await insertNewWorkOutWithUserLoginToMongodb(req);
      return NextResponse.json({ response: response_data }, { status: 200 });
    }
    // API will be using when member's the first time registration account
    const body = await req.json();
    if (provider === "verification") {
      const { password, verify_password, username } = body;
      if (!username) {
        return NextResponse.json(
          { error: "username tidak boleh kosong" },
          { status: 404 },
        );
      }
      if (!password) {
        return NextResponse.json(
          { error: "password tidak boleh kosong" },
          { status: 404 },
        );
      }
      if (!verify_password) {
        return NextResponse.json(
          { error: "verify_password tidak boleh kosong" },
          { status: 404 },
        );
      }
      if (verify_password != password) {
        return NextResponse.json(
          { error: "verifikasi password tidak sesuai" },
          { status: 404 },
        );
      }
      const password_val = await hashPassword(password);
      let body_req = {
        ...body,
        password: password_val,
      };
      let insert_user = await insertNewUserToMongodb(body_req);
      return NextResponse.json({ response: insert_user }, { status: 200 });
    }
  } catch (error: any) {
    let error_response = error.message ? error.message : "Server Error";
    return NextResponse.json({ error: error_response }, { status: 404 });
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;
  if (
    ![
      "last-weigh-measure",
      "last-workout",
      "weigh-measure",
      "workout",
      "club",
      "member-status",
    ].includes(provider)
  ) {
    return NextResponse.json(
      { error: "provider not support" },
      { status: 400 },
    );
  }
  try {
    await connectDB();
    const decode = await getUserLogin(req);
    let cek_user = await getUserById(decode._id);
    if (!cek_user) {
      throw Error("pengguna tidak ditemukan");
    }
    let user_id = decode._id.toString();
    if (provider === "last-weigh-measure") {
      const data_las_wm = await getDataLastWeighMeasureByUserId(user_id);
      return NextResponse.json(data_las_wm);
    }
    if (provider === "last-workout") {
      const data_las_workout = await getDataLastWorkOutByUserId(user_id);
      return NextResponse.json(data_las_workout);
    }

    if (provider === "member-status") {
      const data_las_workout = await getDataStatusMemberByUserId(user_id);
      return NextResponse.json(data_las_workout);
    }

    if (provider === "workout") {
      const data_work_out = await getDataWorkOutByUserIdPerMonth(req, user_id);
      return NextResponse.json(data_work_out);
    }
    if (provider === "weigh-measure") {
      const data_weigh_measure = await getDataWeighMeasureByUserIdPerMonth(
        req,
        user_id,
      );
      return NextResponse.json(data_weigh_measure);
    }
    if (provider === "club") {
      // $in => find muntiple ids with data type is array
      const data_clubs = await ClubModel.find({
        _id: { $in: cek_user.club_id },
      });
      return NextResponse.json({
        user_id: decode._id,
        response: data_clubs,
      });
    }
    //
  } catch (error: any) {
    let error_response = error.message ? error.message : "Server Error";
    return NextResponse.json({ error: error_response }, { status: 404 });
  }
}
