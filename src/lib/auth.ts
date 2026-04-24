import { cookies } from "next/headers";
import { getUserById } from "../models/users/user_m";
import { SECRET, verifyToken } from "../helpers";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { getUserPersonalByUserId } from "../models/users/user_personal";

export const getCurrentUser = async (req: NextRequest): Promise<any | null> => {
  try {
    const osHeader = req.headers.get("x-platform-os");
    if (osHeader === "android" || osHeader === "ios") {
      const authHeader = req.headers.get("authorization");
      let headerToken: string | null = null;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        headerToken = authHeader.split(" ")[1];
      }
      if (!headerToken) {
        return null;
      }
      const decode = verifyToken(headerToken);
      let cek_user = await getUserById(decode._id);
      if (!cek_user) {
        return null;
      }
      let cek_userpersonal = await getUserPersonalByUserId(
        decode._id.toString(),
      );
      let body_response = {
        ...cek_user,
        user_personal: cek_userpersonal,
      };
      return body_response;
    }
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
    let cek_userpersonal = await getUserPersonalByUserId(decode._id.toString());
    let body_response = {
      ...cek_user,
      user_personal: cek_userpersonal,
    };
    return body_response;
  } catch (error) {
    return null;
  }
};
