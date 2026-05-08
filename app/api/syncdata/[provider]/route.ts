import { syncDataMemberStatusFromCMS } from "@/src/controllers/member-status";
import { syncDataMemberShipTypesFromCMS } from "@/src/controllers/membership-types";
import { insertNewUserToMongodb } from "@/src/controllers/users";
import {
  getDataWeighMeasureByUserId,
  insertNewWorkOutToMongodb,
} from "@/src/controllers/weighmeasures";
import { getDataWorkOutByUserId } from "@/src/controllers/workouts";
import { formatToISO, toUTCISOString } from "@/src/helpers";
import { api } from "@/src/lib/axios";
import connectDB from "@/src/lib/mongodb";
import { ClubModel, getClubBySourceId } from "@/src/models/clubs/club_m";
import { getRoleBySourceId, RoleModel } from "@/src/models/roles/role_m";
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
  if (
    ![
      "user",
      "role",
      "club",
      "user-member",
      "weigh-measure",
      "workout",
      "attendance",
      "membership-type",
      "member-status",
    ].includes(provider)
  ) {
    return NextResponse.json(
      {
        error: "provide not support",
      },
      { status: 404 },
    );
  }
  try {
    await connectDB();
    if (provider === "membership-type") {
      let response_data = await syncDataMemberShipTypesFromCMS();
      return NextResponse.json({ response: response_data }, { status: 200 });
    }
    if (provider === "member-status") {
      let response_data = await syncDataMemberStatusFromCMS(req);
      return NextResponse.json({ response: response_data }, { status: 200 });
    }
    if (provider === "attendance") {
      // sync attendance to mobile
    }
    if (provider === "workout") {
      let response_data = await getDataWorkOutByUserId(req);
      return NextResponse.json({ response: response_data }, { status: 200 });
    }
    if (provider === "weigh-measure") {
      let response_data = await getDataWeighMeasureByUserId(req);
      return NextResponse.json({ response: response_data }, { status: 200 });
    }
    if (provider === "club") {
      const {
        data: { response },
      } = await api.get("/club");
      let response_club = response;
      let data_club = [];
      for (let i = 0; i < response_club.length; i++) {
        let curr_data = await getClubBySourceId(response_club[i].id);
        if (!curr_data) {
          let created_at = toUTCISOString(response_club[i].created_at);
          let updated_at = toUTCISOString(response_club[i].updated_at);
          data_club.push({
            source_id: response_club[i].id,
            ...response_club[i],
            created_at: created_at,
            updated_at: updated_at,
          });
        }
      }
      if (data_club.length === 0) {
        return NextResponse.json({ response: response_club }, { status: 200 });
      }
      await ClubModel.insertMany(data_club);
      return NextResponse.json({ response: response }, { status: 200 });
    }
    if (provider === "role") {
      const {
        data: { response },
      } = await api.get("/role");
      let response_role = response;
      let data_role = [];
      for (let i = 0; i < response_role.length; i++) {
        let curr_data = await getRoleBySourceId(response_role[i].id);
        if (!curr_data) {
          data_role.push({
            source_id: response_role[i].id,
            role: response_role[i].role,
            created_at: toUTCISOString(response_role[i].created_at),
            updated_at: toUTCISOString(response_role[i].updated_at),
          });
        }
      }
      if (data_role.length == 0) {
        return NextResponse.json({ response: response_role }, { status: 200 });
      }
      await RoleModel.insertMany(data_role);
      return NextResponse.json({ response: data_role }, { status: 200 });
    }

    if (provider === "user-member") {
      if (phone) {
        const {
          data: { response },
        } = await api.get(`/user-member?phone=${phone}`);
        if (!response) {
          return NextResponse.json(
            {
              error: "pengguna tidak ditemukan",
            },
            { status: 404 },
          );
        }
        let insert_user = await insertNewUserToMongodb(response);
        return NextResponse.json({ response: insert_user }, { status: 200 });
      }
      let limit_val = limit ? limit : 10;
      let offset_val = offset ? offset : 0;
      const {
        data: { response },
      } = await api.get(`/user-member?offset=${offset_val}&limit=${limit_val}`);
      let response_member = response;
      if (response_member.length === 0) {
        return NextResponse.json({ response: [] }, { status: 200 });
      }
      let data_member = [];
      for (let i = 0; i < response_member.length; i++) {
        let insert_user = await insertNewUserToMongodb(response_member[i]);
        data_member.push(insert_user);
      }
      return NextResponse.json({ response: data_member }, { status: 200 });
    }
    return NextResponse.json({ response: [] }, { status: 200 });
  } catch (error: any) {
    let error_response = error.message ? error.message : "Server Error";
    return NextResponse.json({ error: error_response }, { status: 404 });
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;
  if (
    ![
      "user",
      "role",
      "club",
      "user-member",
      "weigh-measure",
      "workout",
      "attendance",
    ].includes(provider)
  ) {
    return NextResponse.json(
      {
        error: "provide not support",
      },
      { status: 404 },
    );
  }
  try {
    await connectDB();
    if (provider === "attendance") {
      const data_attendance = await insertNewWorkOutToMongodb(req);
      return NextResponse.json({ response: data_attendance }, { status: 200 });
    }
    return NextResponse.json({ response: [] }, { status: 200 });
  } catch (error: any) {
    let error_response = error.message ? error.message : "Server Error";
    return NextResponse.json({ error: error_response }, { status: 404 });
  }
}
