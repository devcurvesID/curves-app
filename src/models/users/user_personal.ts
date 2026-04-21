// member_personals => detail informasi member
import mongoose, { Schema, Document, Model, model } from "mongoose";

const MODEL_NAME = "user_personal";

export interface IUserPersonal extends Document {
  user_id: mongoose.Types.ObjectId;
  birth: Date;
  sex: string;
  address: string;
  postal: number;
  phone: number;
  cellphone: number;
  nik: number;
  photo: string;
  key_tag_id: number;
  joined: Date;
  tshirt_size: number;
  flag: string;
}

const UserPersonalSchema: Schema = new Schema<IUserPersonal>(
  {
    birth: {
      type: Date,
      default: null,
    },
    joined: {
      type: Date,
      required: true,
    },
    postal: {
      type: Number,
      default: null,
    },
    nik: {
      type: Number,
      default: null,
    },
    tshirt_size: {
      type: Number,
      default: null,
    },
    sex: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: null,
    },
    phone: {
      type: Number,
      default: null,
      // unique: true,
      // lowercase: true,
      // trim: true,
    },
    cellphone: {
      type: Number,
      default: null,
      // unique: true,
      // lowercase: true,
      // trim: true,
    },
    photo: {
      type: String,
      default: null,
    },
    flag: {
      type: String,
      default: null,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user_m",
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

export const UserPersonal: Model<IUserPersonal> =
  mongoose.models[MODEL_NAME] ||
  mongoose.model<IUserPersonal>(MODEL_NAME, UserPersonalSchema, MODEL_NAME);

export const insertUserPersonalByUserId = (data: IUserPersonal) =>
  UserPersonal.insertOne(data);
