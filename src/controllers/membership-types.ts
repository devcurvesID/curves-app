import { NextRequest } from "next/server";
import { api } from "../lib/axios";
import {
  getMemberShipTypeBySourceId,
  MemberShipTypeModel,
} from "../models/membership-types/membership_type_m";
import { toUTCISOString } from "../helpers";

export const syncDataMemberShipTypesFromCMS = async (): Promise<any | null> => {
  try {
    const {
      data: { response },
    } = await api.get(`/membership-type`);
    let response_measures = response;
    if (response_measures.length === 0) {
      return [];
    }
    let data_mongo = [];
    for (let i = 0; i < response_measures.length; i++) {
      let cek_sourceid = await getMemberShipTypeBySourceId(
        response_measures[i].id,
      );
      if (!cek_sourceid) {
        data_mongo.push({
          ...response_measures[i],
          source_id: response_measures[i].id,
          created_at: toUTCISOString(response_measures[i].created_at),
          updated_at: toUTCISOString(response_measures[i].updated_at),
        });
      }
    }
    if (data_mongo.length === 0) {
      return [];
    }
    let inser_data = await MemberShipTypeModel.insertMany(data_mongo);
    return inser_data;
  } catch (error) {
    throw error;
  }
};
