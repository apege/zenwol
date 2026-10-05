import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET /api/profiles - List profiles with optional filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role")?.trim();
    const search = searchParams.get("search")?.trim();

    let profiles;

    if (search && role) {
      const searchPattern = `%${search}%`;
      profiles = await sql`
        SELECT * FROM public.profiles
        WHERE role = ${role} AND full_name ILIKE ${searchPattern}
        ORDER BY created_at DESC;
      `;
    } else if (role) {
      profiles = await sql`
        SELECT * FROM public.profiles
        WHERE role = ${role}
        ORDER BY created_at DESC;
      `;
    } else if (search) {
      const searchPattern = `%${search}%`;
      profiles = await sql`
        SELECT * FROM public.profiles
        WHERE full_name ILIKE ${searchPattern}
        ORDER BY created_at DESC;
      `;
    } else {
      profiles = await sql`
        SELECT * FROM public.profiles
        ORDER BY created_at DESC;
      `;
    }

    return NextResponse.json({
      success: true,
      total: profiles.length,
      data: profiles,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch profiles";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/profiles - Create a profile
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name = null, role = "member", id = null } = body;

    const validRoles = ["member", "admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        {
          success: false,
          error: `Role tidak valid. Pilih salah satu: ${validRoles.join(", ")}`,
        },
        { status: 400 }
      );
    }

    let result;
    if (id) {
      result = await sql`
        INSERT INTO public.profiles (id, full_name, role)
        VALUES (${id}, ${full_name}, ${role})
        RETURNING *;
      `;
    } else {
      result = await sql`
        INSERT INTO public.profiles (full_name, role)
        VALUES (${full_name}, ${role})
        RETURNING *;
      `;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profil berhasil dibuat.",
        data: result[0],
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create profile";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
