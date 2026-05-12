// member_personals => detail informasi member
import mongoose, { Schema, Document, Model, model } from "mongoose";

const MODEL_NAME = "bank_club";

export interface IBankClub extends Document {
  bank_id: mongoose.Types.ObjectId;
  club_id: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const BankClubSchema: Schema = new Schema<IBankClub>(
  {
    club_id: {
      type: Schema.Types.ObjectId,
      ref: "club_m",
      default: null,
    },
    bank_id: {
      type: Schema.Types.ObjectId,
      ref: "bank_m",
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    collection: MODEL_NAME, // 🔥 fix model name
    strict: true, // agar tidak meng-insert nilai selain yang disetup di collection
  },
);

export const BankClubModel: Model<IBankClub> =
  mongoose.models[MODEL_NAME] ||
  mongoose.model<IBankClub>(MODEL_NAME, BankClubSchema, MODEL_NAME);

export const insertBankClub = (data: IBankClub) =>
  BankClubModel.insertOne(data);

export const getBankClubByClubId = (club_id: string) =>
  BankClubModel.find({ club_id }).lean();

export const getBankClub = (club_id: string, bank_id: string) =>
  BankClubModel.findOne({ club_id, bank_id }).lean();
