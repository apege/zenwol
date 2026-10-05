import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/profiles/[id]
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const result = await sql`
      SELECT * FROM public.profiles
      WHERE id = ${id}
      LIMIT 1;
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Profil tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch profile";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PATCH /api/profiles/[id] - Update full_name, role
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await sql`SELECT * FROM public.profiles WHERE id = ${id} LIMIT 1;`;

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "Profil tidak ditemukan." },
        { status: 404 }
      );
    }

    const current = existing[0];
    const newFullName = body.full_name !== undefined ? body.full_name : current.full_name;
    const newRole = body.role !== undefined ? body.role : current.role;

    const validRoles = ["member", "admin"];
    if (!validRoles.includes(newRole)) {
      return NextResponse.json(
        {
          success: false,
          error: `Role tidak valid. Pilih salah satu: ${validRoles.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE public.profiles
      SET
        full_name = ${newFullName},
        role = ${newRole},
        updated_at = now()
      WHERE id = ${id}
      RETURNING *;
    `;

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui.",
      data: result[0],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update profile";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE /api/profiles/[id]
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const result = await sql`
      DELETE FROM public.profiles
      WHERE id = ${id}
      RETURNING *;
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Profil tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profil berhasil dihapus.",
      data: result[0],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete profile";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
