import mongoose, { Schema, Document, Model, model } from "mongoose";

const MODEL_NAME = "payment_method_m";

export interface IPaymentMethod extends Document {
  source_id: number;
  payment_method: string;
  created_at: Date;
  updated_at: Date;
}

const PaymentMethodSchema: Schema = new Schema<IPaymentMethod>(
  {
    source_id: {
      type: Number,
      default: null,
    },
    payment_method: {
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

export const PaymentMethodModel: Model<IPaymentMethod> =
  mongoose.models[MODEL_NAME] ||
  mongoose.model<IPaymentMethod>(MODEL_NAME, PaymentMethodSchema, MODEL_NAME);
export const getPaymentMethodBySourceId = (source_id: number) =>
  PaymentMethodModel.findOne({ source_id }).lean();

export const getPaymentMethodById = (_id: string) =>
  PaymentMethodModel.findOne({ _id });
