import { NextResponse } from "next/server";
import { isUserAdminAuthenticated } from "@/lib/adminAuth";

export async function GET() {
  try {
    const authenticated = await isUserAdminAuthenticated();
    const envUser = process.env.ADMIN_USERNAME || "admin_zenwol";

    return NextResponse.json({
      authenticated,
      user: authenticated
        ? {
            username: envUser,
            role: "Super Admin",
          }
        : null,
    });
  } catch (error) {
    console.error("Session check API Error:", error);
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 200 }
    );
  }
}
