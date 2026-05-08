import { NextRequest } from "next/server";
import { api } from "../lib/axios";
import { getMemberShipTypeBySourceId } from "../models/membership-types/membership_type_m";
import { toUTCISOString } from "../helpers";
import { getUserBySourceId } from "../models/users/user_m";
import {
  getMemberStatusByUserId,
  MemberStatusModel,
} from "../models/members/member_status";

export const syncDataMemberStatusFromCMS = async (
  req: NextRequest,
): Promise<any | null> => {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    let data_user = await getUserBySourceId(Number(user_id));
    if (!data_user) {
      throw new Error("user_id tidak ditemukan");
    }
    let cek_memberstatus = await getMemberStatusByUserId(
      data_user._id.toString(),
    );
    if (cek_memberstatus) {
      return cek_memberstatus;
    }
    const {
      data: { response },
    } = await api.get(`/member-status?user_id=${user_id}`);
    let response_memberstatus = response;
    if (!response_memberstatus) {
      return response_memberstatus;
    }
    let data_membership = await getMemberShipTypeBySourceId(
      Number(response_memberstatus.membership_type_id),
    );
    if (!data_membership) {
      throw new Error("data membership tidak ditemukan");
    }
    let req_body = {
      ...response_memberstatus,
      created_at: toUTCISOString(response_memberstatus.created_at),
      updated_at: toUTCISOString(response_memberstatus.updated_at),
      from_date: toUTCISOString(response_memberstatus.from_date),
      thru_date: toUTCISOString(response_memberstatus.thru_date),
      last_wm: toUTCISOString(response_memberstatus.last_wm),
      user_id: data_user._id,
      membership_type_id: data_membership._id,
    };
    let insert_data = await MemberStatusModel.insertOne(req_body);
    return insert_data;
  } catch (error) {
    throw error;
  }
};
