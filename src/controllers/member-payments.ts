import { NextRequest } from "next/server";
import { api } from "../lib/axios";
import { toUTCISOString } from "../helpers";
import {
  getMemberPaymentBySourceId,
  getMemberPaymentByUserMember,
  MemberPaymentModel,
} from "../models/member-payments/member_payment_t";
import { getUserBySourceId } from "../models/users/user_m";
import { BankModel, getBankBySourceId } from "../models/banks/bank_m";
import { getPaymentMethodBySourceId } from "../models/payments/payment_method_m";
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
    for (let i = 0; i < response_memberpayment.length; i++) {
      let m_payment = response_memberpayment[i];
      let cek_sourceid = await getMemberPaymentBySourceId(m_payment.id);
      if (!cek_sourceid) {
        let cek_data_bank = await getBankBySourceId(m_payment.bank_id);
        if (!cek_data_bank) {
          const { data } = await api.get(`/bank-club?id=${m_payment.bank_id}`);
          let data_bank_cms = data.response;
          if (!data_bank_cms) {
            throw new Error("data bank tidak ditemukan");
          }
          let new_data = await BankModel.insertOne({
            ...data_bank_cms,
            source_id: data_bank_cms.id,
            created_at: toUTCISOString(data_bank_cms.created_at),
            updated_at: toUTCISOString(data_bank_cms.updated_at),
          });
          cek_data_bank = new_data;
        }
        let cek_data_payment = await getPaymentMethodBySourceId(
          m_payment.payment_method_id,
        );
        await MemberPaymentModel.insertOne({
          ...m_payment,
          source_id: m_payment.id,
          created_at: toUTCISOString(m_payment.created_at),
          updated_at: toUTCISOString(m_payment.updated_at),
          user_id: data_user._id,
          bank_id: cek_data_bank._id,
          payment_method_id: cek_data_payment ? cek_data_payment._id : null,
        });
      }
    }
    return response_memberpayment;
  } catch (error) {
    throw error;
  }
};

export const getDataMemberPaymentByUserId = async (
  user_id: string,
): Promise<any | null> => {
  try {
    const data_payment = await getMemberPaymentByUserMember(user_id);
    const response_data = {
      response: data_payment,
    };
    return response_data;
  } catch (error) {
    throw error;
  }
};
