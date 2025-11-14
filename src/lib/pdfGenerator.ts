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
  door_characteristics?: {
    present: boolean;
    size_category: string;
    position: string;
    accessibility: string;
  };
  window_count: number;
  window_characteristics?: {
    count: number;
    size_variation: string;
    placement: string;
    interpretation: string[];
  };
  chimney_present: boolean;
  chimney_characteristics?: {
    present: boolean;
    size: string;
    smoke_present: boolean;
    position: string;
  };
  roof_characteristics?: {
    present: boolean;
    shape: string;
    size: string;
  };
  wall_characteristics?: {
    present: boolean;
    thickness: string;
    completeness: string;
  };
  detection_confidence: Record<string, number>;
  psychological_indicators: Record<string, string[]>;
  rag_page_references?: Array<{
    reference_id: number;
    pages: string[];
    distance: number;
    chunk_preview: string;
  }>;
}

/**
 * Generate professional PDF reports from analysis results and Gemini reports
 * @param analysisResult The analysis result from the backend
 * @param geminiReport The Gemini-generated reports for both audiences
 * @param reportType Which report to generate: 'psychologist', 'parent', or 'both'
 * @returns Promise that resolves when PDF is generated
 */
export async function generatePDFReport(
  analysisResult: AnalysisResult,
  geminiReport: GeminiReport,
  reportType: 'psychologist' | 'parent' | 'both' = 'both'
): Promise<void> {
  if (reportType === 'both') {
    // Generate both reports
    await generateSinglePDFReport(analysisResult, geminiReport.psychologistReport, 'psychologist');
    await generateSinglePDFReport(analysisResult, geminiReport.parentReport, 'parent');
  } else {
    // Generate single report
    const report = reportType === 'psychologist' ? geminiReport.psychologistReport : geminiReport.parentReport;
    await generateSinglePDFReport(analysisResult, report, reportType);
  }
}

/**
 * Generate a single PDF report
 */
async function generateSinglePDFReport(
  analysisResult: AnalysisResult,
  report: GeminiReport['psychologistReport'] | GeminiReport['parentReport'],
  reportType: 'psychologist' | 'parent'
): Promise<void> {
  // Create HTML content for the PDF
  const htmlContent = createPDFHTML(analysisResult, report, reportType);

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

    // Generate filename with timestamp and report type
    const timestamp = new Date().toISOString().split("T")[0];
    const reportTypeSuffix = reportType === 'psychologist' ? 'Professional' : 'Parent';
    const filename = `HTP-Analysis-Report-${reportTypeSuffix}-${timestamp}.pdf`;

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
function createPDFHTML(
  analysisResult: AnalysisResult,
  report: GeminiReport['psychologistReport'] | GeminiReport['parentReport'],
  reportType: 'psychologist' | 'parent'
): string {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isPsychologistReport = reportType === 'psychologist';
  const reportTitle = isPsychologistReport ? "Professional Psychological Assessment" : "Parent-Friendly Report";
  const headerColor = isPsychologistReport ? "#2563eb" : "#dc2626";
  const sectionTitle = isPsychologistReport ? "Executive Summary" : "Summary for Parents";
  const analysisTitle = isPsychologistReport ? "Detailed Psychological Analysis" : "Understanding Your Child's Drawing";
  const recommendationsTitle = isPsychologistReport ? "Recommendations" : "Ways to Support Your Child";
  const disclaimerTitle = isPsychologistReport ? "Important Disclaimers" : "Important Note for Parents";

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
          border-bottom: 3px solid ${headerColor};
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
        <h1>${escapeHtml(report.title)}</h1>
        <p>${reportTitle} - HTP (House-Tree-Person) Test Analysis</p>
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
          <h3>${sectionTitle}</h3>
          <p>${escapeHtml(report.summary)}</p>
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

      <!-- Detailed Size Analysis -->
      ${analysisResult.door_characteristics || analysisResult.window_characteristics ||
      analysisResult.chimney_characteristics || analysisResult.roof_characteristics ? `
      <div class="section">
        <h2 class="section-title">Detailed Size Analysis</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
          ${analysisResult.door_characteristics ? `
          <div style="padding: 15px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 8px; border: 1px solid #fbbf24;">
            <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 10px; color: #92400e;">🚪 Door Characteristics</h3>
            <div style="font-size: 12px; color: #78350f;">
              <div style="margin-bottom: 5px;"><strong>Size:</strong> ${analysisResult.door_characteristics.size_category}</div>
              <div><strong>Position:</strong> ${analysisResult.door_characteristics.position}</div>
              ${analysisResult.door_characteristics.size_category === 'tiny' ?
        '<div style="margin-top: 8px; padding: 8px; background: #fee2e2; border-radius: 4px; color: #991b1b; font-size: 11px;">⚠️ Tiny doors may indicate fearfulness or withdrawal</div>' : ''}
              ${analysisResult.door_characteristics.size_category === 'large' ?
        '<div style="margin-top: 8px; padding: 8px; background: #fed7aa; border-radius: 4px; color: #c2410c; font-size: 11px;">⚠️ Large doors may indicate dependency needs</div>' : ''}
            </div>
          </div>
          ` : ''}
          
          ${analysisResult.window_characteristics ? `
          <div style="padding: 15px; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 8px; border: 1px solid #3b82f6;">
            <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 10px; color: #1e40af;">🪟 Window Characteristics</h3>
            <div style="font-size: 12px; color: #1e3a8a;">
              <div style="margin-bottom: 5px;"><strong>Count:</strong> ${analysisResult.window_characteristics.count}</div>
              ${analysisResult.window_characteristics.interpretation && analysisResult.window_characteristics.interpretation.length > 0 ?
        `<div style="margin-top: 8px; font-style: italic; font-size: 11px;">${analysisResult.window_characteristics.interpretation.join(', ')}</div>` : ''}
            </div>
          </div>
          ` : ''}
          
          ${analysisResult.chimney_characteristics && analysisResult.chimney_characteristics.present ? `
          <div style="padding: 15px; background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%); border-radius: 8px; border: 1px solid #ec4899;">
            <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 10px; color: #9f1239;">🏠 Chimney Characteristics</h3>
            <div style="font-size: 12px; color: #831843;">
              <div><strong>Size:</strong> ${analysisResult.chimney_characteristics.size}</div>
              ${analysisResult.chimney_characteristics.size === 'large' ?
        '<div style="margin-top: 8px; padding: 8px; background: #fed7aa; border-radius: 4px; color: #c2410c; font-size: 11px;">⚠️ Oversized chimney may indicate preoccupation with fantasy</div>' : ''}
            </div>
          </div>
          ` : ''}
          
          ${analysisResult.roof_characteristics && analysisResult.roof_characteristics.present ? `
          <div style="padding: 15px; background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); border-radius: 8px; border: 1px solid #8b5cf6;">
            <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 10px; color: #5b21b6;">🏘️ Roof Characteristics</h3>
            <div style="font-size: 12px; color: #4c1d95;">
              <div><strong>Size:</strong> ${analysisResult.roof_characteristics.size}</div>
              ${analysisResult.roof_characteristics.size === 'large' ?
        '<div style="margin-top: 8px; padding: 8px; background: #fed7aa; border-radius: 4px; color: #c2410c; font-size: 11px;">⚠️ Large roof may indicate excessive fantasy or intellectual preoccupation</div>' : ''}
            </div>
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}

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
        <h2 class="section-title">${analysisTitle}</h2>
        <div class="content-box">
          ${formatDetailedAnalysis(report.detailedAnalysis)}
        </div>
      </div>

      <!-- Recommendations -->
      <div class="section">
        <h2 class="section-title">${recommendationsTitle}</h2>
        <div class="recommendations-list">
          <ol>
            ${report.recommendations
      .map(
        (rec: string) =>
          `<li>${escapeHtml(rec)}</li>`
      )
      .join("")}
          </ol>
        </div>
      </div>

      <!-- Page References -->
      ${analysisResult.rag_page_references && analysisResult.rag_page_references.length > 0 ? `
      <div class="section">
        <h2 class="section-title">Reference Sources from HTP Guide</h2>
        <div style="background-color: #fef3c7; border-left: 4px solid #f97316; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
          <p style="margin: 0; color: #92400e; font-size: 12px;">The following page numbers from the HTP interpretation manual are relevant to this analysis:</p>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          ${analysisResult.rag_page_references.map((ref) => `
          <div style="padding: 12px; background-color: #fef9e7; border: 1px solid #fbbf24; border-radius: 6px; font-size: 11px;">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <span style="background-color: #f97316; color: white; padding: 3px 8px; border-radius: 3px; font-weight: 600; margin-right: 8px;">Pages ${ref.pages.join(', ')}</span>
              <span style="background-color: #fff7ed; color: #c2410c; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 500;">Relevance: ${(100 - Math.min(ref.distance * 10, 100)).toFixed(0)}%</span>
            </div>
            <p style="margin: 0; color: #78350f; font-style: italic; line-height: 1.4;">"${escapeHtml(ref.chunk_preview)}"</p>
          </div>
          `).join('')}
        </div>
        <p style="margin-top: 15px; font-size: 10px; color: #6b7280; font-style: italic;">💡 These references correspond to specific sections in the HTP interpretation guide that are relevant to this analysis.</p>
      </div>
      ` : ''}

      <!-- Disclaimers -->
      <div class="section">
        <h2 class="section-title">${disclaimerTitle}</h2>
        <div class="disclaimer">
          ${escapeHtml(report.disclaimers)}
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
