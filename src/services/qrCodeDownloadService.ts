import { QrCode } from "@/interfaces/url";
import QRCodeLib from "qrcode";
import html2canvas from "html2canvas";

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
  async convertSvgToPng(svgString: string, size = 500): Promise<string> {
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
  async generateSvgString(qrCode: QrCode, size = 500): Promise<string> {
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
  async generatePngDataUrl(qrCode: QrCode, size = 500): Promise<string> {
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
   * Capture a DOM element as an image
   * @param element - DOM element to capture
   * @param outputSize - Size of the output image
   * @returns Promise resolving to a data URL of the captured image
   */
  async captureElementAsImage(
    element: HTMLElement,
    outputSize = 500
  ): Promise<string> {
    console.log(
      "[QrCodeDownloadService] Capturing element as image, output size:",
      outputSize
    );

    try {
      // Use html2canvas to capture the element
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        logging: false,
        scale: 8, // Higher scale for better quality
        useCORS: true,
      });

      // Create a new square canvas with the desired output size
      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = outputSize;
      outputCanvas.height = outputSize;

      // Get context and fill with background color if needed
      const ctx = outputCanvas.getContext("2d");
      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }

      // Draw the captured image to the new canvas, preserving aspect ratio
      ctx.drawImage(canvas, 0, 0, outputSize, outputSize);

      // Convert canvas to data URL
      const dataUrl = outputCanvas.toDataURL("image/png", 1.0);
      console.log(
        "[QrCodeDownloadService] Element captured successfully, resized to:",
        outputSize
      );
      return dataUrl;
    } catch (err) {
      console.error("[QrCodeDownloadService] Failed to capture element:", err);
      throw err;
    }
  }

  /**
   * Render QR code with logo in a temporary element for capture
   * @param qrCode - QR code data
   * @param size - Size of the QR code
   * @returns Promise resolving to a data URL of the captured QR code
   */
  async renderAndCaptureQrCode(qrCode: QrCode, size = 500): Promise<string> {
    console.log("[QrCodeDownloadService] Rendering QR code for capture");

    try {
      // Create a temporary div to render the QR code with logo
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "fixed";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";
      document.body.appendChild(tempContainer);

      // Get customization settings
      const url = qrCode.shortUrl || `https://example.com/${qrCode.id}`;
      const foregroundColor =
        qrCode.customization?.foregroundColor || "#000000";
      const backgroundColor =
        qrCode.customization?.backgroundColor || "#FFFFFF";
      const includeLogo = qrCode.customization?.includeLogo || false;
      const logoSize =
        typeof qrCode.customization?.logoSize === "string"
          ? parseFloat(qrCode.customization.logoSize)
          : qrCode.customization?.logoSize || 0.25;

      // Generate QR code
      const qrCodeDataUrl = await QRCodeLib.toDataURL(url, {
        errorCorrectionLevel: "H",
        width: size,
        margin: 0,
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
      });

      // Create the container with styling similar to the QrCodePreview component
      tempContainer.style.width = `${size}px`;
      tempContainer.style.height = `${size}px`;
      tempContainer.style.backgroundColor = backgroundColor;
      tempContainer.style.display = "flex";
      tempContainer.style.alignItems = "center";
      tempContainer.style.justifyContent = "center";
      tempContainer.style.position = "relative";

      // Add the QR code image
      const qrImg = document.createElement("img");
      qrImg.src = qrCodeDataUrl;
      qrImg.width = size;
      qrImg.height = size;
      qrImg.style.maxWidth = "100%";
      qrImg.style.maxHeight = "100%";
      tempContainer.appendChild(qrImg);

      // Add logo if needed
      if (includeLogo) {
        const logoSizePixels = Math.round(size * logoSize);
        const logoContainerSize = Math.round(logoSizePixels * 1.4); // 40% padding around logo

        const logoContainer = document.createElement("div");
        logoContainer.style.position = "absolute";
        logoContainer.style.display = "flex";
        logoContainer.style.alignItems = "center";
        logoContainer.style.justifyContent = "center";
        logoContainer.style.width = `${logoContainerSize}px`;
        logoContainer.style.height = `${logoContainerSize}px`;
        logoContainer.style.backgroundColor = backgroundColor;
        logoContainer.style.borderRadius = "50%";
        logoContainer.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";

        const logo = document.createElement("img");
        logo.src = "/logo/logo-ksm.svg";
        logo.width = logoSizePixels;
        logo.height = logoSizePixels;

        // Apply color filter if needed
        if (foregroundColor !== "#000000") {
          logo.style.filter = `brightness(0) saturate(100%)`;
          // We'd need a more complex implementation to match the exact filter from getColorFilterForSvg
          // This is a simplified approach
        }

        logoContainer.appendChild(logo);
        tempContainer.appendChild(logoContainer);
      }

      // Wait a moment for images to load
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Use html2canvas to capture the element with logo
      const dataUrl = await this.captureElementAsImage(tempContainer, size);

      // Clean up
      document.body.removeChild(tempContainer);

      return dataUrl;
    } catch (err) {
      console.error(
        "[QrCodeDownloadService] Failed to render and capture QR code:",
        err
      );
      throw err;
    }
  }

  /**
   * Download QR code as image
   * @param qrCode - QR code data
   * @param format - Image format (png or svg)
   * @param containerRef - Optional React ref to QR code container element
   */
  async downloadQrCode(
    qrCode: QrCode,
    format: "png" | "svg",
    containerRef?: React.RefObject<HTMLElement>
  ): Promise<boolean> {
    // Default download size is larger for better quality
    const downloadSize = 500;

    console.log("[QrCodeDownloadService] Downloading QR code", {
      qrCodeId: qrCode.id,
      format,
      downloadSize,
      hasContainerRef: !!containerRef?.current,
      customization: qrCode.customization,
    });

    try {
      // Generate filename
      const filename = `qrcode-${qrCode.shortCode || qrCode.id}.${format}`;
      console.log("[QrCodeDownloadService] Generated filename:", filename);

      let dataUrl: string;

      // For better consistency and to ensure all settings are applied correctly,
      // let's use the renderAndCaptureQrCode method for all cases
      dataUrl = await this.renderAndCaptureQrCode(qrCode, downloadSize);

      // For SVG format when no logo is needed
      if (format === "svg" && !qrCode.customization?.includeLogo) {
        // Generate SVG with the correct customization
        const svgString = await this.generateSvgString(qrCode, downloadSize);
        dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
          svgString
        )}`;
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
