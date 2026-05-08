import mongoose, { Schema, Document, Model, model } from "mongoose";

const MODEL_NAME = "membership_type_m";

export interface IMemberShipType extends Document {
  source_id: number;
  membership_type_name: string;
  membership_type: string;
  duration: string;
  payment_type: string;
  is_vip: string;
  accurate_code: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

const MemberShipTypeSchema: Schema = new Schema<IMemberShipType>(
  {
    source_id: {
      type: Number,
      default: null,
    },
    membership_type_name: {
      type: String,
      required: true,
    },
    membership_type: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    payment_type: {
      type: String,
      required: true,
    },

    is_vip: {
      type: String,
      default: null,
    },

    accurate_code: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      default: "Active",
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

export const MemberShipTypeModel: Model<IMemberShipType> =
  mongoose.models[MODEL_NAME] ||
  mongoose.model<IMemberShipType>(MODEL_NAME, MemberShipTypeSchema, MODEL_NAME);
export const getMemberShipTypeBySourceId = (source_id: number) =>
  MemberShipTypeModel.findOne({ source_id });

export const getMemberShipTypeById = (_id: string) =>
  MemberShipTypeModel.findOne({ _id });
