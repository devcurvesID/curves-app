import { formatToISO, toUTCISOString } from "@/src/helpers";
import { getCurrentUser, getUserLogin } from "@/src/lib/auth";
import { api } from "@/src/lib/axios";
import connectDB from "@/src/lib/mongodb";
import {
  getUserBySourceId,
  insertNewUser,
  updateUserById,
  UserModel,
} from "@/src/models/users/user_m";
import { insertUserPersonalByUserId } from "@/src/models/users/user_personal";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");
  // {{CSF_BASE_URL}}api/user-member?phone=082299630427
  try {
    await connectDB();
    if (phone) {
      const {
        data: { response },
      } = await api.get(`/user-member?phone=${phone}`);
      if (!response) {
        return NextResponse.json(
          {
            error: "pengguna tidak ditemukan",
          },
          { status: 404 },
        );
      }
      return NextResponse.json({ response: response }, { status: 200 });
    }
    return NextResponse.json({ response: [] }, { status: 200 });
  } catch (error: any) {
    let error_response = error.message ? error.message : "Server Error";
    return NextResponse.json({ error: error_response }, { status: 404 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const decode = await getUserLogin(req);
    await updateUserById(decode._id, body);
    return NextResponse.json(
      { response: { _id: decode._id, update: body } },
      { status: 200 },
    );
  } catch (error: any) {
    let error_response = error.message ? error.message : "Server Error";
    return NextResponse.json({ error: error_response }, { status: 404 });
  }
}
