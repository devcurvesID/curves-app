// member_personals => detail informasi member
import mongoose, { Schema, Document, Model, model } from "mongoose";

const MODEL_NAME = "member_status";

export interface IMemberStatus extends Document {
  user_id: mongoose.Types.ObjectId;
  membership_type_id: mongoose.Types.ObjectId;
  status: string;
  last_wm: Date;
  from_date: Date;
  thru_date: Date;
  member_vip_status: string;
  payment_status: string;
  wm_schedule: string;
  qr_generate: boolean;
  ignore_wa: boolean;
  created_at: Date;
  updated_at: Date;
}

const MemberStatusSchema: Schema = new Schema<IMemberStatus>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user_m",
      default: null,
    },
    membership_type_id: {
      type: Schema.Types.ObjectId,
      ref: "membership_type_m",
      default: null,
    },
    status: {
      type: String,
      default: "Active",
    },
    payment_status: {
      type: String,
      default: "Active",
    },
    from_date: {
      type: Date,
      default: null,
    },
    thru_date: {
      type: Date,
      default: null,
    },
    last_wm: {
      type: Date,
      default: null,
    },
    member_vip_status: {
      type: String,
      default: null,
    },
    wm_schedule: {
      type: String,
      default: null,
    },
    qr_generate: {
      type: Boolean,
      default: false,
    },
    ignore_wa: {
      type: Boolean,
      default: false,
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

export const MemberStatusModel: Model<IMemberStatus> =
  mongoose.models[MODEL_NAME] ||
  mongoose.model<IMemberStatus>(MODEL_NAME, MemberStatusSchema, MODEL_NAME);

export const getMemberStatusByUserId = (user_id: string) =>
  MemberStatusModel.findOne({ user_id });

export const getMemberStatusByPhone = (phone: number) =>
  MemberStatusModel.findOne({ phone });
