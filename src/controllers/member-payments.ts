import { NextRequest } from "next/server";
import { api } from "../lib/axios";
import { toUTCISOString } from "../helpers";
import {
  getMemberPaymentBySourceId,
  MemberPaymentModel,
} from "../models/member-payments/member_payment_t";
import { getUserBySourceId } from "../models/users/user_m";

export const syncDataMemberPaymentByUserIdFromCMS = async (
  req: NextRequest,
): Promise<any | null> => {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    let data_user = await getUserBySourceId(Number(user_id));
    if (!data_user) {
      throw new Error("user_id tidak ditemukan");
    }
    const {
      data: { response },
    } = await api.get(`/member-payment?user_id=${user_id}`);
    let response_memberpayment = response;
    if (response_memberpayment.length === 0) {
      return [];
    }
    let data_mongo = [];
    for (let i = 0; i < response_memberpayment.length; i++) {
      let cek_sourceid = await getMemberPaymentBySourceId(
        response_memberpayment[i].id,
      );
      if (!cek_sourceid) {
        data_mongo.push({
          ...response_memberpayment[i],
          source_id: response_memberpayment[i].id,
          created_at: toUTCISOString(response_memberpayment[i].created_at),
          updated_at: toUTCISOString(response_memberpayment[i].updated_at),
          user_id: data_user._id,
        });
      }
    }
    if (data_mongo.length === 0) {
      return [];
    }
    let inser_data = await MemberPaymentModel.insertMany(data_mongo);
    return inser_data;
  } catch (error) {
    throw error;
  }
};
