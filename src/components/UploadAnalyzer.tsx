import React, { useState, useCallback, useRef } from 'react';
import { Upload, Loader2, AlertCircle, CheckCircle, X, Home, Eye, Heart, Brain, TrendingUp, Clock, Target, Shield, AlertTriangle, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateReportWithGemini, type GeminiReport } from '@/lib/gemini';
import { generatePDFReport } from '@/lib/pdfGenerator';

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

interface UploadAnalyzerProps {
    onAnalysisComplete?: (result: AnalysisResult) => void;
}

export default function UploadAnalyzer({ onAnalysisComplete }: UploadAnalyzerProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [confidenceThreshold, setConfidenceThreshold] = useState(0.25);
    const [reportGenerated, setReportGenerated] = useState(false);
    const [geminiReport, setGeminiReport] = useState<GeminiReport | null>(null);
    const [isGeneratingGemini, setIsGeneratingGemini] = useState(false);
    const [geminiError, setGeminiError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    const runGeminiReport = useCallback(async (result: AnalysisResult) => {
        setIsGeneratingGemini(true);
        setGeminiError(null);

        try {
            const report = await generateReportWithGemini(result);
            setGeminiReport(report);
            setReportGenerated(false);
        } catch (err) {
            console.error('Gemini report generation error:', err);
            setGeminiReport(null);
            setGeminiError('Unable to generate AI insights right now. Please try again.');
        } finally {
            setIsGeneratingGemini(false);
        }
    }, []);

    const handleRetryGemini = () => {
        if (analysisResult) {
            void runGeminiReport(analysisResult);
        }
    };

    const renderParagraphs = (text: string) =>
        text
            .split(/\n+/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)
            .map((paragraph, index) => (
                <p key={index} className="mb-3 last:mb-0">
                    {paragraph}
                </p>
            ));

    const validateFile = (file: File): string | null => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/bmp', 'image/tiff'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!allowedTypes.includes(file.type)) {
            return 'Please upload a valid image file (JPEG, PNG, BMP, or TIFF)';
        }

        if (file.size > maxSize) {
            return 'File size must be less than 10MB';
        }

        return null;
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            const file = files[0];
            const validationError = validateFile(file);

            if (validationError) {
                setError(validationError);
                return;
            }

            setSelectedFile(file);
            setError(null);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const validationError = validateFile(file);

            if (validationError) {
                setError(validationError);
                return;
            }

            setSelectedFile(file);
            setError(null);
        }
    };

    const analyzeImage = async () => {
        if (!selectedFile) return;

        setIsAnalyzing(true);
        setError(null);
        setAnalysisResult(null);
        setReportGenerated(false);
        setGeminiReport(null);
        setGeminiError(null);

        let result: AnalysisResult | null = null;

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await fetch(`${API_BASE_URL}/analyze?confidence_threshold=${confidenceThreshold}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Analysis failed');
            }

            const parsedResult: AnalysisResult = await response.json();
            result = parsedResult;
            setAnalysisResult(parsedResult);
            onAnalysisComplete?.(parsedResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setIsAnalyzing(false);
        }

        if (result) {
            void runGeminiReport(result);
        }
    };

    const generateAndDownloadReport = async () => {
        if (!analysisResult || !geminiReport) {
            setError('AI insights are not ready yet. Please wait before downloading the report.');
            return;
        }

        setIsGeneratingReport(true);
        setError(null);

        try {
            await generatePDFReport(analysisResult, geminiReport);

            setReportGenerated(true);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to generate report';
            setError(errorMessage);
            console.error('Report generation error:', err);
        } finally {
            setIsGeneratingReport(false);
        }
    };

    const clearSelection = () => {
        setSelectedFile(null);
        setAnalysisResult(null);
        setError(null);
        setReportGenerated(false);
        setGeminiReport(null);
        setGeminiError(null);
        setIsGeneratingGemini(false);
    };

    return (
        <div className="space-y-6">
            {/* File Upload Area */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Upload className="mr-2 h-5 w-5" />
                        Upload House Drawing
                    </CardTitle>
                    <CardDescription>
                        Upload a house drawing image for AI-powered psychological analysis
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-orange-400'
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {selectedFile ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center space-x-2">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                    <span className="text-lg font-medium">{selectedFile.name}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearSelection}
                                        className="ml-2"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                </p>

                                {/* Confidence Threshold */}
                                <div className="max-w-sm mx-auto">
                                    <label className="block text-sm font-medium mb-2">
                                        Detection Confidence: {(confidenceThreshold * 100).toFixed(0)}%
                                    </label>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="0.9"
                                        step="0.05"
                                        value={confidenceThreshold}
                                        onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>More Sensitive</span>
                                        <span>More Precise</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={analyzeImage}
                                    disabled={isAnalyzing || isGeneratingGemini}
                                    className="px-8"
                                    size="lg"
                                >
                                    {isAnalyzing || isGeneratingGemini ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {isAnalyzing ? 'Analyzing...' : 'Preparing AI insights...'}
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Analyze Drawing
                                        </>
                                    )}
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                                <div>
                                    <p className="text-lg font-medium">Drop your house drawing here</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        or click to browse files
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="file-upload"
                                    ref={fileInputRef}
                                />
                                <Button
                                    variant="outline"
                                    className="cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Browse Files
                                </Button>
                                <p className="text-xs text-gray-500">
                                    Supported formats: JPEG, PNG, BMP, TIFF (max 10MB)
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
                <Card className="border-red-200 dark:border-red-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                            <AlertCircle className="h-5 w-5" />
                            <span>{error}</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Analysis Result */}
            {analysisResult && (
                <div className="space-y-8">
                    {/* Header with Overall Results */}
                    <Card className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 border-0 shadow-lg">
                        <CardHeader className="text-center pb-4">
                            <CardTitle className="flex items-center justify-center text-2xl">
                                <CheckCircle className="mr-3 h-8 w-8 text-green-600" />
                                Analysis Complete
                            </CardTitle>
                            <CardDescription className="text-lg">
                                <Clock className="inline mr-2 h-4 w-4" />
                                Analysis completed in {analysisResult.processing_time_seconds.toFixed(2)} seconds
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="mb-6">
                                <div className="text-6xl font-bold text-orange-600 mb-2">
                                    {(analysisResult.overall_confidence_score * 100).toFixed(1)}%
                                </div>
                                <div className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                                    Overall Analysis Confidence
                                </div>
                            </div>

                            {/* Report Generation Section */}
                            <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    AI insights are {isGeneratingGemini ? 'being prepared' : geminiReport ? 'ready' : 'pending'}.
                                </p>
                                {!geminiReport && !isGeneratingGemini && (
                                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-3">
                                        AI insights failed to load. You can retry below.
                                    </p>
                                )}
                                <Button
                                    onClick={generateAndDownloadReport}
                                    disabled={isGeneratingReport || isGeneratingGemini || !geminiReport}
                                    className="px-6 py-2"
                                    size="lg"
                                >
                                    {isGeneratingReport ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generating Report...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="mr-2 h-4 w-4" />
                                            {reportGenerated ? 'Download PDF Report Again' : 'Download PDF Report'}
                                        </>
                                    )}
                                </Button>
                                {reportGenerated && (
                                    <p className="mt-2 text-xs text-green-700 dark:text-green-300">
                                        Report downloaded successfully.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Analysis Grid */}
                    <div className="grid lg:grid-cols-2 gap-8">

                        {/* Left Column - House Characteristics */}
                        <div className="space-y-6">
                            {/* House Structure Overview */}
                            <Card className="border-blue-200 dark:border-blue-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
                                        <Home className="mr-2 h-6 w-6" />
                                        House Characteristics
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="text-2xl mb-1">🚪</div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Door Present</div>
                                            <Badge variant={analysisResult.door_present ? "default" : "destructive"} className="text-xs">
                                                {analysisResult.door_present ? 'Yes' : 'No'}
                                            </Badge>
                                        </div>
                                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="text-2xl mb-1">🪟</div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Windows</div>
                                            <Badge variant="outline" className="text-xs">{analysisResult.window_count}</Badge>
                                        </div>
                                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="text-2xl mb-1">🏠</div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Chimney</div>
                                            <Badge variant={analysisResult.chimney_present ? "default" : "secondary"} className="text-xs">
                                                {analysisResult.chimney_present ? 'Present' : 'Absent'}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Features Analysis */}
                            <Card className="border-green-200 dark:border-green-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-green-800 dark:text-green-200">
                                        <Eye className="mr-2 h-6 w-6" />
                                        Detected Features
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="flex flex-wrap gap-2">
                                            {analysisResult.detected_features.map((feature) => (
                                                <Badge key={feature} className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                    ✓ {feature}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {analysisResult.missing_features.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold mb-3 text-red-700 dark:text-red-300">Missing Features</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {analysisResult.missing_features.map((feature) => (
                                                    <Badge key={feature} className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                                        ✗ {feature}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Psychological Assessment */}
                        <div className="space-y-6">
                            {/* Psychological Indicators */}
                            <div className="space-y-4">
                                {/* Positive Indicators */}
                                <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center text-green-800 dark:text-green-200 text-lg">
                                            <Shield className="mr-2 h-5 w-5" />
                                            Positive Indicators ({analysisResult.positive_indicators.length})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {analysisResult.positive_indicators.length > 0 ? (
                                            <ul className="space-y-2">
                                                {analysisResult.positive_indicators.map((indicator, index) => (
                                                    <li key={index} className="flex items-start text-sm text-green-700 dark:text-green-300">
                                                        <TrendingUp className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                                                        {indicator}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 italic">No significant positive indicators identified</p>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Areas for Attention */}
                                {analysisResult.risk_factors.length > 0 && (
                                    <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="flex items-center text-yellow-800 dark:text-yellow-200 text-lg">
                                                <AlertTriangle className="mr-2 h-5 w-5" />
                                                Areas for Attention ({analysisResult.risk_factors.length})
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2">
                                                {analysisResult.risk_factors.map((factor, index) => (
                                                    <li key={index} className="flex items-start text-sm text-yellow-700 dark:text-yellow-300">
                                                        <Target className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                                                        {factor}
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            {/* AI Psychological Interpretation */}
                            <Card className="border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-purple-800 dark:text-purple-200">
                                        <Brain className="mr-2 h-6 w-6" />
                                        AI Psychological Interpretation
                                    </CardTitle>
                                    <CardDescription className="text-sm text-purple-700 dark:text-purple-300">
                                        {isGeneratingGemini
                                            ? 'Generating detailed psychological report with Gemini...'
                                            : geminiReport
                                                ? 'Insights generated by Gemini 2.5 Flash Lite'
                                                : geminiError
                                                    ? 'AI insights unavailable. Showing fallback interpretation.'
                                                    : 'AI insights not available yet.'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {isGeneratingGemini ? (
                                        <div className="flex items-center justify-center space-x-3 py-8 text-purple-700 dark:text-purple-200">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span className="text-sm font-medium">Preparing AI-driven psychological interpretation...</span>
                                        </div>
                                    ) : geminiReport ? (
                                        <div className="space-y-5">
                                            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700">
                                                <h2 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                                                    {geminiReport.title}
                                                </h2>
                                            </div>
                                            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700">
                                                <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2">Executive Summary</h3>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                                    {geminiReport.summary}
                                                </p>
                                            </div>
                                            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700">
                                                <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-3">Detailed Analysis</h3>
                                                <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                                                    {renderParagraphs(geminiReport.detailedAnalysis)}
                                                </div>
                                            </div>
                                            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700">
                                                <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-3">Recommendations</h3>
                                                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                                    {geminiReport.recommendations.map((rec, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <span className="mt-1 mr-2 text-purple-500 dark:text-purple-300">•</span>
                                                            <span>{rec}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="p-4 bg-purple-100/60 dark:bg-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-700">
                                                <h4 className="text-xs font-semibold text-purple-800 dark:text-purple-200 uppercase tracking-wide mb-1">Disclaimer</h4>
                                                <p className="text-xs text-purple-700 dark:text-purple-300 leading-relaxed">
                                                    {geminiReport.disclaimers}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {geminiError && (
                                                <div className="flex items-start space-x-2 text-sm text-red-600 dark:text-red-400">
                                                    <AlertCircle className="h-4 w-4 mt-0.5" />
                                                    <span>{geminiError}</span>
                                                </div>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleRetryGemini}
                                                className="inline-flex items-center"
                                                disabled={!analysisResult}
                                            >
                                                <RefreshCw className="mr-2 h-4 w-4" />
                                                Retry AI Insights
                                            </Button>
                                            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700">
                                                <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2">Latest Interpretation</h3>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                                    {analysisResult.psychological_interpretation}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Additional Insights */}
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700">
                        <CardHeader>
                            <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
                                <Heart className="mr-2 h-6 w-6" />
                                Analysis Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{analysisResult.detected_features.length}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Features Detected</div>
                                </div>
                                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{analysisResult.positive_indicators.length}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Positive Indicators</div>
                                </div>
                                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-600">{analysisResult.risk_factors.length}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Areas of Attention</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}