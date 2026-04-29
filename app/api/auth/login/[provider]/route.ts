import { generateUserToken } from "@/src/controllers/users";
import { verifyPassword } from "@/src/helpers";
import connectDB from "@/src/lib/mongodb";
import { getUserById, getUserByUsername } from "@/src/models/users/user_m";
import { getUserPersonalByPhone } from "@/src/models/users/user_personal";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;
  if (!["member", "coach", "phone"].includes(provider)) {
    return NextResponse.json(
      { error: "provider not support" },
      { status: 400 },
    );
  }
  try {
    await connectDB();
    const body = await req.json();
    const { username, password, phone } = body;
    if (provider === "phone") {
      if (!phone) {
        return NextResponse.json(
          { error: "nomor ponsel tidak boleh kosong" },
          { status: 404 },
        );
      }
      let cek_user_phone = await getUserPersonalByPhone(Number(phone));
      if (!cek_user_phone) {
        return NextResponse.json(
          { error: "nomor ponsel belum terdaftar" },
          { status: 404 },
        );
      }
      let user_login = await getUserById(cek_user_phone.user_id.toString());
      const response_data = await generateUserToken(user_login);
      return response_data;
    }
    if (!username) {
      return NextResponse.json(
        { error: "username tidak boleh kosong" },
        { status: 404 },
      );
    }
    if (!password) {
      return NextResponse.json(
        { error: "password tidak boleh kosong" },
        { status: 404 },
      );
    }
    if (provider === "member") {
      const data_user = await getUserByUsername(username);
      if (!data_user) {
        return NextResponse.json(
          { error: "Data user tidak ditemukan" },
          { status: 404 },
        );
      }
      const validate_password = await verifyPassword(
        password,
        data_user.password,
      );
      if (!validate_password) {
        return NextResponse.json(
          { error: "username / password tidak valid" },
          { status: 404 },
        );
      }
      const response_data = await generateUserToken(data_user);
      return response_data;
    }
    if (provider === "coach") {
      return NextResponse.json({ response: "coach" }, { status: 200 });
    }
    return NextResponse.json({ response: provider }, { status: 200 });
  } catch (error: any) {
    let error_response = error.message ? error.message : "Server Error";
    return NextResponse.json({ error: error_response }, { status: 404 });
  }
}
