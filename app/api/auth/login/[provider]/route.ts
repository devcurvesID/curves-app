import { verifyPassword, generateToken } from "@/src/helpers";
import connectDB from "@/src/lib/mongodb";
import { getUserByUsername } from "@/src/models/users/user_m";
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
    const { username, password } = body;
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
      console.log("data_user", data_user);

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
      const user_id = data_user._id.toString();
      let userToken = await generateToken(user_id);
      const response_data = NextResponse.json({
        response: {
          _id: data_user._id,
          source_id: data_user.source_id,
          name: data_user.name,
          token: userToken,
        },
      });
      // response_data.cookies.set("token", userToken, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      //   sameSite: "lax",
      //   maxAge: 60 * 60 * 24 * 7,
      //   path: "/",
      // });
      response_data.cookies.set("token", userToken, {
        httpOnly: true,
        secure: false, //process.env.NODE_ENV === "production",
        sameSite: "none", // kalau beda domain
        path: "/",
        domain: process.env.NEXT_PUBLIC_DOMAIN,
        maxAge: 60 * 60 * 24 * 7,
      });
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
