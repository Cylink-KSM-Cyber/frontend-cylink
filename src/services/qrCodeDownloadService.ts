import { QrCode } from "@/interfaces/url";
import QRCodeLib from "qrcode";
import html2canvas from "html2canvas";
import { trackQrCodeDownload } from "@/utils/qrCodeDownloadTracking";

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
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
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

        // When image loads, draw to canvas and convert to PNG
        img.onload = () => {
          ctx.drawImage(img, 0, 0, size, size);
          URL.revokeObjectURL(svgUrl);

          try {
            // Convert canvas to PNG data URL
            const pngUrl = canvas.toDataURL("image/png");
            resolve(pngUrl);
          } catch (err) {
            console.error("Failed to convert canvas to PNG", err);
            reject(err);
          }
        };

        // Handle image load error
        img.onerror = (err) => {
          URL.revokeObjectURL(svgUrl);
          console.error("Failed to load SVG image", err);
          reject(new Error("Failed to load SVG image"));
        };

        img.src = svgUrl;
      } catch (err) {
        console.error("SVG to PNG conversion failed", err);
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

      return svgString;
    } catch (err) {
      console.error("Failed to generate SVG", err);
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

      return dataUrl;
    } catch (err) {
      console.error("Failed to generate PNG data URL", err);
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
      return dataUrl;
    } catch (err) {
      console.error("Failed to capture element as image", err);
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
    try {
      // Apply padding (16px for a more spacious, elegant look)
      const paddingSize = 16;
      const innerSize = size - paddingSize * 2;

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
        width: innerSize,
        margin: 0,
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
      });

      // Create the outer container with padding
      tempContainer.style.width = `${size}px`;
      tempContainer.style.height = `${size}px`;
      tempContainer.style.backgroundColor = backgroundColor;
      tempContainer.style.display = "flex";
      tempContainer.style.alignItems = "center";
      tempContainer.style.justifyContent = "center";
      tempContainer.style.position = "relative";
      tempContainer.style.padding = `${paddingSize}px`;
      tempContainer.style.boxSizing = "border-box";

      // Create inner container for QR code
      const innerContainer = document.createElement("div");
      innerContainer.style.width = `${innerSize}px`;
      innerContainer.style.height = `${innerSize}px`;
      innerContainer.style.position = "relative";
      tempContainer.appendChild(innerContainer);

      // Add the QR code image
      const qrImg = document.createElement("img");
      qrImg.src = qrCodeDataUrl;
      qrImg.width = innerSize;
      qrImg.height = innerSize;
      qrImg.style.maxWidth = "100%";
      qrImg.style.maxHeight = "100%";
      innerContainer.appendChild(qrImg);

      // Add logo if needed
      if (includeLogo) {
        const logoSizePixels = Math.round(innerSize * logoSize);
        const logoContainerSize = Math.round(logoSizePixels * 1.4); // 40% padding around logo

        const logoContainer = document.createElement("div");
        logoContainer.style.position = "absolute";
        logoContainer.style.top = "50%";
        logoContainer.style.left = "50%";
        logoContainer.style.transform = "translate(-50%, -50%)";
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
        innerContainer.appendChild(logoContainer);
      }

      // Wait a moment for images to load
      const images = tempContainer.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete) {
                resolve();
              } else {
                img.onload = () => resolve();
                img.onerror = () => resolve(); // Resolve even if an image fails to load
              }
            })
        )
      );

      // Use html2canvas to capture the element with logo
      const dataUrl = await this.captureElementAsImage(tempContainer, size);

      // Clean up
      document.body.removeChild(tempContainer);

      return dataUrl;
    } catch (err) {
      console.error("Failed to render and capture QR code", err);
      throw err;
    }
  }

  /**
   * Download QR code as image
   * @param qrCode - QR code data
   * @param format - Image format (png or svg)
   * @param downloadMethod - Method of download (individual or bulk)
   */
  async downloadQrCode(
    qrCode: QrCode,
    format: "png" | "svg",
    downloadMethod: "individual" | "bulk" = "individual"
  ): Promise<boolean> {
    // Default download size is larger for better quality
    const downloadSize = 500;

    try {
      // Generate filename
      const filename = `qrcode-${qrCode.shortCode || qrCode.id}.${format}`;

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

      // Create download link
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);

      // Trigger download
      link.click();

      // Clean up
      document.body.removeChild(link);

      // Track QR code download conversion goal in PostHog
      const qrCodeAgeDays = Math.floor(
        (Date.now() - new Date(qrCode.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      trackQrCodeDownload({
        qr_code_id: qrCode.id,
        url_id: qrCode.urlId,
        qr_code_title: qrCode.title || `QR Code ${qrCode.id}`,
        short_url: qrCode.shortUrl || "",
        customization_options: {
          foreground_color: qrCode.customization?.foregroundColor || "#000000",
          background_color: qrCode.customization?.backgroundColor || "#FFFFFF",
          size: qrCode.customization?.size || 300,
        },
        download_format: format,
        download_size: downloadSize,
        includes_logo: qrCode.customization?.includeLogo || false,
        total_scans: qrCode.scans || 0,
        qr_code_age_days: qrCodeAgeDays,
        download_method: downloadMethod,
        success: true,
      });

      return true;
    } catch (error) {
      console.error("QR code download failed", error);

      // Track failed QR code download conversion goal in PostHog
      const qrCodeAgeDays = Math.floor(
        (Date.now() - new Date(qrCode.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      trackQrCodeDownload({
        qr_code_id: qrCode.id,
        url_id: qrCode.urlId,
        qr_code_title: qrCode.title || `QR Code ${qrCode.id}`,
        short_url: qrCode.shortUrl || "",
        customization_options: {
          foreground_color: qrCode.customization?.foregroundColor || "#000000",
          background_color: qrCode.customization?.backgroundColor || "#FFFFFF",
          size: qrCode.customization?.size || 300,
        },
        download_format: format,
        download_size: downloadSize,
        includes_logo: qrCode.customization?.includeLogo || false,
        total_scans: qrCode.scans || 0,
        qr_code_age_days: qrCodeAgeDays,
        download_method: downloadMethod,
        success: false,
      });

      return false;
    }
  }
}

// Export as singleton
export const qrCodeDownloadService = new QrCodeDownloadService();
