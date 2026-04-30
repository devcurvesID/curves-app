import mongoose, { Schema, Document, Model, model } from "mongoose";

const MODEL_NAME = "user_m";

export interface IUser extends Document {
  source_id: number;
  name: string;
  email: string;
  password: string;
  remember_token: string;
  created_at: Date;
  updated_at: Date;
  username: string;
  role_id: mongoose.Types.ObjectId[];
  club_id: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema<IUser>(
  {
    source_id: {
      type: Number,
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
      // unique: true,
      // lowercase: true,
      // trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    remember_token: {
      type: String,
      default: null,
    },
    club_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "club_m",
        default: null,
      },
    ],
    role_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "role_m",
        default: null,
      },
    ],
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

export const UserModel: Model<IUser> =
  mongoose.models[MODEL_NAME] ||
  mongoose.model<IUser>(MODEL_NAME, UserSchema, MODEL_NAME);

export const insertNewUser = (data: IUser) => UserModel.insertOne(data);

export const getUserBySourceId = (source_id: number) =>
  UserModel.findOne({ source_id });

export const getUserByUsername = (username: string) =>
  UserModel.findOne({ username });

// .lean() => mengembalikan object javascript biasa untuk menghemat memori
export const getUserById = (_id: string) =>
  UserModel.findById(_id).select("-password -remember_token -username").lean();

export const getUserByEmailOrUsername = (value: string) =>
  UserModel.findOne({
    $or: [{ username: value }, { email: value }],
  });

export const updateUserById = (_id: string, data: any) =>
  UserModel.updateOne({ _id }, { $set: data });

export const getUserByIdAndClubId = (_id: string, club_id: string) =>
  UserModel.findOne({ _id, club_id }).lean();

export const findUserModel = (data: any, skip: number, limit: number) =>
  UserModel.find(data)
    .select("-password -remember_token -username")
    .skip(skip)
    .limit(limit)
    .lean();
