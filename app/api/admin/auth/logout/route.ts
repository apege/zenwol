import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export async function POST() {
  try {
    const res = NextResponse.json({
      success: true,
      message: "Berhasil logout.",
    });

    res.cookies.set(ADMIN_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });

    return res;
  } catch (error) {
    console.error("Logout API Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal logout." },
      { status: 500 }
    );
  }
}
