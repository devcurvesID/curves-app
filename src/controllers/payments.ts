import { NextRequest } from "next/server";
import { api } from "../lib/axios";
import { toUTCISOString } from "../helpers";
import {
  getPaymentMethodBySourceId,
  PaymentMethodModel,
} from "../models/payments/payment_method_m";

export const syncDataPaymentMethodFromCMS = async (): Promise<any | null> => {
  try {
    const { data } = await api.get(`/payment-method`);
    let curr_response = data.response;
    if (curr_response.length > 0) {
      for (let j = 0; j < curr_response.length; j++) {
        let curr_payment = curr_response[j];
        let cek_data_bank = await getPaymentMethodBySourceId(curr_payment.id);
        if (!cek_data_bank) {
          await PaymentMethodModel.insertOne({
            ...curr_payment,
            source_id: curr_payment.id,
            created_at: toUTCISOString(curr_payment.created_at),
            updated_at: toUTCISOString(curr_payment.updated_at),
          });
        }
      }
    }
    return curr_response;
  } catch (error) {
    throw error;
  }
};
