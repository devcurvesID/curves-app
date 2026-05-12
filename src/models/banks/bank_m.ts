import mongoose, { Schema, Document, Model, model } from "mongoose";

const MODEL_NAME = "bank_m";

export interface IBank extends Document {
  source_id: number;
  bank_name: string;
  bank_abv: string;
  bank_account_number: string;
  coa_id: number;
  created_at: Date;
  updated_at: Date;
}

const BankSchema: Schema = new Schema<IBank>(
  {
    source_id: {
      type: Number,
      default: null,
    },
    bank_name: {
      type: String,
      required: true,
    },
    bank_abv: {
      type: String,
      required: true,
    },
    bank_account_number: {
      type: String,
      default: null,
    },
    coa_id: {
      type: Number,
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

export const BankModel: Model<IBank> =
  mongoose.models[MODEL_NAME] ||
  mongoose.model<IBank>(MODEL_NAME, BankSchema, MODEL_NAME);
export const getBankBySourceId = (source_id: number) =>
  BankModel.findOne({ source_id }).lean();

export const getBankById = (_id: string) => BankModel.findOne({ _id });
