import { hashPassword, random_bytes } from "@/src/helpers";
import connectDB from "@/src/lib/mongodb";
import { getRoleBySourceId } from "@/src/models/roles/role_m";
import { getUserByEmailOrUsername, UserModel } from "@/src/models/users/user_m";
import { USER_ROLE_COACH, USER_ROLE_MEMBER } from "@/src/utils/constants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;
  if (!["member", "coach"].includes(provider)) {
    return NextResponse.json(
      { error: "provider not support" },
      { status: 400 },
    );
  }
  try {
    await connectDB();
    const body = await req.json();
    const { username, password, email, name } = body;
    if (!email) {
      return NextResponse.json(
        { error: "email tidak boleh kosong" },
        { status: 404 },
      );
    }
    if (!name) {
      return NextResponse.json(
        { error: "nama tidak boleh kosong" },
        { status: 404 },
      );
    }
    if (!password) {
      return NextResponse.json(
        { error: "password tidak boleh kosong" },
        { status: 404 },
      );
    }
    const cek_user = await getUserByEmailOrUsername(email);
    if (cek_user) {
      return NextResponse.json(
        { error: "email sudah terdaftar, silahkan login" },
        { status: 404 },
      );
    }
    let username_value = email;
    if (username) {
      const cek_username = await getUserByEmailOrUsername(username);
      if (cek_username) {
        return NextResponse.json(
          { error: "username tidak valid" },
          { status: 404 },
        );
      }
      username_value = username;
    }
    let user_register = { ...body };

    let source_id: number = 0;
    if (provider === "member") {
      source_id = USER_ROLE_MEMBER;
    }
    if (provider === "coach") {
      source_id = USER_ROLE_COACH;
    }
    const password_val = await hashPassword(password);
    let role_data = await getRoleBySourceId(source_id);
    user_register.role_id = role_data ? role_data._id : null;
    user_register.password = password_val;
    user_register.username = username_value;
    let insert_new = await UserModel.insertOne(user_register);
    return NextResponse.json({ response: insert_new }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}
