// member_personals => detail informasi member
import mongoose, { Schema, Document, Model, model } from "mongoose";

const MODEL_NAME = "weigh_measure";

export interface IWeighMeasure extends Document {
  source_id: number;
  user_id: mongoose.Types.ObjectId;
  wm_date: Date;
  age: number;
  height: string;
  bp_high: number;
  bp_low: number;
  rhr: number;
  chest: string;
  waist: string;
  abdomen: string;
  hip: string;
  thigh: string;
  arm: string;
  weight: string;
  body_fat: string;
  muscle_mass: string;
  bone_mass: string;
  bmi: string;
  dci: string;
  metabolic: string;
  body_water: string;
  visceral: string;
  three_times_a_week: string;
  total_wo_per_month: number;
  total_measurement: string;
  total_body_fat: string;
  total_hydration: string;
  measured_by: string;
  pro_workout: string;
  created_at: Date;
  updated_at: Date;
  recommendation: string;
}

const WeighMeasureSchema: Schema = new Schema<IWeighMeasure>(
  {
    source_id: {
      type: Number,
      default: null,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user_m",
      default: null,
    },
    wm_date: { type: Date, default: null },

    age: { type: Number, default: null },
    height: { type: String, default: null },

    bp_high: { type: Number, default: null },
    bp_low: { type: Number, default: null },
    rhr: { type: Number, default: null },

    chest: { type: String, default: null },
    waist: { type: String, default: null },
    abdomen: { type: String, default: null },
    hip: { type: String, default: null },
    thigh: { type: String, default: null },
    arm: { type: String, default: null },

    weight: { type: String, default: null },
    body_fat: { type: String, default: null },
    muscle_mass: { type: String, default: null },
    bone_mass: { type: String, default: null },

    bmi: { type: String, default: null },
    dci: { type: String, default: null },
    metabolic: { type: String, default: null },
    body_water: { type: String, default: null },
    visceral: { type: String, default: null },

    three_times_a_week: { type: String, default: null },
    total_wo_per_month: { type: Number, default: null },

    total_measurement: { type: String, default: null },
    total_body_fat: { type: String, default: null },
    total_hydration: { type: String, default: null },

    measured_by: { type: String, default: null },
    pro_workout: { type: String, default: null },

    recommendation: { type: String, default: null },
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

export const WeighMeasure: Model<IWeighMeasure> =
  mongoose.models[MODEL_NAME] ||
  mongoose.model<IWeighMeasure>(MODEL_NAME, WeighMeasureSchema, MODEL_NAME);

export const insertWeighMeasureByUserId = (data: IWeighMeasure) =>
  WeighMeasure.insertOne(data);

export const getWeighMeasureByUserId = (
  user_id: string,
  skip: number,
  limit: number,
) =>
  WeighMeasure.find({ user_id })
    .select("-user_id")
    .skip(skip)
    .limit(limit)
    .lean();

export const getWeighMeasureBySourceId = (source_id: number) =>
  WeighMeasure.findOne({ source_id });

export const getWeighMeasureUser = (data: any, skip: number, limit: number) =>
  WeighMeasure.find(data)
    .select("-user_id")
    .skip(skip)
    .limit(limit)
    .sort({ wm_date: -1 })
    .lean();
