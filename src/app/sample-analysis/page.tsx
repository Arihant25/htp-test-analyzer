"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Brain,
    ArrowLeft,
    Download,
    Share,
    CheckCircle,
    AlertTriangle,
    Home,
    Eye,
    Heart,
    Clock,
    Shield,
    Target,
    Loader2,
    X
} from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { generateReportWithGemini } from "@/lib/gemini";
import { generatePDFReport } from "@/lib/pdfGenerator";



export default function SampleAnalysis() {
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [reportGenerated, setReportGenerated] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sample analysis result based on the page content
    const sampleAnalysisResult = {
        analysis_id: "sample-demo-001",
        house_size_category: "Normal",
        detected_features: ["door", "roof", "chimney", "window", "house", "wall"],
        missing_features: [],
        risk_factors: [],
        positive_indicators: ["balanced vertical placement", "appropriate size perception", "balanced horizontal placement"],
        psychological_interpretation: "The individual's representation of the house is of normal size, suggesting a balanced perception of self and personal space. Its placement in the center and middle of the page signifies a grounded and secure individual, comfortable with their current position and feeling a sense of stability.",
        overall_confidence_score: 0.834,
        processing_time_seconds: 0.98,
        house_area_ratio: 0.16,
        house_placement: ["center", "middle"],
        door_present: true,
        window_count: 2,
        chimney_present: true,
        detection_confidence: {
            "door": 0.92,
            "roof": 0.89,
            "chimney": 0.71,
            "window": 0.88,
            "house": 0.85,
            "wall": 0.90
        },
        psychological_indicators: {
            "emotional_security": ["balanced vertical placement"],
            "social_functioning": ["appropriate size perception"],
            "environmental_comfort": ["balanced horizontal placement"]
        }
    };

    const generateAndDownloadReport = async () => {
        setIsGeneratingReport(true);
        setError(null);

        try {
            // Generate report using Gemini
            const geminiReport = await generateReportWithGemini(sampleAnalysisResult);

            // Generate and download PDF
            await generatePDFReport(sampleAnalysisResult, geminiReport);

            setReportGenerated(true);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to generate report';
            setError(errorMessage);
            console.error('Report generation error:', err);
        } finally {
            setIsGeneratingReport(false);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
            {/* Header */}
            <Navbar
                rightContent={
                    <Link href="/">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                }
            />

            {/* Page Title */}
            <section className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Sample HTP Analysis Report
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                        This is a demonstration of how our AI analyzes house drawings and generates comprehensive psychological assessment reports.
                    </p>
                    <div className="flex flex-wrap gap-3 mb-8">
                        <Badge variant="secondary" className="px-3 py-1">
                            <Clock className="mr-1 h-4 w-4" />
                            Analysis completed in 0.98 seconds
                        </Badge>
                        <Badge variant="secondary" className="px-3 py-1">
                            <Eye className="mr-1 h-4 w-4" />
                            6 features detected
                        </Badge>
                        <Badge variant="secondary" className="px-3 py-1">
                            <Brain className="mr-1 h-4 w-4" />
                            AI Confidence: 83.4%
                        </Badge>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 pb-16">
                <div className="max-w-6xl mx-auto">
                    {/* Error Display */}
                    {error && (
                        <Card className="border-red-200 dark:border-red-800 mb-8">
                            <CardContent className="pt-6">
                                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                                    <AlertTriangle className="h-5 w-5" />
                                    <span>{error}</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Header with Overall Results */}
                    <Card className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 border-2 border-green-200/50 dark:border-green-700/30 shadow-xl mb-8">
                        <CardHeader className="text-center pb-4">
                            <CardTitle className="flex items-center justify-center text-3xl font-bold">
                                <CheckCircle className="mr-3 h-10 w-10 text-green-600 drop-shadow-md" />
                                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                    Analysis Complete
                                </span>
                            </CardTitle>
                            <CardDescription className="text-lg mt-2 flex items-center justify-center gap-2">
                                <Clock className="h-5 w-5 text-blue-600" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    Analysis completed in 0.98 seconds
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="mb-6 relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 opacity-20 blur-3xl rounded-full"></div>
                                <div className="relative">
                                    <div className="text-7xl font-black bg-gradient-to-br from-green-500 via-blue-600 to-blue-600 bg-clip-text text-transparent mb-3 tracking-tight">
                                        83.4%
                                    </div>
                                    <div className="text-xl text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                        Overall Analysis Confidence
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        AI insights are ready.
                                    </div>
                                    <div className="w-48 h-2 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-500 to-blue-600 rounded-full transition-all duration-1000"
                                            style={{ width: '83.4%' }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Analysis - Full Width Rows */}
                    <div className="space-y-8">
                        {/* Row 1: Sample Drawing and Metadata */}
                        <div className="grid lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Home className="mr-2 h-5 w-5" />
                                        Original Drawing
                                    </CardTitle>
                                    <CardDescription>
                                        Sample house drawing analysis
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                                        <div className="text-center text-gray-500 dark:text-gray-400">
                                            <Home className="h-16 w-16 mx-auto mb-2" />
                                            <p>Sample house drawing would appear here</p>
                                            <p className="text-sm mt-1">(Drawing placeholder)</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            size="sm"
                                            onClick={generateAndDownloadReport}
                                            disabled={isGeneratingReport || reportGenerated}
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                        >
                                            {isGeneratingReport ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Generating Report...
                                                </>
                                            ) : reportGenerated ? (
                                                <>
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Report Downloaded
                                                </>
                                            ) : (
                                                <>
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Download PDF Report
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Drawing Metadata */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Drawing Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Analysis ID:</span>
                                        <span className="font-medium">sample-demo-001</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">House Size:</span>
                                        <span className="font-medium">Normal</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">House Area Ratio:</span>
                                        <span className="font-medium">0.16</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Placement:</span>
                                        <span className="font-medium">Center, Middle</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Processing Time:</span>
                                        <span className="font-medium">0.98 seconds</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Row 2: House Characteristics */}
                        <Card className="border-2 border-blue-200/60 dark:border-blue-800/60 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-blue-50/30 to-white dark:from-blue-900/10 dark:to-gray-900">
                            <CardHeader>
                                <CardTitle className="flex items-center text-2xl font-bold">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                                        <Home className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <span className="bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                                        House Characteristics
                                    </span>
                                </CardTitle>
                                <CardDescription className="text-sm mt-1">
                                    Structural elements detected in the drawing
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-3xl">
                                    <div className="text-center p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                                        <div className="text-3xl mb-2 drop-shadow-md">🚪</div>
                                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Door Present</div>
                                        <Badge variant="default" className="text-xs font-semibold shadow-sm bg-green-600">Yes</Badge>
                                    </div>
                                    <div className="text-center p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                                        <div className="text-3xl mb-2 drop-shadow-md">🪟</div>
                                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Windows</div>
                                        <Badge variant="outline" className="text-xs font-semibold shadow-sm">2</Badge>
                                    </div>
                                    <div className="text-center p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                                        <div className="text-3xl mb-2 drop-shadow-md">🏠</div>
                                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Chimney</div>
                                        <Badge variant="default" className="text-xs font-semibold shadow-sm bg-green-600">Present</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Row 3: Detected Features */}
                        <Card className="border-2 border-green-200/60 dark:border-green-800/60 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-green-50/30 to-white dark:from-green-900/10 dark:to-gray-900">
                            <CardHeader>
                                <CardTitle className="flex items-center text-2xl font-bold">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                                        <Eye className="h-6 w-6 text-green-600" />
                                    </div>
                                    <span className="bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent">
                                        Detected Features
                                    </span>
                                </CardTitle>
                                <CardDescription className="text-sm mt-1">
                                    Elements identified by AI analysis
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div>
                                    <h4 className="text-sm font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Detected Features
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/40 dark:to-green-900/20 dark:text-green-300 border border-green-300 dark:border-green-700 px-3 py-1.5 text-sm font-semibold shadow-sm hover:shadow-md transition-shadow">
                                            <CheckCircle className="mr-1 h-3 w-3" /> door
                                        </Badge>
                                        <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/40 dark:to-green-900/20 dark:text-green-300 border border-green-300 dark:border-green-700 px-3 py-1.5 text-sm font-semibold shadow-sm hover:shadow-md transition-shadow">
                                            <CheckCircle className="mr-1 h-3 w-3" /> roof
                                        </Badge>
                                        <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/40 dark:to-green-900/20 dark:text-green-300 border border-green-300 dark:border-green-700 px-3 py-1.5 text-sm font-semibold shadow-sm hover:shadow-md transition-shadow">
                                            <CheckCircle className="mr-1 h-3 w-3" /> chimney
                                        </Badge>
                                        <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/40 dark:to-green-900/20 dark:text-green-300 border border-green-300 dark:border-green-700 px-3 py-1.5 text-sm font-semibold shadow-sm hover:shadow-md transition-shadow">
                                            <CheckCircle className="mr-1 h-3 w-3" /> window
                                        </Badge>
                                        <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/40 dark:to-green-900/20 dark:text-green-300 border border-green-300 dark:border-green-700 px-3 py-1.5 text-sm font-semibold shadow-sm hover:shadow-md transition-shadow">
                                            <CheckCircle className="mr-1 h-3 w-3" /> house
                                        </Badge>
                                        <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/40 dark:to-green-900/20 dark:text-green-300 border border-green-300 dark:border-green-700 px-3 py-1.5 text-sm font-semibold shadow-sm hover:shadow-md transition-shadow">
                                            <CheckCircle className="mr-1 h-3 w-3" /> wall
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Row 4: Psychological Indicators */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Positive Indicators */}
                            <Card className="border-2 border-green-200/60 dark:border-green-800/60 bg-gradient-to-br from-green-50/80 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/10 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center text-xl font-bold">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg mr-3">
                                            <Shield className="h-5 w-5 text-green-600" />
                                        </div>
                                        <span className="bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent">
                                            Positive Indicators (3)
                                        </span>
                                    </CardTitle>
                                    <CardDescription className="text-xs mt-1">
                                        Strengths identified in the drawing
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        <li className="flex items-start text-sm text-green-800 dark:text-green-300 bg-white/60 dark:bg-gray-800/40 p-3 rounded-lg border border-green-200 dark:border-green-800/50 shadow-sm hover:shadow-md transition-shadow">
                                            <CheckCircle className="mr-2 h-5 w-5 mt-0.5 flex-shrink-0 text-green-600" />
                                            <span className="font-medium">balanced vertical placement</span>
                                        </li>
                                        <li className="flex items-start text-sm text-green-800 dark:text-green-300 bg-white/60 dark:bg-gray-800/40 p-3 rounded-lg border border-green-200 dark:border-green-800/50 shadow-sm hover:shadow-md transition-shadow">
                                            <CheckCircle className="mr-2 h-5 w-5 mt-0.5 flex-shrink-0 text-green-600" />
                                            <span className="font-medium">appropriate size perception</span>
                                        </li>
                                        <li className="flex items-start text-sm text-green-800 dark:text-green-300 bg-white/60 dark:bg-gray-800/40 p-3 rounded-lg border border-green-200 dark:border-green-800/50 shadow-sm hover:shadow-md transition-shadow">
                                            <CheckCircle className="mr-2 h-5 w-5 mt-0.5 flex-shrink-0 text-green-600" />
                                            <span className="font-medium">balanced horizontal placement</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Areas for Attention */}
                            <Card className="border-2 border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-gray-900/20 dark:to-gray-800/10 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center text-xl font-bold">
                                        <div className="p-2 bg-gray-100 dark:bg-gray-800/40 rounded-lg mr-3">
                                            <AlertTriangle className="h-5 w-5 text-gray-600" />
                                        </div>
                                        <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                                            Areas for Attention (0)
                                        </span>
                                    </CardTitle>
                                    <CardDescription className="text-xs mt-1">
                                        Concerns requiring consideration
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8 px-4 bg-white/60 dark:bg-gray-800/40 rounded-lg border border-gray-200 dark:border-gray-700/50">
                                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">No areas of concern identified</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Row 5: Psychological Interpretation - Full Width */}
                        <Card className="border-2 border-purple-200/60 dark:border-purple-800/60 bg-gradient-to-br from-purple-50/80 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/10 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center text-2xl font-bold">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg mr-3">
                                        <Brain className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <span className="bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                                        Psychological Interpretation
                                    </span>
                                </CardTitle>
                                <CardDescription className="text-sm mt-1">
                                    Professional analysis of drawing elements
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-purple-200 dark:border-purple-700 shadow-md">
                                    <div className="prose dark:prose-invert max-w-none">
                                        <h3 className="text-lg font-bold text-purple-900 dark:text-purple-300 mb-4">
                                            AI Psychological Interpretation
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 italic">
                                            Insights generated by Gemini 2.5 Flash Lite
                                        </p>

                                        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">
                                            Executive Summary
                                        </h4>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                            This House-Tree-Person (HTP) projective drawing analysis indicates a reasonably secure individual with appropriate perception of self and environment. The drawing suggests a stable foundation and an openness to external interactions, with no immediate risk factors identified.
                                        </p>

                                        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">
                                            Detailed Analysis
                                        </h4>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                            The individual's representation of the house is of normal size, suggesting a balanced perception of self and personal space. Its placement in the center and middle of the page signifies a grounded and secure individual, comfortable with their current position and feeling a sense of stability. The presence of all expected features (door, roof, chimney, window, house, wall) without any omissions points towards a comprehensive and integrated self-concept.
                                        </p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                            The presence of a door signifies openness to interaction and the ability to engage with the external world. The two windows indicate a balanced approach to observation and intake of information from the environment. The chimney's presence suggests a connection to emotional expression and warmth, though its prominence or detail is not specified.
                                        </p>

                                        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">
                                            Recommendations
                                        </h4>
                                        <ul className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-2 mb-4 list-disc pl-5">
                                            <li>Consider a follow-up interview to explore the individual's perceptions of their home environment and significant relationships</li>
                                            <li>Monitor for any changes in the individual's self-perception or environmental engagement over time</li>
                                            <li>Encourage engagement in activities that foster emotional expression and connection</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Additional Insights */}
                    <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-2 border-blue-200/50 dark:border-blue-700/30 shadow-lg mt-8">
                        <CardHeader>
                            <CardTitle className="flex items-center text-2xl font-bold">
                                <Heart className="mr-3 h-7 w-7 text-pink-600 drop-shadow-md" />
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Analysis Summary
                                </span>
                            </CardTitle>
                            <CardDescription className="text-base mt-1 text-gray-600 dark:text-gray-400">
                                Key metrics from the house drawing analysis
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                    <div className="relative text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-blue-100 dark:border-blue-900/50">
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-3">
                                            <Eye className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div className="text-4xl font-black bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
                                            6
                                        </div>
                                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Features Detected</div>
                                        <div className="mt-2 h-1 w-16 mx-auto bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                    <div className="relative text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-green-100 dark:border-green-900/50">
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mb-3">
                                            <Shield className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div className="text-4xl font-black bg-gradient-to-br from-green-600 to-green-800 bg-clip-text text-transparent mb-2">
                                            3
                                        </div>
                                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Positive Indicators</div>
                                        <div className="mt-2 h-1 w-16 mx-auto bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                    <div className="relative text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 dark:border-gray-900/50">
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-900/30 rounded-full mb-3">
                                            <CheckCircle className="h-6 w-6 text-gray-600" />
                                        </div>
                                        <div className="text-4xl font-black bg-gradient-to-br from-gray-600 to-gray-800 bg-clip-text text-transparent mb-2">
                                            0
                                        </div>
                                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Areas of Attention</div>
                                        <div className="mt-2 h-1 w-16 mx-auto bg-gradient-to-r from-gray-400 to-gray-600 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Call to Action */}
                <div className="max-w-4xl mx-auto mt-16 text-center">
                    <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
                        <CardContent className="pt-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Ready to Analyze Your Own House Drawing?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Upload a house drawing and get a comprehensive analysis report like this one in under 5 seconds.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/analyze">
                                    <Button size="lg" className="px-8">
                                        <Brain className="mr-2 h-5 w-5" />
                                        Start Your Analysis
                                    </Button>
                                </Link>
                                <Link href="/">
                                    <Button variant="outline" size="lg" className="px-8">
                                        <ArrowLeft className="mr-2 h-5 w-5" />
                                        Back to Home
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
