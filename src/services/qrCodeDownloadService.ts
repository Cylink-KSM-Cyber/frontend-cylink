import { QrCode } from "@/interfaces/url";
import QRCodeLib from "qrcode";

/**
 * Service for downloading QR codes as images (PNG, SVG)
 */
class QrCodeDownloadService {
  /**
   * Convert a SVG string to a PNG Data URL using canvas
   * @param svgString - SVG content as string
   * @param size - Size of the output image
   * @returns Promise resolving to a PNG data URL
   */
  async convertSvgToPng(svgString: string, size = 300): Promise<string> {
    console.log("[QrCodeDownloadService] Converting SVG to PNG", { size });

    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          console.error("[QrCodeDownloadService] Failed to get canvas context");
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Set canvas size
        canvas.width = size;
        canvas.height = size;

        // Fill with white background (optional)
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Create SVG image
        const img = new Image();

        // Convert SVG string to data URL
        const svgBlob = new Blob([svgString], {
          type: "image/svg+xml;charset=utf-8",
        });
        const svgUrl = URL.createObjectURL(svgBlob);

        console.log(
          "[QrCodeDownloadService] Created SVG URL:",
          svgUrl.substring(0, 50) + "..."
        );

        // When image loads, draw to canvas and convert to PNG
        img.onload = () => {
          console.log("[QrCodeDownloadService] SVG image loaded");
          ctx.drawImage(img, 0, 0, size, size);
          URL.revokeObjectURL(svgUrl);

          try {
            // Convert canvas to PNG data URL
            const pngUrl = canvas.toDataURL("image/png");
            console.log(
              "[QrCodeDownloadService] Generated PNG URL:",
              pngUrl.substring(0, 50) + "..."
            );
            resolve(pngUrl);
          } catch (err) {
            console.error(
              "[QrCodeDownloadService] Canvas to PNG conversion failed:",
              err
            );
            reject(err);
          }
        };

        // Handle image load error
        img.onerror = (err) => {
          console.error(
            "[QrCodeDownloadService] Failed to load SVG image:",
            err
          );
          URL.revokeObjectURL(svgUrl);
          reject(new Error("Failed to load SVG image"));
        };

        img.src = svgUrl;
      } catch (err) {
        console.error(
          "[QrCodeDownloadService] SVG to PNG conversion failed:",
          err
        );
        reject(err);
      }
    });
  }

  /**
   * Generate SVG string from QR code data
   * @param qrCode - QR code data
   * @param size - Size of the QR code
   * @returns Promise resolving to SVG string
   */
  async generateSvgString(qrCode: QrCode, size = 300): Promise<string> {
    console.log("[QrCodeDownloadService] Generating SVG string", {
      qrCodeId: qrCode.id,
      foregroundColor: qrCode.customization?.foregroundColor || "#000000",
      backgroundColor: qrCode.customization?.backgroundColor || "#FFFFFF",
      size,
    });

    const url = qrCode.shortUrl || `https://example.com/${qrCode.id}`;
    const foregroundColor = qrCode.customization?.foregroundColor || "#000000";
    const backgroundColor = qrCode.customization?.backgroundColor || "#FFFFFF";
    const errorCorrectionLevel = "H"; // Highest level for better logo support

    try {
      // Use QRCode library to generate SVG
      const svgString = await QRCodeLib.toString(url, {
        type: "svg",
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
        errorCorrectionLevel,
        width: size,
        margin: 1, // QR code margin
      });

      console.log(
        "[QrCodeDownloadService] Generated SVG string length:",
        svgString.length
      );

      // If qrCode has logo, we could modify the SVG to include it
      // For simplicity, we'll keep the logo handling separate for now

      return svgString;
    } catch (err) {
      console.error("[QrCodeDownloadService] Failed to generate SVG:", err);
      throw err;
    }
  }

  /**
   * Generate PNG data URL directly
   * @param qrCode - QR code data
   * @param size - Size of the QR code
   * @returns Promise resolving to PNG data URL
   */
  async generatePngDataUrl(qrCode: QrCode, size = 300): Promise<string> {
    console.log("[QrCodeDownloadService] Generating PNG data URL", {
      qrCodeId: qrCode.id,
      size,
    });

    const url = qrCode.shortUrl || `https://example.com/${qrCode.id}`;
    const foregroundColor = qrCode.customization?.foregroundColor || "#000000";
    const backgroundColor = qrCode.customization?.backgroundColor || "#FFFFFF";

    try {
      // Use canvas to generate PNG
      const dataUrl = await QRCodeLib.toDataURL(url, {
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
        errorCorrectionLevel: "H",
        width: size,
        margin: 1,
      });

      console.log(
        "[QrCodeDownloadService] Generated PNG data URL:",
        dataUrl.substring(0, 50) + "..."
      );
      return dataUrl;
    } catch (err) {
      console.error("[QrCodeDownloadService] Failed to generate PNG:", err);
      throw err;
    }
  }

  /**
   * Download QR code as image
   * @param qrCode - QR code data
   * @param format - Image format (png or svg)
   * @param svgRef - Optional React ref to SVG element
   */
  async downloadQrCode(
    qrCode: QrCode,
    format: "png" | "svg",
    svgRef?: React.RefObject<SVGSVGElement>
  ): Promise<boolean> {
    console.log("[QrCodeDownloadService] Downloading QR code", {
      qrCodeId: qrCode.id,
      format,
      hasSvgRef: !!svgRef?.current,
    });

    try {
      // Generate filename
      const filename = `qrcode-${qrCode.shortCode || qrCode.id}.${format}`;
      console.log("[QrCodeDownloadService] Generated filename:", filename);

      let dataUrl: string;

      // If we have a direct SVG reference from a React component
      if (svgRef?.current) {
        console.log("[QrCodeDownloadService] Using SVG ref");
        const svgString = new XMLSerializer().serializeToString(svgRef.current);
        console.log(
          "[QrCodeDownloadService] Serialized SVG length:",
          svgString.length
        );

        if (format === "svg") {
          dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
            svgString
          )}`;
        } else {
          dataUrl = await this.convertSvgToPng(svgString);
        }
      } else {
        // Generate based on format
        if (format === "svg") {
          const svgString = await this.generateSvgString(qrCode);
          dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
            svgString
          )}`;
        } else {
          dataUrl = await this.generatePngDataUrl(qrCode);
        }
      }

      console.log(
        "[QrCodeDownloadService] Created data URL:",
        dataUrl.substring(0, 50) + "..."
      );

      // Create download link
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);

      console.log("[QrCodeDownloadService] Created download link");

      // Trigger download
      link.click();

      // Clean up
      document.body.removeChild(link);
      console.log("[QrCodeDownloadService] Download initiated successfully");

      return true;
    } catch (error) {
      console.error("[QrCodeDownloadService] Download failed:", error);
      return false;
    }
  }
}

// Export as singleton
export const qrCodeDownloadService = new QrCodeDownloadService();
