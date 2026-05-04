import {
  getUserById,
  getUserByIdAndClubId,
  getUserBySourceId,
  updateUserById,
} from "../models/users/user_m";
import { toUTCISOString } from "../helpers";
import { NextRequest } from "next/server";
import { api } from "../lib/axios";
import {
  getWeighMeasureBySourceId,
  getWeighMeasureUser,
  WeighMeasure,
} from "../models/weighmeasures/weigh_measure";
import { getClubBySourceId } from "../models/clubs/club_m";
import {
  getWorkOutByUserIdAndWorkOutDate,
  WorkOut,
} from "../models/workouts/workout_m";
import { getUserLogin } from "../lib/auth";

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

export const insertNewWorkOutToMongodb = async (
  req: NextRequest,
): Promise<any | null> => {
  try {
    const body = await req.json();
    const { id, user_id, club_id, workout_date } = body;
    let data_user = await getUserBySourceId(user_id);
    if (!data_user) {
      return null;
    }
    let data_club = await getClubBySourceId(club_id);
    if (!data_club) {
      return null;
    }
    let current_date = new Date();
    let workout_today = await getWorkOutByUserIdAndWorkOutDate(
      data_user._id.toString(),
      current_date,
    );
    if (workout_today) {
      return workout_today;
    }
    let req_body = {
      source_id: id,
      user_id: data_user._id,
      club_id: data_club._id,
      workout_date: toUTCISOString(workout_date),
    };
    let insert_user = await WorkOut.insertOne(req_body);

    // sync attendance to mobile
    let workout_club = await getUserByIdAndClubId(
      data_user._id.toString(),
      data_club._id.toString(),
    );
    if (!workout_club) {
      await updateUserById(data_user._id.toString(), {
        club_id: data_club._id.toString(),
      });
    }
    return insert_user;
  } catch (error) {
    throw error;
  }
};

export const insertNewWorkOutWithUserLoginToMongodb = async (
  req: NextRequest,
): Promise<any | null> => {
  try {
    const decode = await getUserLogin(req);
    const body = await req.json();
    const { club_id, workout_source_id } = body;
    let cek_user = await getUserById(decode._id);
    if (!cek_user) {
      throw Error("pengguna tidak ditemukan");
    }
    let current_date = new Date();
    let workout_today = await getWorkOutByUserIdAndWorkOutDate(
      decode._id.toString(),
      current_date,
    );
    if (workout_today) {
      return workout_today;
    }
    // improve create data from cms than push to mongodb
    let req_body = {
      source_id: workout_source_id,
      user_id: decode._id,
      club_id,
      workout_date: current_date,
    };
    let insert_user = await WorkOut.insertOne(req_body);
    // check when club's is empty at user collection
    let workout_club = await getUserByIdAndClubId(
      decode._id.toString(),
      club_id,
    );
    if (!workout_club) {
      await updateUserById(decode._id.toString(), { club_id });
    }
    return insert_user;
  } catch (error) {
    throw error;
  }
};

export const getDataWeighMeasureByUserIdPerMonth = async (
  req: NextRequest,
): Promise<any | null> => {
  try {
    const { searchParams } = new URL(req.url);
    const decode = await getUserLogin(req);
    let cek_user = await getUserById(decode._id);
    if (!cek_user) {
      throw Error("pengguna tidak ditemukan");
    }
    let body: any = {
      user_id: decode._id.toString(),
    };
    const total = await WeighMeasure.countDocuments(body);
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
    body.wm_date = {
      $gte: start_date,
      $lt: end_date,
    };
    const total_wm_per_month = await WeighMeasure.countDocuments(body);
    const data_workout = await getWeighMeasureUser(body, 0, total_wm_per_month);
    const response_data = {
      total_wm_per_month,
      total,
      response: data_workout,
      ...body,
    };
    return response_data;
  } catch (error) {
    throw error;
  }
};
