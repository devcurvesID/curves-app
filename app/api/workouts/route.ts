import { getDataWeighMeasureByUserId } from "@/src/controllers/weighmeasures";
import { formatToISO, toUTCISOString } from "@/src/helpers";
import { getUserLogin } from "@/src/lib/auth";
import { api } from "@/src/lib/axios";
import connectDB from "@/src/lib/mongodb";
import { ClubModel, getClubBySourceId } from "@/src/models/clubs/club_m";
import { getRoleBySourceId, RoleModel } from "@/src/models/roles/role_m";
import {
  getUserBySourceId,
  insertNewUser,
  UserModel,
} from "@/src/models/users/user_m";
import { insertUserPersonalByUserId } from "@/src/models/users/user_personal";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  // context: { params: Promise<{ provider: string }> },
) {
  return NextResponse.json({ response: [] }, { status: 200 });

  // const { provider } = await context.params;
  // const { searchParams } = new URL(req.url);
  // const offset = searchParams.get("offset");
  // const limit = searchParams.get("limit");
  // const phone = searchParams.get("phone");

  // if (
  //   !["user", "role", "club", "user-member", "weigh-measure"].includes(provider)
  // ) {
  //   return NextResponse.json(
  //     {
  //       error: "provide not support",
  //     },
  //     { status: 404 },
  //   );
  // }
  // try {
  //   await connectDB();
  //   const decode = await getUserLogin(req);

  //   if (provider === "weigh-measure") {
  //     let response_data = await getDataWeighMeasureByUserId(req);
  //     return NextResponse.json({ response: response_data }, { status: 200 });
  //   }
  //   if (provider === "club") {
  //     const {
  //       data: { response },
  //     } = await api.get("/club");
  //     let response_club = response;
  //     let data_club = [];
  //     for (let i = 0; i < response_club.length; i++) {
  //       let curr_data = await getClubBySourceId(response_club[i].id);
  //       if (!curr_data) {
  //         let created_at = toUTCISOString(response_club[i].created_at);
  //         let updated_at = toUTCISOString(response_club[i].updated_at);
  //         data_club.push({
  //           source_id: response_club[i].id,
  //           ...response_club[i],
  //           created_at: created_at,
  //           updated_at: updated_at,
  //         });
  //       }
  //     }
  //     if (data_club.length === 0) {
  //       return NextResponse.json({ response: response_club }, { status: 200 });
  //     }
  //     await ClubModel.insertMany(data_club);
  //     return NextResponse.json({ response: response }, { status: 200 });
  //   }
  //   if (provider === "role") {
  //     const {
  //       data: { response },
  //     } = await api.get("/role");
  //     let response_role = response;
  //     let data_role = [];
  //     for (let i = 0; i < response_role.length; i++) {
  //       let curr_data = await getRoleBySourceId(response_role[i].id);
  //       if (!curr_data) {
  //         data_role.push({
  //           source_id: response_role[i].id,
  //           role: response_role[i].role,
  //           created_at: toUTCISOString(response_role[i].created_at),
  //           updated_at: toUTCISOString(response_role[i].updated_at),
  //         });
  //       }
  //     }
  //     if (data_role.length == 0) {
  //       return NextResponse.json({ response: response_role }, { status: 200 });
  //     }
  //     await RoleModel.insertMany(data_role);
  //     return NextResponse.json({ response: data_role }, { status: 200 });
  //   }

  //   if (provider === "user-member") {
  //     if (phone) {
  //       const {
  //         data: { response },
  //       } = await api.get(`/user-member?phone=${phone}`);
  //       if (!response) {
  //         return NextResponse.json(
  //           {
  //             error: "pengguna tidak ditemukan",
  //           },
  //           { status: 404 },
  //         );
  //       }
  //       let curr_data = await getUserBySourceId(response.id);
  //       if (!curr_data) {
  //         let role_data = await getRoleBySourceId(response.role_id);
  //         let club_data = await getClubBySourceId(response.club_id);
  //         let req_body = {
  //           ...response,
  //           source_id: response.id,
  //           created_at: toUTCISOString(response.created_at),
  //           updated_at: toUTCISOString(response.updated_at),
  //           role_id: role_data?._id,
  //           club_id: club_data?._id,
  //         };
  //         let new_user = await insertNewUser(req_body);
  //         await insertUserPersonalByUserId({
  //           ...req_body,
  //           user_id: new_user._id,
  //         });
  //       }
  //       return NextResponse.json({ response: response }, { status: 200 });
  //     }
  //     let limit_val = limit ? limit : 10;
  //     let offset_val = offset ? offset : 0;
  //     const {
  //       data: { response },
  //     } = await api.get(`/user-member?offset=${offset_val}&limit=${limit_val}`);
  //     let response_member = response;
  //     let data_member = [];
  //     for (let i = 0; i < response_member.length; i++) {
  //       let curr_data = await getUserBySourceId(response_member[i].id);
  //       if (!curr_data) {
  //         let role_data = await getRoleBySourceId(response_member[i].role_id);
  //         let club_data = await getClubBySourceId(response_member[i].club_id);
  //         data_member.push({
  //           ...response_member[i],
  //           source_id: response_member[i].id,
  //           created_at: toUTCISOString(response_member[i].created_at),
  //           updated_at: toUTCISOString(response_member[i].updated_at),
  //           role_id: role_data?._id,
  //           club_id: club_data?._id,
  //         });
  //       }
  //     }
  //     if (data_member.length == 0) {
  //       return NextResponse.json(
  //         { response: response_member },
  //         { status: 200 },
  //       );
  //     }
  //     for (let i = 0; i < data_member.length; i++) {
  //       let new_user = await insertNewUser(data_member[i]);
  //       await insertUserPersonalByUserId({
  //         ...data_member[i],
  //         user_id: new_user._id,
  //       });
  //     }
  //     return NextResponse.json({ response: data_member }, { status: 200 });
  //   }
  //   return NextResponse.json({ response: [] }, { status: 200 });
  // } catch (error: any) {
  //   let error_response = error.message ? error.message : "Server Error";
  //   return NextResponse.json({ error: error_response }, { status: 404 });
  // }
}
