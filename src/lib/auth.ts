import { cookies } from "next/headers";
import { getUserById } from "../models/users/user_m";
import { SECRET } from "../helpers";
import jwt from "jsonwebtoken";

export const verifyToken = (token: string): { _id: string } => {
  return jwt.verify(token, SECRET) as { _id: string };
};
export const getCurrentUser = async (): Promise<any | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return null;
    }
    const decode = verifyToken(token);
    let cek_user = await getUserById(decode._id);
    if (!cek_user) {
      return null;
    }
    return cek_user;
  } catch (error) {
    return null;
  }
};
