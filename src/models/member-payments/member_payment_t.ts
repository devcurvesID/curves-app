import mongoose, { Schema, Document, Model, model } from "mongoose";

const MODEL_NAME = "member_payment_t";

export interface IMemberPayment extends Document {
  source_id: number;
  user_id: mongoose.Types.ObjectId;
  payment_number: string;
  sf_amount: string;
  mf_amount: number;
  dc_amount: number;
  tax_type_id: number;
  tax_amount: number;
  tax_percentage: string;
  amount_due: number;
  payment_category: string;
  payment_date: Date;
  payment_method_id: mongoose.Types.ObjectId;
  amount_paid: number;
  rest_of_bill: number;
  payment_status: string;
  bank_id: mongoose.Types.ObjectId;
  renewal: boolean;
  conversion: boolean;
  deposit_amount: string;
  created_at: Date;
  updated_at: Date;
}

const MemberPaymentSchema: Schema = new Schema<IMemberPayment>(
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
    payment_method_id: {
      type: Schema.Types.ObjectId,
      ref: "payment_method_m",
      default: null,
    },
    bank_id: {
      type: Schema.Types.ObjectId,
      ref: "bank_m",
      default: null,
    },
    payment_number: {
      type: String,
      default: null,
    },
    sf_amount: {
      type: String,
      default: null,
    },
    mf_amount: {
      type: Number,
      default: null,
    },
    dc_amount: {
      type: Number,
      default: null,
    },
    tax_type_id: {
      type: Number,
      default: null,
    },
    tax_amount: {
      type: Number,
      default: null,
    },
    tax_percentage: {
      type: String,
      default: null,
    },
    amount_due: {
      type: Number,
      default: null,
    },
    payment_category: {
      type: String,
      default: null,
    },
    payment_date: {
      type: Date,
      default: null,
    },
    amount_paid: {
      type: Number,
      default: null,
    },
    rest_of_bill: {
      type: Number,
      default: null,
    },
    payment_status: {
      type: String,
      default: null,
    },
    renewal: {
      type: Boolean,
      default: false,
    },
    conversion: {
      type: Boolean,
      default: false,
    },
    deposit_amount: {
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

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  },
);

MemberPaymentSchema.virtual("payment_method", {
  ref: "payment_method_m",
  localField: "payment_method_id",
  foreignField: "_id",
  justOne: true,
});

MemberPaymentSchema.virtual("bank", {
  ref: "bank_m",
  localField: "bank_id",
  foreignField: "_id",
  justOne: true,
});

MemberPaymentSchema.virtual("user", {
  ref: "user_m",
  localField: "user_id",
  foreignField: "_id",
  justOne: true,
});

export const MemberPaymentModel: Model<IMemberPayment> =
  mongoose.models[MODEL_NAME] ||
  mongoose.model<IMemberPayment>(MODEL_NAME, MemberPaymentSchema, MODEL_NAME);
export const getMemberPaymentBySourceId = (source_id: number) =>
  MemberPaymentModel.findOne({ source_id });

export const getMemberPaymentById = (_id: string) =>
  MemberPaymentModel.findOne({ _id });

export const getMemberPaymentByUserMember = (user_id: string) =>
  MemberPaymentModel.find({ user_id })
    .select("-user_id -id")
    .populate("payment_method")
    .populate("bank");

export const getMemberPaymentByUserId = (user_id: string) =>
  MemberPaymentModel.find({ user_id })
    .populate("payment_method")
    .populate("bank")
    .populate("user");
