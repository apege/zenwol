import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/products/[id]
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: "ID produk tidak valid." },
        { status: 400 }
      );
    }

    const result = await sql`
      SELECT * FROM public.products
      WHERE id = ${productId}
      LIMIT 1;
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Produk tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch product";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PATCH /api/products/[id] - Update a product
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: "ID produk tidak valid." },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Check existing
    const existing = await sql`
      SELECT * FROM public.products WHERE id = ${productId} LIMIT 1;
    `;

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "Produk tidak ditemukan." },
        { status: 404 }
      );
    }

    const current = existing[0];
    const newName = body.name !== undefined ? body.name.trim() : current.name;
    const newRobux = body.robux !== undefined ? Number(body.robux) : current.robux;
    const newPrice = body.price !== undefined ? Number(body.price) : current.price;
    const newIsActive = body.is_active !== undefined ? Boolean(body.is_active) : current.is_active;
    const newImagePath = body.image_path !== undefined ? body.image_path : current.image_path;

    if (newRobux <= 0) {
      return NextResponse.json(
        { success: false, error: "Jumlah Robux harus lebih besar dari 0." },
        { status: 400 }
      );
    }

    if (newPrice < 0) {
      return NextResponse.json(
        { success: false, error: "Harga tidak boleh bernilai negatif." },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE public.products
      SET
        name = ${newName},
        robux = ${newRobux},
        price = ${newPrice},
        is_active = ${newIsActive},
        image_path = ${newImagePath},
        updated_at = now()
      WHERE id = ${productId}
      RETURNING *;
    `;

    return NextResponse.json({
      success: true,
      message: "Produk berhasil diperbarui.",
      data: result[0],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update product";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: "ID produk tidak valid." },
        { status: 400 }
      );
    }

    const result = await sql`
      DELETE FROM public.products
      WHERE id = ${productId}
      RETURNING *;
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Produk tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Produk berhasil dihapus.",
      data: result[0],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete product";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
