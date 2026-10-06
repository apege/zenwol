import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// POST /api/admin/proofs/cleanup
// Cleans up payment proofs older than 60 days to free database storage
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const days = Math.max(Number(body.days || 60), 1);

    // Delete image content while preserving the order metadata
    const result = await sql`
      UPDATE public.orders
      SET payment_proof_path = NULL
      WHERE payment_proof_path IS NOT NULL
        AND payment_proof_path != ''
        AND created_at < (NOW() - make_interval(days => ${days}))
      RETURNING id, order_code;
    `;

    return NextResponse.json({
      success: true,
      clearedCount: result.length,
      message:
        result.length > 0
          ? `Berhasil membersihkan ${result.length} bukti pembayaran yang lebih lama dari ${days} hari. Storage database berhasil dihemat!`
          : `Tidak ada bukti pembayaran yang lebih lama dari ${days} hari. Storage database sudah optimal.`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to cleanup payment proofs";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
