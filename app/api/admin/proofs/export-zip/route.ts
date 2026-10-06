import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import JSZip from "jszip";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/admin/proofs/export-zip?scope=expiring|all
// Exports orders with payment proofs into a .zip archive
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get("scope") === "all" ? "all" : "expiring";

    let orders;
    if (scope === "expiring") {
      // Orders aged 53 days or older (approaching the 60-day deadline within 7 days)
      orders = await sql`
        SELECT
          o.id,
          o.order_code,
          o.roblox_username,
          o.customer_phone,
          o.robux,
          o.price,
          o.payment_method,
          o.payment_status,
          o.order_status,
          o.payment_proof_path,
          o.created_at,
          p.name AS product_name
        FROM public.orders o
        LEFT JOIN public.products p ON o.product_id = p.id
        WHERE o.payment_proof_path IS NOT NULL
          AND o.payment_proof_path != ''
          AND o.created_at <= (NOW() - INTERVAL '53 days')
        ORDER BY o.created_at ASC;
      `;
    } else {
      // All orders with payment proof
      orders = await sql`
        SELECT
          o.id,
          o.order_code,
          o.roblox_username,
          o.customer_phone,
          o.robux,
          o.price,
          o.payment_method,
          o.payment_status,
          o.order_status,
          o.payment_proof_path,
          o.created_at,
          p.name AS product_name
        FROM public.orders o
        LEFT JOIN public.products p ON o.product_id = p.id
        WHERE o.payment_proof_path IS NOT NULL
          AND o.payment_proof_path != ''
        ORDER BY o.created_at ASC;
      `;
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            scope === "expiring"
              ? "Tidak ada bukti pembayaran yang mendekati batas 60 hari saat ini."
              : "Tidak ada bukti pembayaran yang tersimpan di database saat ini.",
        },
        { status: 404 }
      );
    }

    const zip = new JSZip();
    const imagesFolder = zip.folder("bukti_transfer");

    // CSV Rekap Content
    const csvRows: string[] = [
      "No,Kode Order,Tanggal,Username Roblox,No WhatsApp,Produk,Robux,Total Harga (Rp),Metode Bayar,Status Bayar,Status Order,Nama File Gambar",
    ];

    let imageIndex = 1;
    for (const order of orders) {
      const rawProof = String(order.payment_proof_path || "");
      const createdAt = new Date(order.created_at || Date.now());
      const dateStr = createdAt.toISOString().slice(0, 10);
      const cleanUsername = String(order.roblox_username || "user").replace(/[^a-zA-Z0-9_-]/g, "");
      const orderCode = String(order.order_code || `ORDER${order.id}`);

      let ext = "png";
      let base64Data = "";

      if (rawProof.startsWith("data:")) {
        const matches = rawProof.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (matches) {
          ext = matches[1].toLowerCase().replace("jpeg", "jpg");
          base64Data = matches[2];
        } else {
          const commaIdx = rawProof.indexOf(",");
          if (commaIdx !== -1) {
            base64Data = rawProof.slice(commaIdx + 1);
          }
        }
      }

      const fileName = `${orderCode}_${cleanUsername}_${dateStr}.${ext}`;

      if (base64Data && imagesFolder) {
        imagesFolder.file(fileName, base64Data, { base64: true });
      }

      csvRows.push(
        [
          imageIndex,
          `"${orderCode}"`,
          `"${dateStr}"`,
          `"${order.roblox_username}"`,
          `"${order.customer_phone}"`,
          `"${order.product_name || `${order.robux} Robux`}"`,
          order.robux,
          order.price,
          `"${order.payment_method}"`,
          `"${order.payment_status}"`,
          `"${order.order_status}"`,
          `"${fileName}"`,
        ].join(",")
      );
      imageIndex++;
    }

    // Add CSV and Readme
    zip.file("rekap_pesanan.csv", "\uFEFF" + csvRows.join("\r\n"));
    zip.file(
      "README_PANDUAN.txt",
      `============================================================\r\n` +
        `ARSIP BUKTI PEMBAYARAN ZENWOL.ID\r\n` +
        `Tanggal Ekspor: ${new Date().toLocaleString("id-ID")}\r\n` +
        `Tipe Ekspor   : ${scope === "expiring" ? "Mendekati Hapus (53-60 Hari)" : "Seluruh Bukti"}\r\n` +
        `Jumlah Bukti  : ${orders.length} file\r\n` +
        `============================================================\r\n\r\n` +
        `Keterangan:\r\n` +
        `- Folder "bukti_transfer/" berisi seluruh screenshot bukti pembayaran transfer/QRIS.\r\n` +
        `- File "rekap_pesanan.csv" berisi tabel data pesanan lengkap yang bisa dibuka di Excel.\r\n` +
        `- Sesuai kebijakan penghematan storage Neon PostgreSQL (0.5 GB),\r\n` +
        `  bukti pembayaran di website akan otomatis dihapus permanen setelah 60 hari.\r\n` +
        `- Simpan file ZIP ini di komputer/penyimpanan lokal admin untuk arsip jangka panjang.\r\n`
    );

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    const exportDateStr = new Date().toISOString().slice(0, 10);
    const downloadFileName = `arsip_bukti_zenwol_${scope}_${exportDateStr}.zip`;

    return new Response(zipBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${downloadFileName}"`,
        "Content-Length": String(zipBuffer.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate ZIP archive";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
