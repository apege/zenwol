/**
 * Utility for compressing images on the client-side to WebP format.
 * Reduces image size drastically (typically from several MBs to 20KB - 60KB)
 * to save database storage and increase transfer speed.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0 (default 0.75)
}

export async function compressImageToWebP(
  file: File,
  options: CompressionOptions = {}
): Promise<{ dataUrl: string; sizeBytes: number; originalSizeBytes: number }> {
  const { maxWidth = 900, maxHeight = 900, quality = 0.75 } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect ratio preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context could not be created"));
          return;
        }

        // Better downsampling quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format
        let webpDataUrl = canvas.toDataURL("image/webp", quality);

        // Fallback to jpeg if browser doesn't support webp export (very rare)
        if (!webpDataUrl.startsWith("data:image/webp")) {
          webpDataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        // Calculate approximate size in bytes from base64
        const stringLength = webpDataUrl.length - "data:image/webp;base64,".length;
        const sizeBytes = Math.round((stringLength * 3) / 4);

        resolve({
          dataUrl: webpDataUrl,
          sizeBytes,
          originalSizeBytes: file.size,
        });
      };

      img.onerror = () => reject(new Error("Gagal membaca gambar"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Gagal membaca file"));
    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}
