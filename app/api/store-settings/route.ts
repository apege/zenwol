import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/store-settings - Fetch current store settings
export async function GET() {
  try {
    const results = await sql`
      SELECT * FROM public.store_settings
      ORDER BY id ASC
      LIMIT 1;
    `;

    const noCacheHeaders = {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      "CDN-Cache-Control": "no-store",
      "Cloudflare-CDN-Cache-Control": "no-store",
      "Pragma": "no-cache",
      "Expires": "0",
    };

    if (results.length === 0) {
      // Return default configuration if table is completely empty
      return NextResponse.json(
        {
          success: true,
          data: {
            store_name: "Zenwol.id",
            whatsapp_number: "6281234567890",
            qris_image_path: "/logo.jpg",
            logo_image_path: "/logo.jpg",
            promo_active: true,
            promo_tag: "PROMO SPESIAL BULAN INI",
            promo_badge: "LIMITED STOCK",
            promo_title: "ROBUX BULAN INI",
            promo_subtitle: "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali!",
            promo_robux_amount: 2200,
            promo_original_label: "2.000 Robux",
            promo_discount_price: 45000,
            promo_end_date: "2026-09-30 23:59:59+00",
          },
        },
        { headers: noCacheHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: results[0],
      },
      { headers: noCacheHeaders }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch store settings";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/store-settings - Update or insert store settings (Upsert with safe fallback)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const existing = await sql`
      SELECT * FROM public.store_settings ORDER BY id ASC LIMIT 1;
    `;

    const prev = existing.length > 0 ? existing[0] : null;

    const store_name = body.store_name !== undefined ? body.store_name : (prev?.store_name ?? "Zenwol.id");
    const whatsapp_number = body.whatsapp_number !== undefined ? body.whatsapp_number : (prev?.whatsapp_number ?? "6281234567890");
    const qris_image_path = body.qris_image_path !== undefined ? body.qris_image_path : (prev?.qris_image_path ?? "/logo.jpg");
    const logo_image_path = body.logo_image_path !== undefined ? body.logo_image_path : (prev?.logo_image_path ?? "/logo.jpg");
    const banner_image_path = body.banner_image_path !== undefined ? body.banner_image_path : (prev?.banner_image_path ?? null);
    const promo_active = body.promo_active !== undefined ? Boolean(body.promo_active) : (prev?.promo_active ?? true);
    const promo_tag = body.promo_tag !== undefined ? body.promo_tag : (prev?.promo_tag ?? "PROMO SPESIAL BULAN INI");
    const promo_badge = body.promo_badge !== undefined ? body.promo_badge : (prev?.promo_badge ?? "LIMITED STOCK");
    const promo_title = body.promo_title !== undefined ? body.promo_title : (prev?.promo_title ?? "ROBUX BULAN INI");
    const promo_subtitle = body.promo_subtitle !== undefined ? body.promo_subtitle : (prev?.promo_subtitle ?? "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali!");
    const promo_robux_amount = body.promo_robux_amount !== undefined ? Number(body.promo_robux_amount) : (prev?.promo_robux_amount ?? 2200);
    const promo_original_label = body.promo_original_label !== undefined ? body.promo_original_label : (prev?.promo_original_label ?? "2.000 Robux");
    const promo_discount_price = body.promo_discount_price !== undefined ? Number(body.promo_discount_price) : (prev?.promo_discount_price ?? 45000);
    const promo_end_date = body.promo_end_date !== undefined ? (body.promo_end_date ? new Date(body.promo_end_date).toISOString() : null) : (prev?.promo_end_date ?? null);

    let result;
    if (prev) {
      result = await sql`
        UPDATE public.store_settings
        SET
          store_name = ${store_name},
          whatsapp_number = ${whatsapp_number},
          qris_image_path = ${qris_image_path},
          logo_image_path = ${logo_image_path},
          banner_image_path = ${banner_image_path},
          promo_active = ${Boolean(promo_active)},
          promo_tag = ${promo_tag},
          promo_badge = ${promo_badge},
          promo_title = ${promo_title},
          promo_subtitle = ${promo_subtitle},
          promo_robux_amount = ${Number(promo_robux_amount)},
          promo_original_label = ${promo_original_label},
          promo_discount_price = ${Number(promo_discount_price)},
          promo_end_date = ${promo_end_date},
          updated_at = now()
        WHERE id = ${prev.id}
        RETURNING *;
      `;
    } else {
      result = await sql`
        INSERT INTO public.store_settings (
          store_name,
          whatsapp_number,
          qris_image_path,
          logo_image_path,
          banner_image_path,
          promo_active,
          promo_tag,
          promo_badge,
          promo_title,
          promo_subtitle,
          promo_robux_amount,
          promo_original_label,
          promo_discount_price,
          promo_end_date
        ) VALUES (
          ${store_name},
          ${whatsapp_number},
          ${qris_image_path},
          ${logo_image_path},
          ${banner_image_path},
          ${Boolean(promo_active)},
          ${promo_tag},
          ${promo_badge},
          ${promo_title},
          ${promo_subtitle},
          ${Number(promo_robux_amount)},
          ${promo_original_label},
          ${Number(promo_discount_price)},
          ${promo_end_date}
        )
        RETURNING *;
      `;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Pengaturan toko berhasil disimpan.",
        data: result[0],
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          "CDN-Cache-Control": "no-store",
          "Cloudflare-CDN-Cache-Control": "no-store",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update store settings";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PUT /api/store-settings - Alias for POST
export async function PUT(req: NextRequest) {
  return POST(req);
}
