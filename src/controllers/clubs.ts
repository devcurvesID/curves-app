import { NextRequest } from "next/server";
import { api } from "../lib/axios";
import { toUTCISOString } from "../helpers";
import { ClubModel, getClubBySourceId } from "../models/clubs/club_m";

export const syncDataClubFromCMS = async (): Promise<any | null> => {
  try {
    const { data } = await api.get(`/club`);
    let curr_response = data.response;
    if (curr_response.length > 0) {
      for (let j = 0; j < curr_response.length; j++) {
        let curr_club = curr_response[j];
        let cek_data_bank = await getClubBySourceId(curr_club.id);
        if (!cek_data_bank) {
          await ClubModel.insertOne({
            ...curr_club,
            source_id: curr_club.id,
            created_at: toUTCISOString(curr_club.created_at),
            updated_at: toUTCISOString(curr_club.updated_at),
          });
        }
      }
    }
    return curr_response;
  } catch (error) {
    throw error;
  }
};
