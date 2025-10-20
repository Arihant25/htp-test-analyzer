import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { GeminiReport } from "./gemini";

interface AnalysisResult {
  analysis_id: string;
  house_size_category: string;
  detected_features: string[];
  missing_features: string[];
  risk_factors: string[];
  positive_indicators: string[];
  psychological_interpretation: string;
  overall_confidence_score: number;
  processing_time_seconds: number;
  house_area_ratio: number;
  house_placement: string[];
  door_present: boolean;
  window_count: number;
  chimney_present: boolean;
  detection_confidence: Record<string, number>;
  psychological_indicators: Record<string, string[]>;
}

/**
 * Generate a professional PDF report from analysis results and Gemini report
 * @param analysisResult The analysis result from the backend
 * @param geminiReport The Gemini-generated report
 * @returns Promise that resolves when PDF is generated
 */
export async function generatePDFReport(
  analysisResult: AnalysisResult,
  geminiReport: GeminiReport
): Promise<void> {
  // Create HTML content for the PDF
  const htmlContent = createPDFHTML(analysisResult, geminiReport);

  // Create a temporary container
  const container = document.createElement("div");
  container.innerHTML = htmlContent;
  // Position off-screen instead of display:none so html2canvas can render it
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.padding = "40px";
  container.style.backgroundColor = "white";
  container.style.width = "800px";
  container.style.zIndex = "-1";

  // Override oklch() colors with standard hex colors for html2canvas compatibility
  const style = document.createElement("style");
  style.textContent = `
    #pdf-container * {
      --background: #ffffff !important;
      --foreground: #1f2937 !important;
      --card: #ffffff !important;
      --card-foreground: #1f2937 !important;
      --popover: #ffffff !important;
      --popover-foreground: #1f2937 !important;
      --primary: #f97316 !important;
      --primary-foreground: #ffffff !important;
      --secondary: #f3f4f6 !important;
      --secondary-foreground: #374151 !important;
      --muted: #f3f4f6 !important;
      --muted-foreground: #6b7280 !important;
      --accent: #fef3c7 !important;
      --accent-foreground: #374151 !important;
      --destructive: #ef4444 !important;
      --border: #e5e7eb !important;
      --input: #e5e7eb !important;
      --ring: #f97316 !important;
      --chart-1: #f97316 !important;
      --chart-2: #06b6d4 !important;
      --chart-3: #8b5cf6 !important;
    }
  `;
  container.id = "pdf-container";
  container.appendChild(style);

  document.body.appendChild(container);

  try {
    // Generate PDF using html2canvas and jsPDF
    const canvas = await html2canvas(container, {
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      scale: 2,
      onclone: (clonedDoc) => {
        // In the cloned document, remove all external stylesheets that might have oklch
        const styleSheets = clonedDoc.styleSheets;
        for (let i = styleSheets.length - 1; i >= 0; i--) {
          const sheet = styleSheets[i];
          try {
            // Remove external stylesheets
            if (sheet.href && sheet.ownerNode) {
              sheet.ownerNode.remove();
            }
          } catch (e) {
            // Ignore cross-origin errors
          }
        }
      },
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Calculate dimensions with margin
    const margin = 10; // 10mm margin
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const imgWidth = pdfWidth - 2 * margin;
    const imgHeight = (canvasHeight * imgWidth) / canvasWidth;
    const pageContentHeight = pdfHeight - 2 * margin;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
    heightLeft -= pageContentHeight;

    // Add subsequent pages if content overflows
    while (heightLeft > 0) {
      position -= pageContentHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position + margin, imgWidth, imgHeight);
      heightLeft -= pageContentHeight;
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `HTP-Analysis-Report-${timestamp}.pdf`;

    // Download the PDF
    pdf.save(filename);
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
}

/**
 * Create HTML content for PDF generation
 */
function createPDFHTML(analysisResult: AnalysisResult, geminiReport: GeminiReport): string {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #1f2937;
          line-height: 1.6;
        }

        .page-break {
          page-break-after: always;
        }

        .header {
          border-bottom: 3px solid #f97316;
          padding-bottom: 20px;
          margin-bottom: 30px;
          text-align: center;
        }

        .header h1 {
          font-size: 28px;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .header p {
          color: #6b7280;
          font-size: 12px;
        }

        .metadata {
          background-color: #f9fafb;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          font-size: 12px;
        }

        .metadata-item {
          display: flex;
          justify-content: space-between;
        }

        .metadata-label {
          font-weight: 600;
          color: #4b5563;
        }

        .metadata-value {
          color: #6b7280;
        }

        .section {
          margin-bottom: 25px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }

        .summary-box {
          background-color: #fef3c7;
          border-left: 4px solid #f97316;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .summary-box h3 {
          color: #92400e;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .summary-box p {
          color: #78350f;
          font-size: 13px;
          line-height: 1.5;
        }

        .content-box {
          background-color: #f9fafb;
          padding: 15px;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
          font-size: 12px;
          line-height: 1.6;
        }

        .content-box p {
          margin-bottom: 10px;
        }

        .content-box p:last-child {
          margin-bottom: 0;
        }

        .badge-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 15px;
        }

        .badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
        }

        .badge-positive {
          background-color: #dcfce7;
          color: #166534;
          border: 1px solid #86efac;
        }

        .badge-negative {
          background-color: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .badge-neutral {
          background-color: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .recommendations-list {
          background-color: #f0fdf4;
          padding: 15px 15px 15px 35px;
          border-left: 4px solid #22c55e;
          border-radius: 4px;
        }

        .recommendations-list ol {
          list-style-position: inside;
        }

        .recommendations-list li {
          margin-bottom: 8px;
          font-size: 12px;
          color: #166534;
        }

        .recommendations-list li:last-child {
          margin-bottom: 0;
        }

        .characteristics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          margin-bottom: 15px;
        }

        .characteristic-item {
          background-color: #f3f4f6;
          padding: 10px;
          border-radius: 4px;
          text-align: center;
          font-size: 11px;
        }

        .characteristic-item .value {
          font-weight: 700;
          font-size: 16px;
          color: #f97316;
          margin-bottom: 5px;
        }

        .characteristic-item .label {
          color: #6b7280;
        }

        .disclaimer {
          background-color: #f3f4f6;
          padding: 15px;
          border-radius: 4px;
          border: 1px solid #d1d5db;
          font-size: 11px;
          color: #4b5563;
          font-style: italic;
          line-height: 1.5;
          margin-top: 20px;
        }

        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          font-size: 10px;
          color: #9ca3af;
        }
      </style>
    </head>
    <body>
      <!-- Header -->
      <div class="header">
        <h1>${escapeHtml(geminiReport.title)}</h1>
        <p>HTP (House-Tree-Person) Test Analysis Report</p>
        <p>Generated on ${currentDate}</p>
      </div>

      <!-- Metadata -->
      <div class="metadata">
        <div class="metadata-item">
          <span class="metadata-label">Analysis ID:</span>
          <span class="metadata-value">${escapeHtml(analysisResult.analysis_id.substring(0, 8))}...</span>
        </div>
        <div class="metadata-item">
          <span class="metadata-label">Confidence Score:</span>
          <span class="metadata-value">${(analysisResult.overall_confidence_score * 100).toFixed(1)}%</span>
        </div>
        <div class="metadata-item">
          <span class="metadata-label">Analysis Time:</span>
          <span class="metadata-value">${analysisResult.processing_time_seconds.toFixed(2)}s</span>
        </div>
        <div class="metadata-item">
          <span class="metadata-label">House Size Category:</span>
          <span class="metadata-value">${escapeHtml(analysisResult.house_size_category)}</span>
        </div>
      </div>

      <!-- Executive Summary -->
      <div class="section">
        <div class="summary-box">
          <h3>Executive Summary</h3>
          <p>${escapeHtml(geminiReport.summary)}</p>
        </div>
      </div>

      <!-- House Characteristics -->
      <div class="section">
        <h2 class="section-title">House Characteristics Overview</h2>
        <div class="characteristics-grid">
          <div class="characteristic-item">
            <div class="value">🚪</div>
            <div class="label">Door: ${analysisResult.door_present ? "Present" : "Absent"}</div>
          </div>
          <div class="characteristic-item">
            <div class="value">🪟</div>
            <div class="label">Windows: ${analysisResult.window_count}</div>
          </div>
          <div class="characteristic-item">
            <div class="value">🏠</div>
            <div class="label">Chimney: ${analysisResult.chimney_present ? "Present" : "Absent"}</div>
          </div>
        </div>
      </div>

      <!-- Detected Features -->
      <div class="section">
        <h2 class="section-title">Detected Features & Analysis</h2>
        
        ${analysisResult.detected_features.length > 0
      ? `
          <h3 style="font-size: 14px; color: #4b5563; margin-bottom: 10px;">✓ Positive Features</h3>
          <div class="badge-group">
            ${analysisResult.detected_features
        .map(
          (feature) =>
            `<span class="badge badge-positive">${escapeHtml(feature)}</span>`
        )
        .join("")}
          </div>
        `
      : ""
    }

        ${analysisResult.missing_features.length > 0
      ? `
          <h3 style="font-size: 14px; color: #4b5563; margin-bottom: 10px; margin-top: 15px;">✗ Missing Features</h3>
          <div class="badge-group">
            ${analysisResult.missing_features
        .map(
          (feature) =>
            `<span class="badge badge-negative">${escapeHtml(feature)}</span>`
        )
        .join("")}
          </div>
        `
      : ""
    }

        ${analysisResult.positive_indicators.length > 0
      ? `
          <h3 style="font-size: 14px; color: #4b5563; margin-bottom: 10px; margin-top: 15px;">Positive Indicators</h3>
          <div class="badge-group">
            ${analysisResult.positive_indicators
        .map(
          (indicator) =>
            `<span class="badge badge-positive">${escapeHtml(indicator)}</span>`
        )
        .join("")}
          </div>
        `
      : ""
    }

        ${analysisResult.risk_factors.length > 0
      ? `
          <h3 style="font-size: 14px; color: #4b5563; margin-bottom: 10px; margin-top: 15px;">Areas for Attention</h3>
          <div class="badge-group">
            ${analysisResult.risk_factors
        .map(
          (factor) =>
            `<span class="badge badge-neutral">${escapeHtml(factor)}</span>`
        )
        .join("")}
          </div>
        `
      : ""
    }
      </div>

      <!-- Detailed Analysis -->
      <div class="section">
        <h2 class="section-title">Detailed Psychological Analysis</h2>
        <div class="content-box">
          ${formatDetailedAnalysis(geminiReport.detailedAnalysis)}
        </div>
      </div>

      <!-- Recommendations -->
      <div class="section">
        <h2 class="section-title">Recommendations</h2>
        <div class="recommendations-list">
          <ol>
            ${geminiReport.recommendations
      .map(
        (rec: string) =>
          `<li>${escapeHtml(rec)}</li>`
      )
      .join("")}
          </ol>
        </div>
      </div>

      <!-- Disclaimers -->
      <div class="section">
        <h2 class="section-title">Important Disclaimers</h2>
        <div class="disclaimer">
          ${escapeHtml(geminiReport.disclaimers)}
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>This report was generated by HTP Analyzer - an AI-powered psychological assessment tool.</p>
        <p>Please consult with a qualified mental health professional for clinical interpretation.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Format detailed analysis - handles both string and object formats
 */
function formatDetailedAnalysis(detailedAnalysis: string | unknown): string {
  let text: string;

  // If it's an object, try to stringify it properly
  if (typeof detailedAnalysis === 'object' && detailedAnalysis !== null) {
    // Try to extract meaningful text from object
    const obj = detailedAnalysis as Record<string, unknown>;

    // If it has a text or content property, use that
    if ('text' in obj && typeof obj.text === 'string') {
      text = obj.text;
    } else if ('content' in obj && typeof obj.content === 'string') {
      text = obj.content;
    } else {
      // Otherwise convert object to JSON string for debugging
      text = JSON.stringify(detailedAnalysis, null, 2);
    }
  } else {
    // Convert to string (handles string, number, boolean, etc.)
    text = String(detailedAnalysis || '');
  }

  return text
    .split("\n")
    .filter((line: string) => line.trim())
    .map((line: string) => `<p>${escapeHtml(line)}</p>`)
    .join("");
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string | unknown): string {
  // Ensure text is a string
  const str = String(text || '');

  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return str.replace(/[&<>"']/g, (char) => map[char]);
}
