import { NextRequest } from "next/server";
import { api } from "../lib/axios";
import { toUTCISOString } from "../helpers";
import { ClubModel, getClubBySourceId } from "../models/clubs/club_m";
import { BankModel, getBankBySourceId } from "../models/banks/bank_m";
import { BankClubModel, getBankClub } from "../models/banks/bank_club";

export const syncDataBankByClubIdFromCMS = async (
  req: NextRequest,
): Promise<any | null> => {
  try {
    const { searchParams } = new URL(req.url);
    const club_id = searchParams.get("club_id");
    let data_club = await getClubBySourceId(Number(club_id));
    if (!data_club) {
      throw new Error("club_id tidak ditemukan");
    }
    const { data } = await api.get(`/bank-club?club_id=${club_id}`);
    let curr_response = data.response;
    if (curr_response.length > 0) {
      for (let j = 0; j < curr_response.length; j++) {
        let curr_bank = curr_response[j];
        let cek_data_bank = await getBankBySourceId(curr_bank.id);
        if (!cek_data_bank) {
          let new_data = await BankModel.insertOne({
            ...curr_bank,
            source_id: curr_bank.id,
            created_at: toUTCISOString(curr_bank.created_at),
            updated_at: toUTCISOString(curr_bank.updated_at),
          });
          cek_data_bank = new_data;
        }
        let cek_bankclub = await getBankClub(
          data_club._id.toString(),
          cek_data_bank._id.toString(),
        );
        if (!cek_bankclub) {
          await BankClubModel.insertOne({
            club_id: data_club._id,
            bank_id: cek_data_bank._id,
          });
        }
      }
    }
    return curr_response;
  } catch (error) {
    throw error;
  }
};
