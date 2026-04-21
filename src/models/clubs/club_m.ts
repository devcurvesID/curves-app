import mongoose, { Schema, Document, Model, model } from "mongoose";

const MODEL_NAME = "club_m";

export interface IClub extends Document {
  source_id: number;
  club_name: string;
  email: string;
  postal: number;
  digital_product: boolean;
  address: string;
  city: string;
  province: string;
  country: string;
  phones: number;
  facebook: string;
  photo: string;
  longitude: string;
  latitude: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  club_code: string;
  current_sequence: number;
  current_lead_sequence: number;
  hq: boolean;
  jubilant_id: number;
  image: string;
  accurate_id: number;
  accurate_branch: string;
}

const ClubSchema: Schema = new Schema<IClub>(
  {
    source_id: {
      type: Number,
      default: null,
    },
    club_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      // unique: true,
      // lowercase: true,
      // trim: true,
    },
    postal: {
      type: Number,
      default: null,
    },
    digital_product: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: "indonesia",
    },
    phones: {
      type: Number,
      required: true,
    },
    facebook: {
      type: String,
      default: null,
    },
    photo: {
      type: String,
      default: null,
    },
    longitude: {
      type: String,
      default: null,
    },
    latitude: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: "Active",
    },
    club_code: {
      type: String,
      required: true,
    },

    current_sequence: {
      type: Number,
      default: null,
    },
    current_lead_sequence: {
      type: Number,
      default: null,
    },
    hq: {
      type: Boolean,
      default: false,
    },
    jubilant_id: {
      type: Number,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    accurate_id: {
      type: Number,
      default: null,
    },
    accurate_branch: {
      type: String,
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

export const ClubModel: Model<IClub> =
  mongoose.models[MODEL_NAME] ||
  mongoose.model<IClub>(MODEL_NAME, ClubSchema, MODEL_NAME);
export const getClubBySourceId = (source_id: number) =>
  ClubModel.findOne({ source_id });
