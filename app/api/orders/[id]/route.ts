import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/orders/[id] - By numeric ID or order_code
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const isNumeric = /^\d+$/.test(id);

    let result;
    if (isNumeric) {
      result = await sql`
        SELECT o.*, p.name AS product_name
        FROM public.orders o
        LEFT JOIN public.products p ON o.product_id = p.id
        WHERE o.id = ${Number(id)}
        LIMIT 1;
      `;
    } else {
      result = await sql`
        SELECT o.*, p.name AS product_name
        FROM public.orders o
        LEFT JOIN public.products p ON o.product_id = p.id
        WHERE o.order_code = ${id.trim()}
        LIMIT 1;
      `;
    }

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch order";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PATCH /api/orders/[id] - Update order status, payment status, proof path, etc.
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const isNumeric = /^\d+$/.test(id);
    const body = await req.json();

    // Check existing
    let existing;
    if (isNumeric) {
      existing = await sql`SELECT * FROM public.orders WHERE id = ${Number(id)} LIMIT 1;`;
    } else {
      existing = await sql`SELECT * FROM public.orders WHERE order_code = ${id.trim()} LIMIT 1;`;
    }

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    const current = existing[0];
    const newOrderStatus = body.order_status !== undefined ? body.order_status : current.order_status;
    const newPaymentStatus = body.payment_status !== undefined ? body.payment_status : current.payment_status;
    const newPaymentProofPath =
      body.payment_proof_path !== undefined ? body.payment_proof_path : current.payment_proof_path;
    const newRobloxUsername =
      body.roblox_username !== undefined ? body.roblox_username.trim() : current.roblox_username;
    const newCustomerPhone =
      body.customer_phone !== undefined ? body.customer_phone.trim() : current.customer_phone;

    // Validate enum constraints
    const validOrderStatuses = ["pending", "processing", "completed", "cancelled"];
    if (!validOrderStatuses.includes(newOrderStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: `order_status tidak valid. Pilih salah satu: ${validOrderStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const validPaymentStatuses = ["pending", "paid", "failed"];
    if (!validPaymentStatuses.includes(newPaymentStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: `payment_status tidak valid. Pilih salah satu: ${validPaymentStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE public.orders
      SET
        order_status = ${newOrderStatus},
        payment_status = ${newPaymentStatus},
        payment_proof_path = ${newPaymentProofPath},
        roblox_username = ${newRobloxUsername},
        customer_phone = ${newCustomerPhone},
        updated_at = now()
      WHERE id = ${current.id}
      RETURNING *;
    `;

    return NextResponse.json({
      success: true,
      message: "Status pesanan berhasil diperbarui.",
      data: result[0],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update order";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE /api/orders/[id] - Delete an order
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const isNumeric = /^\d+$/.test(id);

    let result;
    if (isNumeric) {
      result = await sql`DELETE FROM public.orders WHERE id = ${Number(id)} RETURNING *;`;
    } else {
      result = await sql`DELETE FROM public.orders WHERE order_code = ${id.trim()} RETURNING *;`;
    }

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Pesanan berhasil dihapus.",
      data: result[0],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete order";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
