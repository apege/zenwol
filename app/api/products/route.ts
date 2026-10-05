import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET /api/products - Get all products with optional filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active_only") === "true";
    const search = searchParams.get("search")?.trim();

    let products;

    if (search && activeOnly) {
      const searchPattern = `%${search}%`;
      products = await sql`
        SELECT * FROM public.products
        WHERE is_active = true AND name ILIKE ${searchPattern}
        ORDER BY robux ASC;
      `;
    } else if (activeOnly) {
      products = await sql`
        SELECT * FROM public.products
        WHERE is_active = true
        ORDER BY robux ASC;
      `;
    } else if (search) {
      const searchPattern = `%${search}%`;
      products = await sql`
        SELECT * FROM public.products
        WHERE name ILIKE ${searchPattern}
        ORDER BY robux ASC;
      `;
    } else {
      products = await sql`
        SELECT * FROM public.products
        ORDER BY robux ASC;
      `;
    }

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch products";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/products - Create a new product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, robux, price, is_active = true, image_path = null } = body;

    if (!name || robux === undefined || price === undefined) {
      return NextResponse.json(
        { success: false, error: "Field name, robux, dan price wajib diisi." },
        { status: 400 }
      );
    }

    if (Number(robux) <= 0) {
      return NextResponse.json(
        { success: false, error: "Jumlah Robux harus lebih besar dari 0." },
        { status: 400 }
      );
    }

    if (Number(price) < 0) {
      return NextResponse.json(
        { success: false, error: "Harga tidak boleh bernilai negatif." },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO public.products (name, robux, price, is_active, image_path)
      VALUES (${name.trim()}, ${Number(robux)}, ${Number(price)}, ${Boolean(is_active)}, ${image_path})
      RETURNING *;
    `;

    return NextResponse.json(
      {
        success: true,
        message: "Produk berhasil ditambahkan.",
        data: result[0],
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
