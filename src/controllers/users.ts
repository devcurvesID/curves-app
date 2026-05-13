import {
  findUserModel,
  getUserBySourceId,
  insertNewUser,
  UserModel,
} from "../models/users/user_m";
import { generateToken, toUTCISOString } from "../helpers";
import { NextRequest, NextResponse } from "next/server";
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
      postal: req_body.postal == "-" ? null : req_body.postal,
      nik: req_body.nik == "-" ? null : req_body.nik,
      key_tag_id: req_body.key_tag_id ? req_body.key_tag_id.toString() : null,
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

export const getDataUserByRole = async (
  req: NextRequest,
  role_source_id: number,
): Promise<any | null> => {
  try {
    const { searchParams } = new URL(req.url);
    const offset = searchParams.get("offset");
    const limit = searchParams.get("limit");
    const user_id = searchParams.get("_id");
    const club_id = searchParams.get("club_id");

    let limit_val = limit ? Number(limit) : 10;
    let skip_val = offset ? Number(offset) : 0;

    const role = await getRoleBySourceId(role_source_id);
    if (!role) {
      throw new Error("Role tidak ditemukan");
    }
    let req_body: any = {
      role_id: role._id,
    };
    if (user_id) {
      req_body._id = user_id;
      const data_member = await findUserModel(req_body, skip_val, limit_val);
      if (data_member.length === 0) {
        throw new Error("Member tidak ditemukan");
      }
      return data_member[0];
    }
    if (club_id) {
      req_body.club_id = club_id;
    }
    const total = await UserModel.countDocuments(req_body);
    // $in => find muntiple ids with data type is array
    const data_member = await findUserModel(req_body, skip_val, limit_val);

    const data_response = {
      total,
      limit: limit_val,
      offset: skip_val,
      response: data_member,
    };
    return data_response;
  } catch (error) {
    throw error;
  }
};
