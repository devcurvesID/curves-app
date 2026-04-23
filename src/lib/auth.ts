import { cookies } from "next/headers";
import { getUserById } from "../models/users/user_m";
import { SECRET, verifyToken } from "../helpers";
import jwt from "jsonwebtoken";

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
