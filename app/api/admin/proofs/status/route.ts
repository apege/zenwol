import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/admin/proofs/status
// Returns storage stats, expiring count (53-60 days), expired count (>60 days),
// and automatically enforces the 60-day auto-delete rule to protect the 0.5 GB quota.
export async function GET() {
  try {
    // 1. Auto-cleanup any proofs older than 60 days (setting payment_proof_path to NULL)
    // Order records themselves remain 100% intact! Only the heavy image blob is deleted.
    const cleanupResult = await sql`
      UPDATE public.orders
      SET payment_proof_path = NULL
      WHERE payment_proof_path IS NOT NULL
        AND payment_proof_path != ''
        AND created_at < (NOW() - INTERVAL '60 days')
      RETURNING id;
    `;

    // 2. Count proofs nearing deletion within 7 days (aged between 53 and 60 days)
    const expiringResult = await sql`
      SELECT COUNT(*)::int AS count
      FROM public.orders
      WHERE payment_proof_path IS NOT NULL
        AND payment_proof_path != ''
        AND created_at <= (NOW() - INTERVAL '53 days');
    `;

    // 3. Count total active proofs with image currently in database
    const totalWithProofResult = await sql`
      SELECT COUNT(*)::int AS count
      FROM public.orders
      WHERE payment_proof_path IS NOT NULL
        AND payment_proof_path != '';
    `;

    // 4. Oldest proof date
    const oldestResult = await sql`
      SELECT created_at
      FROM public.orders
      WHERE payment_proof_path IS NOT NULL
        AND payment_proof_path != ''
      ORDER BY created_at ASC
      LIMIT 1;
    `;

    const expiringCount = expiringResult[0]?.count || 0;
    const totalProofCount = totalWithProofResult[0]?.count || 0;
    const autoDeletedCount = cleanupResult.length || 0;
    const oldestDate = oldestResult[0]?.created_at || null;

    return NextResponse.json({
      success: true,
      data: {
        retentionDays: 60,
        warningDays: 7,
        expiringCount, // Proofs aged 53-60 days that will be deleted within 7 days
        totalProofCount, // Total active payment proof images in database
        autoDeletedCount, // Number of proofs deleted in this pass (> 60 days)
        oldestProofDate: oldestDate,
        storageLimitMB: 500, // Neon 0.5 GB quota
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch proof status";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
