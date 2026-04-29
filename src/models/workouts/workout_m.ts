// member_personals => detail informasi member
import mongoose, { Schema, Document, Model, model } from "mongoose";

const MODEL_NAME = "workout_m";

export interface IWorkOut extends Document {
  source_id: number;
  user_id: mongoose.Types.ObjectId;
  club_id: mongoose.Types.ObjectId;
  workout_date: Date;
  created_at: Date;
  updated_at: Date;
}

const WorkOutSchema: Schema = new Schema<IWorkOut>(
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
    club_id: {
      type: Schema.Types.ObjectId,
      ref: "club_m",
      default: null,
    },
    workout_date: {
      type: Date,
      required: true,
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

export const WorkOut: Model<IWorkOut> =
  mongoose.models[MODEL_NAME] ||
  mongoose.model<IWorkOut>(MODEL_NAME, WorkOutSchema, MODEL_NAME);

export const insertWorkOutByUserId = (data: IWorkOut) =>
  WorkOut.insertOne(data);

export const getWorkOutBySourceId = (source_id: number) =>
  WorkOut.findOne({ source_id });

export const getWorkOutByUserId = (user_id: string) =>
  WorkOut.findOne({ user_id });
