import { insertNewUserToMongodb } from "@/src/controllers/users";
import { hashPassword } from "@/src/helpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;
  const body = await req.json();
  if (!["logout", "verification", "member", "coach"].includes(provider)) {
    return NextResponse.json(
      { error: "provider not support" },
      { status: 400 },
    );
  }
  try {
    if (provider === "logout") {
      const response = NextResponse.json({
        message: "User logout successfully",
      });
      response.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
      });
      return response;
    }
    // API will be using when member's the first time registration account
    if (provider === "verification") {
      const { password, verify_password, username } = body;
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
      if (!verify_password) {
        return NextResponse.json(
          { error: "verify_password tidak boleh kosong" },
          { status: 404 },
        );
      }
      if (verify_password != password) {
        return NextResponse.json(
          { error: "verifikasi password tidak sesuai" },
          { status: 404 },
        );
      }
      const password_val = await hashPassword(password);
      let body_req = {
        ...body,
        password: password_val,
      };
      let insert_user = await insertNewUserToMongodb(body_req);
      return NextResponse.json({ response: insert_user }, { status: 200 });
    }
  } catch (error: any) {
    let error_response = error.message ? error.message : "Server Error";
    return NextResponse.json({ error: error_response }, { status: 404 });
  }
}
