import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { isUserAdminAuthenticated } from "@/lib/adminAuth";

// Ensure activations table exists
async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS public.roblox_activations (
      id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      username text NOT NULL UNIQUE,
      is_active boolean NOT NULL DEFAULT true,
      fee bigint NOT NULL DEFAULT 100000,
      activated_at timestamp with time zone NOT NULL DEFAULT now(),
      updated_at timestamp with time zone NOT NULL DEFAULT now()
    );
  `;
}

// GET /api/admin/activations?username=erewfrwfw
export async function GET(req: NextRequest) {
  try {
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const rawUsername = searchParams.get("username")?.trim().replace(/^@/, "");

    if (rawUsername) {
      const result = await sql`
        SELECT * FROM public.roblox_activations
        WHERE LOWER(username) = LOWER(${rawUsername})
        LIMIT 1;
      `;

      if (result.length > 0) {
        return NextResponse.json({
          success: true,
          data: result[0],
        });
      }

      return NextResponse.json({
        success: true,
        data: {
          username: rawUsername,
          is_active: false,
          fee: 100000,
          activated_at: null,
        },
      });
    }

    // List all activated accounts
    const all = await sql`
      SELECT * FROM public.roblox_activations
      ORDER BY updated_at DESC
      LIMIT 50;
    `;

    return NextResponse.json({
      success: true,
      data: all,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch activation status";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/admin/activations - Toggle or set activation
export async function POST(req: NextRequest) {
  try {
    if (!(await isUserAdminAuthenticated())) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Sesi admin tidak valid atau telah berakhir." },
        { status: 401 }
      );
    }

    await ensureTable();
    const body = await req.json();
    const rawUsername = String(body.username || "").trim().replace(/^@/, "");
    const isActive = body.is_active !== undefined ? Boolean(body.is_active) : true;
    const fee = body.fee !== undefined ? Number(body.fee) : 100000;

    if (!rawUsername) {
      return NextResponse.json(
        { success: false, error: "Username Roblox wajib diisi." },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO public.roblox_activations (username, is_active, fee, activated_at, updated_at)
      VALUES (${rawUsername}, ${isActive}, ${fee}, now(), now())
      ON CONFLICT (username)
      DO UPDATE SET
        is_active = ${isActive},
        fee = ${fee},
        updated_at = now()
      RETURNING *;
    `;

    return NextResponse.json({
      success: true,
      message: isActive
        ? `ID @${rawUsername} berhasil diaktifkan!`
        : `ID @${rawUsername} berhasil dinonaktifkan.`,
      data: result[0],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update activation";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
