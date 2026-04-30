import mongoose, { Schema, Document, Model, model } from "mongoose";

const MODEL_NAME = "role_m";

export interface IRole extends Document {
  source_id: number; // id from cms
  role: string;
  created_at: Date;
  updated_at: Date;
}

const RoleSchema: Schema = new Schema<IRole>(
  {
    source_id: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
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

export const RoleModel: Model<IRole> =
  mongoose.models[MODEL_NAME] ||
  mongoose.model<IRole>(MODEL_NAME, RoleSchema, MODEL_NAME);
export const getRoleBySourceId = (source_id: number) =>
  RoleModel.findOne({ source_id });

export const getRoleById = (_id: string) => RoleModel.findOne({ _id });
