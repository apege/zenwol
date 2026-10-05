import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST() {
  try {
    // 1. Create profiles table
    await sql`
      CREATE TABLE IF NOT EXISTS public.profiles (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name text NULL,
        role text NOT NULL DEFAULT 'member',
        created_at timestamp with time zone NOT NULL DEFAULT now(),
        updated_at timestamp with time zone NOT NULL DEFAULT now(),
        CONSTRAINT profiles_role_check CHECK (role IN ('member', 'admin'))
      );
    `;

    // 2. Create products table
    await sql`
      CREATE TABLE IF NOT EXISTS public.products (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name text NOT NULL,
        robux integer NOT NULL,
        price bigint NOT NULL,
        is_active boolean NOT NULL DEFAULT true,
        created_at timestamp with time zone NOT NULL DEFAULT now(),
        updated_at timestamp with time zone NOT NULL DEFAULT now(),
        image_path text NULL,
        CONSTRAINT products_price_check CHECK (price >= 0),
        CONSTRAINT products_robux_check CHECK (robux > 0)
      );
    `;

    // 3. Create orders table
    await sql`
      CREATE TABLE IF NOT EXISTS public.orders (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        order_code text NOT NULL UNIQUE,
        product_id bigint NULL REFERENCES public.products (id) ON DELETE SET NULL,
        user_id uuid NULL REFERENCES public.profiles (id) ON DELETE SET NULL,
        roblox_username text NOT NULL,
        customer_phone text NOT NULL,
        robux integer NOT NULL,
        price bigint NOT NULL,
        payment_method text NOT NULL DEFAULT 'qris',
        payment_status text NOT NULL DEFAULT 'pending',
        payment_proof_path text NULL,
        order_status text NOT NULL DEFAULT 'pending',
        created_at timestamp with time zone NOT NULL DEFAULT now(),
        updated_at timestamp with time zone NOT NULL DEFAULT now(),
        CONSTRAINT orders_order_status_check CHECK (
          order_status IN ('pending', 'processing', 'completed', 'cancelled')
        ),
        CONSTRAINT orders_payment_method_check CHECK (
          payment_method IN ('qris', 'whatsapp', 'bca', 'mandiri', 'dana', 'ovo', 'gopay')
        ),
        CONSTRAINT orders_robux_check CHECK (robux > 0),
        CONSTRAINT orders_price_check CHECK (price >= 0),
        CONSTRAINT orders_payment_status_check CHECK (
          payment_status IN ('pending', 'paid', 'failed')
        )
      );
    `;

    // Ensure payment_method constraint is updated on existing table
    await sql`
      ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;
    `;
    await sql`
      ALTER TABLE public.orders ADD CONSTRAINT orders_payment_method_check CHECK (
        payment_method IN ('qris', 'whatsapp', 'bca', 'mandiri', 'dana', 'ovo', 'gopay')
      );
    `;

    // 4. Create testimonials table
    await sql`
      CREATE TABLE IF NOT EXISTS public.testimonials (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id uuid NULL REFERENCES public.profiles (id) ON DELETE SET NULL,
        name text NOT NULL,
        message text NOT NULL,
        rating integer NOT NULL,
        image_path text NULL,
        status text NOT NULL DEFAULT 'pending',
        created_at timestamp with time zone NOT NULL DEFAULT now(),
        updated_at timestamp with time zone NOT NULL DEFAULT now(),
        admin_reply jsonb NULL,
        order_code text NULL,
        CONSTRAINT testimonials_rating_check CHECK (rating >= 1 AND rating <= 5),
        CONSTRAINT testimonials_status_check CHECK (status IN ('pending', 'approved', 'rejected'))
      );
    `;

    // 5. Create store_settings table
    await sql`
      CREATE TABLE IF NOT EXISTS public.store_settings (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        store_name text NOT NULL,
        whatsapp_number text NOT NULL,
        qris_image_path text NULL,
        logo_image_path text NULL,
        updated_at timestamp with time zone NOT NULL DEFAULT now(),
        banner_image_path text NULL,
        promo_active boolean NULL DEFAULT true,
        promo_tag text NULL DEFAULT 'PROMO SPESIAL BULAN INI',
        promo_badge text NULL DEFAULT 'LIMITED STOCK',
        promo_title text NULL DEFAULT 'ROBUX BULAN INI',
        promo_subtitle text NULL DEFAULT 'Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali!',
        promo_robux_amount integer NULL DEFAULT 2200,
        promo_original_label text NULL DEFAULT '2.000 Robux',
        promo_discount_price integer NULL DEFAULT 45000,
        promo_end_date timestamp with time zone NULL DEFAULT '2026-09-30 23:59:59+00'
      );
    `;

    // Seed products if empty
    const existingProducts = await sql`SELECT id FROM public.products LIMIT 1;`;
    if (existingProducts.length === 0) {
      await sql`
        INSERT INTO public.products (name, robux, price, is_active, image_path) VALUES
        ('1.800 Robux', 1800, 35000, true, '/robux.webp'),
        ('2.200 Robux', 2200, 45000, true, '/robux.webp'),
        ('2.700 Robux', 2700, 50000, true, '/robux.webp'),
        ('3.200 Robux', 3200, 60000, true, '/robux.webp'),
        ('3.700 Robux', 3700, 70000, true, '/robux.webp'),
        ('4.200 Robux', 4200, 80000, true, '/robux.webp'),
        ('4.700 Robux', 4700, 90000, true, '/robux.webp'),
        ('5.500 Robux', 5500, 100000, true, '/robux.webp'),
        ('6.800 Robux', 6800, 125000, true, '/robux.webp'),
        ('10.000 Robux', 10000, 180000, true, '/robux.webp'),
        ('15.000 Robux', 15000, 270000, true, '/robux.webp'),
        ('20.000 Robux', 20000, 355000, true, '/robux.webp'),
        ('30.000 Robux', 30000, 530000, true, '/robux.webp'),
        ('50.000 Robux', 50000, 880000, true, '/robux.webp');
      `;
    }

    // Seed store_settings if empty
    const existingSettings = await sql`SELECT id FROM public.store_settings LIMIT 1;`;
    if (existingSettings.length === 0) {
      await sql`
        INSERT INTO public.store_settings (
          store_name,
          whatsapp_number,
          qris_image_path,
          logo_image_path,
          promo_active,
          promo_tag,
          promo_badge,
          promo_title,
          promo_subtitle,
          promo_robux_amount,
          promo_original_label,
          promo_discount_price
        ) VALUES (
          'Zenwol.id',
          '6281234567890',
          '/logo.jpg',
          '/logo.jpg',
          true,
          'PROMO SPESIAL BULAN INI',
          'LIMITED STOCK',
          'ROBUX BULAN INI',
          'Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali!',
          2200,
          '2.000 Robux',
          45000
        );
      `;
    }

    return NextResponse.json({
      success: true,
      message: "Database schema successfully initialized and seeded on Neon PostgreSQL.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Database initialization failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
