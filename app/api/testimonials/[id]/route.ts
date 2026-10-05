import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/testimonials/[id]
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const testimonialId = Number(id);

    if (isNaN(testimonialId)) {
      return NextResponse.json(
        { success: false, error: "ID testimoni tidak valid." },
        { status: 400 }
      );
    }

    const result = await sql`
      SELECT * FROM public.testimonials
      WHERE id = ${testimonialId}
      LIMIT 1;
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Testimoni tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch testimonial";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PATCH /api/testimonials/[id] - Update status, admin reply, or testimonial content
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const testimonialId = Number(id);

    if (isNaN(testimonialId)) {
      return NextResponse.json(
        { success: false, error: "ID testimoni tidak valid." },
        { status: 400 }
      );
    }

    const body = await req.json();

    const existing = await sql`
      SELECT * FROM public.testimonials WHERE id = ${testimonialId} LIMIT 1;
    `;

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "Testimoni tidak ditemukan." },
        { status: 404 }
      );
    }

    const current = existing[0];
    const newName = body.name !== undefined ? body.name.trim() : current.name;
    const newMessage = body.message !== undefined ? body.message.trim() : current.message;
    const newRating = body.rating !== undefined ? Number(body.rating) : current.rating;
    const newStatus = body.status !== undefined ? body.status : current.status;
    const newImagePath = body.image_path !== undefined ? body.image_path : current.image_path;
    const newAdminReply =
      body.admin_reply !== undefined
        ? body.admin_reply === null
          ? null
          : JSON.stringify(body.admin_reply)
        : current.admin_reply;

    if (newRating < 1 || newRating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating harus bernilai 1 sampai 5." },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: `Status tidak valid. Pilih salah satu: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE public.testimonials
      SET
        name = ${newName},
        message = ${newMessage},
        rating = ${newRating},
        status = ${newStatus},
        image_path = ${newImagePath},
        admin_reply = ${newAdminReply},
        updated_at = now()
      WHERE id = ${testimonialId}
      RETURNING *;
    `;

    return NextResponse.json({
      success: true,
      message: "Testimoni berhasil diperbarui.",
      data: result[0],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update testimonial";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE /api/testimonials/[id] - Delete a testimonial
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const testimonialId = Number(id);

    if (isNaN(testimonialId)) {
      return NextResponse.json(
        { success: false, error: "ID testimoni tidak valid." },
        { status: 400 }
      );
    }

    const result = await sql`
      DELETE FROM public.testimonials
      WHERE id = ${testimonialId}
      RETURNING *;
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Testimoni tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Testimoni berhasil dihapus.",
      data: result[0],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete testimonial";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
