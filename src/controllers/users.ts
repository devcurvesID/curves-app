import { getUserBySourceId, insertNewUser } from "../models/users/user_m";
import { generateToken, toUTCISOString } from "../helpers";
import { NextRequest, NextResponse } from "next/server";
import { api } from "../lib/axios";
import { getClubBySourceId } from "../models/clubs/club_m";
import { getRoleBySourceId } from "../models/roles/role_m";
import { insertUserPersonalByUserId } from "../models/users/user_personal";

export const insertNewUserToMongodb = async (
  data: any,
): Promise<any | null> => {
  try {
    let curr_data = await getUserBySourceId(data.id);
    if (curr_data) {
      return curr_data;
    }
    let role_data = await getRoleBySourceId(data.role_id);
    let club_data = await getClubBySourceId(data.club_id);
    let req_body = {
      ...data,
      source_id: data.id,
      created_at: toUTCISOString(data.created_at),
      updated_at: toUTCISOString(data.updated_at),
      role_id: role_data?._id,
      club_id: club_data?._id,
    };
    let new_user = await insertNewUser(req_body);
    await insertUserPersonalByUserId({
      ...req_body,
      user_id: new_user._id,
    });
    return new_user;
  } catch (error) {
    throw error;
  }
};

export const generateUserToken = async (user: any): Promise<any | null> => {
  const user_id = user._id.toString();
  let userToken = await generateToken(user_id);
  const response_data = NextResponse.json({
    response: {
      _id: user._id,
      source_id: user.source_id,
      name: user.name,
      token: userToken,
    },
  });
  response_data.cookies.set("token", userToken, {
    httpOnly: true,
    secure: false, //process.env.NODE_ENV === "production", => ubah ketika sudah memiliki domain
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response_data;
};
