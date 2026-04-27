import { cookies } from "next/headers";
import { getUserById, getUserBySourceId } from "../models/users/user_m";
import { SECRET, toUTCISOString, verifyToken } from "../helpers";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { getUserPersonalByUserId } from "../models/users/user_personal";
import { api } from "../lib/axios";
import {
  getWeighMeasureBySourceId,
  insertWeighMeasureByUserId,
  WeighMeasure,
} from "../models/weighmeasures/weigh_measure";

export const getDataWeighMeasureByUserId = async (
  req: NextRequest,
): Promise<any | null> => {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    let curr_data = await getUserBySourceId(Number(user_id));
    if (!curr_data) {
      throw new Error("data user tidak ditemukan");
    }
    const {
      data: { response },
    } = await api.get(`/weigh-measure?user_id=${user_id}`);
    let response_measures = response;
    if (response_measures.length === 0) {
      return [];
    }
    let data_mongo = [];
    for (let i = 0; i < response_measures.length; i++) {
      let cek_sourceid = await getWeighMeasureBySourceId(
        response_measures[i].id,
      );

      if (!cek_sourceid) {
        data_mongo.push({
          ...response_measures[i],
          source_id: response_measures[i].id,
          created_at: toUTCISOString(response_measures[i].created_at),
          updated_at: toUTCISOString(response_measures[i].updated_at),
          user_id: curr_data._id,
        });
      }
    }
    if (data_mongo.length === 0) {
      return [];
    }
    let inser_data = await WeighMeasure.insertMany(data_mongo);
    return inser_data;
  } catch (error) {
    throw error;
  }
};
