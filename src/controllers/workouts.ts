import { getUserBySourceId } from "../models/users/user_m";
import { toUTCISOString } from "../helpers";
import { NextRequest } from "next/server";
import { api } from "../lib/axios";
import { getWorkOutBySourceId, WorkOut } from "../models/workouts/workout_m";
import { getClubBySourceId } from "../models/clubs/club_m";

export const getDataWorkOutByUserId = async (
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
    } = await api.get(`/user-workout?user_id=${user_id}`);
    let response_cms = response;
    if (response_cms.length === 0) {
      return [];
    }
    let data_mongo = [];
    for (let i = 0; i < response_cms.length; i++) {
      let cek_sourceid = await getWorkOutBySourceId(response_cms[i].id);
      if (!cek_sourceid) {
        let data_club = await getClubBySourceId(response_cms[i].club_id);
        if (!data_club) {
          throw new Error("club tidak ditemukan");
        }
        data_mongo.push({
          ...response_cms[i],
          source_id: response_cms[i].id,
          club_id: data_club._id,
          workout_date: toUTCISOString(response_cms[i].workout_date),
          created_at: toUTCISOString(response_cms[i].created_at),
          updated_at: toUTCISOString(response_cms[i].updated_at),
          user_id: curr_data._id,
        });
      }
    }
    if (data_mongo.length === 0) {
      return [];
    }
    let insert_data = await WorkOut.insertMany(data_mongo);
    return insert_data;
  } catch (error) {
    throw error;
  }
};
