import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// Generate unique order code (e.g. ZEN78149812)
function generateOrderCode(): string {
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  return `ZEN${randomNum}`;
}

// GET /api/orders - List orders with filtering (Ultra-optimized for Neon network transfer)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderStatus = searchParams.get("status")?.trim();
    const paymentStatus = searchParams.get("payment_status")?.trim();
    const search = searchParams.get("search")?.trim();
    const limit = Math.min(Number(searchParams.get("limit") || 100), 200);

    // Auto-clean proofs older than 60 days in the background to protect Neon 0.5 GB quota
    // Non-blocking fire-and-forget
    sql`
      UPDATE public.orders
      SET payment_proof_path = NULL
      WHERE payment_proof_path IS NOT NULL
        AND payment_proof_path != ''
        AND created_at < (NOW() - INTERVAL '60 days');
    `.catch(() => {});

    let queryResult;

    // Explicitly select columns WITHOUT the heavy payment_proof_path base64 data.
    // has_proof boolean is returned instead, reducing Neon egress from ~10MB+ down to ~15KB!
    if (search && orderStatus) {
      const searchPattern = `%${search}%`;
      queryResult = await sql`
        SELECT
          o.id,
          o.order_code,
          o.product_id,
          o.user_id,
          o.roblox_username,
          o.roblox_user_id,
          o.customer_phone,
          o.robux,
          o.price,
          o.payment_method,
          o.payment_status,
          (o.payment_proof_path IS NOT NULL AND o.payment_proof_path != '') AS has_proof,
          o.order_status,
          o.created_at,
          o.updated_at,
          p.name AS product_name
        FROM public.orders o
        LEFT JOIN public.products p ON o.product_id = p.id
        WHERE o.order_status = ${orderStatus}
          AND (o.order_code ILIKE ${searchPattern} OR o.roblox_username ILIKE ${searchPattern} OR o.customer_phone ILIKE ${searchPattern})
        ORDER BY o.created_at DESC
        LIMIT ${limit};
      `;
    } else if (orderStatus) {
      queryResult = await sql`
        SELECT
          o.id,
          o.order_code,
          o.product_id,
          o.user_id,
          o.roblox_username,
          o.roblox_user_id,
          o.customer_phone,
          o.robux,
          o.price,
          o.payment_method,
          o.payment_status,
          (o.payment_proof_path IS NOT NULL AND o.payment_proof_path != '') AS has_proof,
          o.order_status,
          o.created_at,
          o.updated_at,
          p.name AS product_name
        FROM public.orders o
        LEFT JOIN public.products p ON o.product_id = p.id
        WHERE o.order_status = ${orderStatus}
        ORDER BY o.created_at DESC
        LIMIT ${limit};
      `;
    } else if (paymentStatus) {
      queryResult = await sql`
        SELECT
          o.id,
          o.order_code,
          o.product_id,
          o.user_id,
          o.roblox_username,
          o.roblox_user_id,
          o.customer_phone,
          o.robux,
          o.price,
          o.payment_method,
          o.payment_status,
          (o.payment_proof_path IS NOT NULL AND o.payment_proof_path != '') AS has_proof,
          o.order_status,
          o.created_at,
          o.updated_at,
          p.name AS product_name
        FROM public.orders o
        LEFT JOIN public.products p ON o.product_id = p.id
        WHERE o.payment_status = ${paymentStatus}
        ORDER BY o.created_at DESC
        LIMIT ${limit};
      `;
    } else if (search) {
      const searchPattern = `%${search}%`;
      queryResult = await sql`
        SELECT
          o.id,
          o.order_code,
          o.product_id,
          o.user_id,
          o.roblox_username,
          o.roblox_user_id,
          o.customer_phone,
          o.robux,
          o.price,
          o.payment_method,
          o.payment_status,
          (o.payment_proof_path IS NOT NULL AND o.payment_proof_path != '') AS has_proof,
          o.order_status,
          o.created_at,
          o.updated_at,
          p.name AS product_name
        FROM public.orders o
        LEFT JOIN public.products p ON o.product_id = p.id
        WHERE (o.order_code ILIKE ${searchPattern} OR o.roblox_username ILIKE ${searchPattern} OR o.customer_phone ILIKE ${searchPattern})
        ORDER BY o.created_at DESC
        LIMIT ${limit};
      `;
    } else {
      queryResult = await sql`
        SELECT
          o.id,
          o.order_code,
          o.product_id,
          o.user_id,
          o.roblox_username,
          o.roblox_user_id,
          o.customer_phone,
          o.robux,
          o.price,
          o.payment_method,
          o.payment_status,
          (o.payment_proof_path IS NOT NULL AND o.payment_proof_path != '') AS has_proof,
          o.order_status,
          o.created_at,
          o.updated_at,
          p.name AS product_name
        FROM public.orders o
        LEFT JOIN public.products p ON o.product_id = p.id
        ORDER BY o.created_at DESC
        LIMIT ${limit};
      `;
    }

    return NextResponse.json({
      success: true,
      total: queryResult.length,
      data: queryResult,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch orders";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/orders - Create a new order
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      product_id = null,
      user_id = null,
      roblox_username,
      roblox_user_id = null,
      customer_phone,
      robux,
      price,
      payment_method = "qris",
      payment_status = "pending",
      payment_proof_path = null,
      order_status = "pending",
      order_code: customOrderCode,
    } = body;

    const robloxUsernameStr = String(roblox_username || "").replace(/^@/, "").trim();
    const customerPhoneStr = String(customer_phone || "").trim();

    if (!robloxUsernameStr || !customerPhoneStr || robux === undefined || price === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "Field roblox_username, customer_phone, robux, dan price wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (Number(robux) <= 0) {
      return NextResponse.json(
        { success: false, error: "Jumlah Robux harus lebih dari 0." },
        { status: 400 }
      );
    }

    if (Number(price) < 0) {
      return NextResponse.json(
        { success: false, error: "Harga tidak boleh negatif." },
        { status: 400 }
      );
    }

    // Resolve roblox_user_id if not provided
    let finalRobloxUserId = roblox_user_id ? String(roblox_user_id) : null;
    if (!finalRobloxUserId && robloxUsernameStr) {
      try {
        const lookupRes = await fetch("https://users.roblox.com/v1/usernames/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usernames: [robloxUsernameStr], excludeBannedUsers: false }),
        });
        if (lookupRes.ok) {
          const lookupData = await lookupRes.json();
          const uid = lookupData?.data?.[0]?.id;
          if (uid) finalRobloxUserId = String(uid);
        }
      } catch {
        // Continue even if lookup fails
      }
    }

    // Generate unique order code if not provided
    const orderCode = customOrderCode ? customOrderCode.trim() : generateOrderCode();

    const result = await sql`
      INSERT INTO public.orders (
        order_code,
        product_id,
        user_id,
        roblox_username,
        roblox_user_id,
        customer_phone,
        robux,
        price,
        payment_method,
        payment_status,
        payment_proof_path,
        order_status
      ) VALUES (
        ${orderCode},
        ${product_id ? Number(product_id) : null},
        ${user_id || null},
        ${robloxUsernameStr},
        ${finalRobloxUserId},
        ${customerPhoneStr},
        ${Number(robux)},
        ${Number(price)},
        ${payment_method},
        ${payment_status},
        ${payment_proof_path},
        ${order_status}
      )
      RETURNING *;
    `;

    return NextResponse.json(
      {
        success: true,
        message: "Pesanan berhasil dibuat.",
        data: result[0],
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
