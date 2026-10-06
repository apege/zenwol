import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET /api/testimonials - Get testimonials with optional filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status")?.trim();
    const rating = searchParams.get("rating");
    const search = searchParams.get("search")?.trim();
    const limit = Math.min(Number(searchParams.get("limit") || 100), 200);

    let results;

    if (search && status) {
      const searchPattern = `%${search}%`;
      results = await sql`
        SELECT * FROM public.testimonials
        WHERE status = ${status}
          AND (name ILIKE ${searchPattern} OR message ILIKE ${searchPattern})
        ORDER BY created_at DESC
        LIMIT ${limit};
      `;
    } else if (status) {
      results = await sql`
        SELECT * FROM public.testimonials
        WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit};
      `;
    } else if (rating && !isNaN(Number(rating))) {
      results = await sql`
        SELECT * FROM public.testimonials
        WHERE rating = ${Number(rating)}
        ORDER BY created_at DESC
        LIMIT ${limit};
      `;
    } else if (search) {
      const searchPattern = `%${search}%`;
      results = await sql`
        SELECT * FROM public.testimonials
        WHERE name ILIKE ${searchPattern} OR message ILIKE ${searchPattern}
        ORDER BY created_at DESC
        LIMIT ${limit};
      `;
    } else {
      results = await sql`
        SELECT * FROM public.testimonials
        ORDER BY created_at DESC
        LIMIT ${limit};
      `;
    }

    return NextResponse.json(
      {
        success: true,
        total: results.length,
        data: results,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch testimonials";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/testimonials - Create a new testimonial
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      message,
      rating,
      user_id = null,
      image_path = null,
      status = "pending",
      order_code = null,
      admin_reply = null,
    } = body;

    if (!name || !message || rating === undefined) {
      return NextResponse.json(
        { success: false, error: "Field name, message, dan rating wajib diisi." },
        { status: 400 }
      );
    }

    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { success: false, error: "Rating harus berupa angka antara 1 sampai 5." },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Status tidak valid. Pilih salah satu: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Anti-spam: check if order_code already has a submitted review
    if (order_code && typeof order_code === "string" && order_code.trim()) {
      const cleanOrderCode = order_code.trim().replace(/^#/, "");
      const existing = await sql`
        SELECT id FROM public.testimonials 
        WHERE order_code = ${cleanOrderCode} OR order_code = ${"#" + cleanOrderCode}
        LIMIT 1;
      `;
      if (existing.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Ulasan untuk pesanan ini sudah pernah dikirim sebelumnya.",
          },
          { status: 400 }
        );
      }
    }

    const adminReplyJson = admin_reply ? JSON.stringify(admin_reply) : null;

    const result = await sql`
      INSERT INTO public.testimonials (
        user_id,
        name,
        message,
        rating,
        image_path,
        status,
        order_code,
        admin_reply
      ) VALUES (
        ${user_id || null},
        ${name.trim()},
        ${message.trim()},
        ${ratingNum},
        ${image_path},
        ${status},
        ${order_code},
        ${adminReplyJson}
      )
      RETURNING *;
    `;

    return NextResponse.json(
      {
        success: true,
        message: "Testimoni berhasil dibuat.",
        data: result[0],
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create testimonial";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
