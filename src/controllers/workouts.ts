import { getUserById, getUserBySourceId } from "../models/users/user_m";
import { toUTCISOString } from "../helpers";
import { NextRequest } from "next/server";
import { api } from "../lib/axios";
import {
  getWorkOutBySourceId,
  getWorkOutUser,
  WorkOut,
} from "../models/workouts/workout_m";
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

export const getDataWorkOutByUserIdPerMonth = async (
  req: NextRequest,
  user_id: string,
): Promise<any | null> => {
  try {
    const { searchParams } = new URL(req.url);
    let cek_user = await getUserById(user_id);
    if (!cek_user) {
      throw Error("pengguna tidak ditemukan");
    }
    let body: any = {
      user_id,
      club_id: { $in: cek_user.club_id },
    };
    const total = await WorkOut.countDocuments(body);
    const club_id = searchParams.get("club_id");
    if (club_id) {
      body.club_id = club_id;
    }
    let year = searchParams.get("year");
    let month = searchParams.get("month");
    if (!year) {
      let curr_year = new Date().getFullYear();
      year = curr_year.toString();
    }
    if (!month) {
      let curr_month = new Date().getMonth() + 1;
      month = curr_month.toString();
    }
    let start_date = new Date(Number(year), Number(month), 1);
    let end_date = new Date(Number(year), Number(month) + 1, 1);
    body.workout_date = {
      $gte: start_date,
      $lt: end_date,
    };
    const total_workout_per_month = await WorkOut.countDocuments(body);
    const data_workout = await getWorkOutUser(body, 0, total_workout_per_month);
    const response_data = {
      total_workout_per_month,
      total,
      response: data_workout,
      ...body,
    };
    return response_data;
  } catch (error) {
    throw error;
  }
};

export const getDataLastWorkOutByUserId = async (
  user_id: string,
): Promise<any | null> => {
  try {
    const data_workout = await WorkOut.findOne({
      user_id,
    })
      .populate("club", "club_name")
      .sort({ workout_date: -1 });
    const response_data = {
      response: data_workout,
    };
    return response_data;
  } catch (error) {
    throw error;
  }
};
