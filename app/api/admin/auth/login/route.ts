import { NextResponse } from "next/server";
import { createSessionToken, ADMIN_COOKIE_NAME, SESSION_MAX_AGE_SEC } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const envUser = (process.env.ADMIN_USERNAME || "admin_zenwol").trim();
    const envPass = (process.env.ADMIN_PASSWORD || "@Zenwol2026").trim();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username dan password wajib diisi." },
        { status: 400 }
      );
    }

    const cleanUser = String(username).trim();
    const cleanPass = String(password).trim();

    // Check username (case-insensitive)
    const isUserMatch = cleanUser.toLowerCase() === envUser.toLowerCase();

    // Check password: match process.env, or match @Zenwol2026 or @Admin123
    const isPassMatch =
      cleanPass === envPass ||
      cleanPass === "@Zenwol2026" ||
      cleanPass === "@Admin123";

    if (!isUserMatch || !isPassMatch) {
      return NextResponse.json(
        { success: false, message: "Username atau password salah!" },
        { status: 401 }
      );
    }

    const token = createSessionToken(cleanUser);

    const res = NextResponse.json({
      success: true,
      message: "Login berhasil!",
      user: {
        username: cleanUser,
        role: "Super Admin",
      },
    });

    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SEC,
    });

    return res;
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}
