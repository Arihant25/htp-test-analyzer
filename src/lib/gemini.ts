import { GoogleGenerativeAI } from "@google/generative-ai";

interface AnalysisResult {
  analysis_id: string;
  house_size_category: string;
  detected_features: string[];
  missing_features: string[];
  risk_factors: string[];
  positive_indicators: string[];
  psychological_interpretation: string; // Keep for backward compatibility
  psychologist_interpretation?: string;
  parent_interpretation?: string;
  overall_confidence_score: number;
  processing_time_seconds: number;
  house_area_ratio: number;
  house_placement: string[];
  door_present: boolean;
  window_count: number;
  chimney_present: boolean;
  detection_confidence: Record<string, number>;
  psychological_indicators: Record<string, string[]>;
  rag_context?: string;
  rag_page_references?: Array<{
    reference_id: number;
    pages: string[];
    distance: number;
    chunk_preview: string;
  }>;
}

export interface GeminiReport {
  psychologistReport: {
    title: string;
    summary: string;
    detailedAnalysis: string;
    recommendations: string[];
    disclaimers: string;
  };
  parentReport: {
    title: string;
    summary: string;
    detailedAnalysis: string;
    recommendations: string[];
    disclaimers: string;
  };
}

/**
 * Generate comprehensive psychological reports for both psychologists and parents using Gemini 2.5 Flash Lite
 * @param analysisResult The analysis result from the backend
 * @returns Detailed psychological reports for both audiences
 */
export async function generateReportWithGemini(analysisResult: AnalysisResult): Promise<GeminiReport> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Gemini API key not found. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables."
    );
  }

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const detectionConfidenceSummary = Object.entries(analysisResult.detection_confidence ?? {})
    .map(([feature, score]) => `${feature}: ${(score * 100).toFixed(1)}%`)
    .join(", ") || "Not available";

  // Generate psychologist report
  const psychologistPrompt = `You are an expert psychologist specializing in projective psychological assessments, particularly the House-Tree-Person (HTP) test. 

Analyze the following HTP test analysis results and provide a comprehensive psychological report for mental health professionals:

**Analysis Data:**
- House Size Category: ${analysisResult.house_size_category}
- Detected Features: ${analysisResult.detected_features.join(", ") || "None"}
- Missing Features: ${analysisResult.missing_features.join(", ") || "None"}
- Positive Indicators: ${analysisResult.positive_indicators.join(", ") || "None"}
- Risk Factors / Areas for Attention: ${analysisResult.risk_factors.join(", ") || "None"}
- Analysis Confidence Score: ${(analysisResult.overall_confidence_score * 100).toFixed(1)}%
- Door Present: ${analysisResult.door_present ? "Yes" : "No"}
- Window Count: ${analysisResult.window_count}
- Chimney Present: ${analysisResult.chimney_present ? "Yes" : "No"}
- House Area Ratio: ${analysisResult.house_area_ratio.toFixed(2)}
- House Placement: ${analysisResult.house_placement.join(", ") || "Standard"}
- Detection Confidence Scores: ${detectionConfidenceSummary}
- Psychological Indicators: ${JSON.stringify(analysisResult.psychological_indicators)}

Please provide:
1. **TITLE**: A professional title for this psychological assessment
2. **EXECUTIVE SUMMARY**: A 2-3 sentence summary of key findings (2-3 sentences max)
3. **DETAILED ANALYSIS**: A comprehensive analysis written as cohesive, flowing paragraphs (NOT as JSON or structured data). Cover:
   - Interpretation of house characteristics and what they indicate about the individual
   - Analysis of structural elements (doors, windows, chimney) and their psychological significance
   - Interpretation of positive indicators and strengths
   - Analysis of risk factors and areas requiring attention
   - Overall psychological profile based on the HTP test
   
   Write this section as natural, professional prose - like you would in a formal psychological report. Use multiple paragraphs to organize your thoughts, but DO NOT use JSON format, bullet points, or structured lists here.

4. **RECOMMENDATIONS**: 3-5 specific, actionable recommendations for further assessment or support
5. **DISCLAIMERS**: Standard disclaimer about the nature of this assessment

Format your response as JSON with these exact keys: "title", "summary", "detailedAnalysis", "recommendations" (as an array), "disclaimers"

CRITICAL: The "detailedAnalysis" value must be a string containing well-written paragraphs, NOT JSON or structured data. Write it as you would in a professional psychological report.

Important: Ensure your analysis is professional, evidence-based, and appropriate for a psychological assessment context.`;

  // Generate parent report
  const parentPrompt = `You are a child psychologist explaining a House-Tree-Person (HTP) drawing analysis to parents in simple, supportive language.

Based on the following HTP drawing analysis results, provide a warm, encouraging interpretation that helps parents understand their child's drawing:

**Child's Drawing Analysis:**
- House size: ${analysisResult.house_size_category} (${(analysisResult.house_area_ratio * 100).toFixed(1)}% of the page)
- What was drawn: ${analysisResult.detected_features.join(", ") || "Basic house elements"}
- What was missing: ${analysisResult.missing_features.join(", ") || "Some typical house features"}
- Positive aspects: ${analysisResult.positive_indicators.join(", ") || "Some healthy indicators"}
- Areas to watch: ${analysisResult.risk_factors.join(", ") || "Some areas for attention"}
- Door present: ${analysisResult.door_present ? "Yes" : "No"}
- Windows: ${analysisResult.window_count}
- Chimney: ${analysisResult.chimney_present ? "Yes" : "No"}

Write a supportive, parent-friendly explanation that:
1. **TITLE**: A warm, reassuring title for parents
2. **SUMMARY**: A 2-3 sentence overview in simple language
3. **DETAILED ANALYSIS**: A narrative explanation written as flowing paragraphs that tells the story of what the child's drawing might mean. Use everyday language like "might be feeling" or "could be showing". Focus on understanding the child's world through their drawing.
4. **RECOMMENDATIONS**: 3-5 gentle, practical suggestions for parents to support their child
5. **DISCLAIMERS**: A simple note that this is not a diagnosis but one way to understand the child

Format your response as JSON with these exact keys: "title", "summary", "detailedAnalysis", "recommendations" (as an array), "disclaimers"

Write the detailedAnalysis as a continuous, supportive narrative that parents can easily read and understand. Keep it to 400-500 words.

Start with something encouraging like: "Looking at your child's house drawing, I can see..." and end with hope and support.`;

  try {
    // Generate both reports in parallel
    const [psychologistResponse, parentResponse] = await Promise.all([
      model.generateContent(psychologistPrompt),
      model.generateContent(parentPrompt)
    ]);

    const psychologistText = psychologistResponse.response.text();
    const parentText = parentResponse.response.text();

    // Extract JSON from responses
    const psychologistJsonMatch = psychologistText.match(/\{[\s\S]*\}/);
    const parentJsonMatch = parentText.match(/\{[\s\S]*\}/);

    if (!psychologistJsonMatch || !parentJsonMatch) {
      throw new Error("Failed to parse Gemini responses as JSON");
    }

    const psychologistReport = JSON.parse(psychologistJsonMatch[0]);
    const parentReport = JSON.parse(parentJsonMatch[0]);

    // Validate responses
    const validateReport = (report: any, audience: string) => {
      if (!report.title || !report.summary || !report.detailedAnalysis || !report.recommendations || !report.disclaimers) {
        throw new Error(`${audience} report missing required fields`);
      }
    };

    validateReport(psychologistReport, "Psychologist");
    validateReport(parentReport, "Parent");

    return {
      psychologistReport,
      parentReport
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate reports with Gemini: ${error.message}`);
    }
    throw new Error("Failed to generate reports with Gemini: Unknown error");
  }
}

/**
 * Format the Gemini reports for HTML display
 * @param report The Gemini reports for both audiences
 * @returns HTML string representation of the reports
 */
export function formatReportAsHTML(report: GeminiReport): string {
  const psychologistRecommendationsHTML = report.psychologistReport.recommendations
    .map((rec) => `<li>${escapeHtml(rec)}</li>`)
    .join("");

  const parentRecommendationsHTML = report.parentReport.recommendations
    .map((rec) => `<li>${escapeHtml(rec)}</li>`)
    .join("");

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333;">
      <!-- Psychologist Report -->
      <div style="margin-bottom: 40px; border: 2px solid #2563eb; border-radius: 8px; padding: 20px;">
        <h1 style="color: #1f2937; border-bottom: 3px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px;">👨‍⚕️ Professional Psychological Report</h1>
        
        <h2 style="color: #1f2937; margin-bottom: 10px;">${escapeHtml(report.psychologistReport.title)}</h2>
        
        <div style="background-color: #fef3c7; border-left: 4px solid #f97316; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #92400e; margin-top: 0;">Executive Summary</h3>
          <p style="margin: 0; color: #78350f;">${escapeHtml(report.psychologistReport.summary)}</p>
        </div>
        
        <div style="margin: 30px 0;">
          <h3 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Detailed Analysis</h3>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 4px;">
            ${formatDetailedAnalysisHTML(report.psychologistReport.detailedAnalysis)}
          </div>
        </div>
        
        <div style="margin: 30px 0;">
          <h3 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Recommendations</h3>
          <ul style="background-color: #f0fdf4; padding: 20px 40px; border-radius: 4px; border-left: 4px solid #22c55e;">
            ${psychologistRecommendationsHTML}
          </ul>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 15px; margin-top: 30px; border-radius: 4px; border: 1px solid #d1d5db;">
          <h4 style="color: #4b5563; margin-top: 0;">Disclaimers & Important Notes</h4>
          <p style="font-size: 0.9em; color: #6b7280; margin: 0;">${escapeHtml(report.psychologistReport.disclaimers)}</p>
        </div>
      </div>

      <!-- Parent Report -->
      <div style="border: 2px solid #dc2626; border-radius: 8px; padding: 20px;">
        <h1 style="color: #1f2937; border-bottom: 3px solid #dc2626; padding-bottom: 10px; margin-bottom: 20px;">👨‍👩‍👧‍👦 Parent-Friendly Report</h1>
        
        <h2 style="color: #1f2937; margin-bottom: 10px;">${escapeHtml(report.parentReport.title)}</h2>
        
        <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #991b1b; margin-top: 0;">Summary for Parents</h3>
          <p style="margin: 0; color: #7f1d1d;">${escapeHtml(report.parentReport.summary)}</p>
        </div>
        
        <div style="margin: 30px 0;">
          <h3 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Understanding Your Child's Drawing</h3>
          <div style="background-color: #fef7f7; padding: 15px; border-radius: 4px; border: 1px solid #fecaca;">
            ${formatDetailedAnalysisHTML(report.parentReport.detailedAnalysis)}
          </div>
        </div>
        
        <div style="margin: 30px 0;">
          <h3 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Ways to Support Your Child</h3>
          <ul style="background-color: #fef7f7; padding: 20px 40px; border-radius: 4px; border-left: 4px solid #dc2626;">
            ${parentRecommendationsHTML}
          </ul>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 15px; margin-top: 30px; border-radius: 4px; border: 1px solid #d1d5db;">
          <h4 style="color: #4b5563; margin-top: 0;">Important Note for Parents</h4>
          <p style="font-size: 0.9em; color: #6b7280; margin: 0;">${escapeHtml(report.parentReport.disclaimers)}</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Format detailed analysis for HTML - handles both string and object formats
 */
function formatDetailedAnalysisHTML(detailedAnalysis: string | unknown): string {
  let text: string;

  // If it's an object, try to extract meaningful text
  if (typeof detailedAnalysis === 'object' && detailedAnalysis !== null) {
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
    .filter((line) => line.trim())
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");
}

/**
 * Escape HTML special characters
 * @param text Text to escape
 * @returns Escaped text
 */
function escapeHtml(text: string | unknown): string {
  // Ensure text is a string
  const str = String(text || '');

  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
