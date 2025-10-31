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
                    <Card className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 border-2 border-green-200/50 dark:border-green-700/30 shadow-xl">
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
                                    Completed in {analysisResult.processing_time_seconds.toFixed(2)} seconds
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="mb-6 relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 opacity-20 blur-3xl rounded-full"></div>
                                <div className="relative">
                                    <div className="text-7xl font-black bg-gradient-to-br from-orange-500 via-orange-600 to-pink-600 bg-clip-text text-transparent mb-3 tracking-tight">
                                        {(analysisResult.overall_confidence_score * 100).toFixed(1)}%
                                    </div>
                                    <div className="text-xl text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                        Overall Analysis Confidence
                                    </div>
                                    <div className="w-48 h-2 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-orange-500 to-pink-600 rounded-full transition-all duration-1000"
                                            style={{ width: `${analysisResult.overall_confidence_score * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Report Generation Section */}
                            <div className="mt-8 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                                <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 bg-white/60 dark:bg-gray-800/60 rounded-full">
                                    {isGeneratingGemini ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Preparing AI insights...</span>
                                        </>
                                    ) : geminiReport ? (
                                        <>
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <span className="text-sm font-medium text-green-700 dark:text-green-300">AI insights ready</span>
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                                            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">AI insights pending</span>
                                        </>
                                    )}
                                </div>
                                <Button
                                    onClick={generateAndDownloadReport}
                                    disabled={isGeneratingReport || isGeneratingGemini || !geminiReport}
                                    className="px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
                                    size="lg"
                                >
                                    {isGeneratingReport ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Generating Report...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="mr-2 h-5 w-5" />
                                            {reportGenerated ? 'Download PDF Report Again' : 'Download PDF Report'}
                                        </>
                                    )}
                                </Button>
                                {reportGenerated && (
                                    <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                            Report downloaded successfully!
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Analysis - Full Width Rows */}
                    <div className="space-y-8">
                        {/* Row 1: House Characteristics */}
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
                                {/* Size Characteristics - Prominent Display */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center">
                                        <Home className="mr-2 h-4 w-4" />
                                        House Size Characteristics
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                                            <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">Size Category</div>
                                            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 capitalize mb-1">
                                                {analysisResult.house_size_category}
                                            </div>
                                            <Badge
                                                variant={
                                                    analysisResult.house_size_category === 'small' ? 'destructive' :
                                                        analysisResult.house_size_category === 'large' ? 'destructive' :
                                                            'default'
                                                }
                                                className="text-xs font-semibold"
                                            >
                                                {analysisResult.house_size_category === 'small' && 'May indicate withdrawal'}
                                                {analysisResult.house_size_category === 'large' && 'May indicate hostility'}
                                                {analysisResult.house_size_category === 'normal' && 'Healthy size perception'}
                                            </Badge>
                                        </div>
                                        <div className="p-4 bg-gradient-to-br from-purple-100/50 to-pink-100/50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg border-2 border-purple-200 dark:border-purple-700">
                                            <div className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-2">Area Ratio</div>
                                            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-1">
                                                {(analysisResult.house_area_ratio * 100).toFixed(1)}%
                                            </div>
                                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${analysisResult.house_area_ratio < 0.1 ? 'bg-gradient-to-r from-red-400 to-red-600' :
                                                        analysisResult.house_area_ratio > 0.6 ? 'bg-gradient-to-r from-orange-400 to-red-600' :
                                                            'bg-gradient-to-r from-green-400 to-blue-600'
                                                        }`}
                                                    style={{ width: `${Math.min(analysisResult.house_area_ratio * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                                                {analysisResult.house_placement.length > 0 && `Placement: ${analysisResult.house_placement.join(', ')}`}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Structural Elements */}
                                <div>
                                    <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Structural Elements
                                    </h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                                            <div className="text-3xl mb-2 drop-shadow-md">🚪</div>
                                            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Door Present</div>
                                            <Badge variant={analysisResult.door_present ? "default" : "destructive"} className="text-xs font-semibold shadow-sm">
                                                {analysisResult.door_present ? 'Yes' : 'No'}
                                            </Badge>
                                        </div>
                                        <div className="text-center p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                                            <div className="text-3xl mb-2 drop-shadow-md">🪟</div>
                                            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Windows</div>
                                            <Badge variant="outline" className="text-xs font-semibold shadow-sm">{analysisResult.window_count}</Badge>
                                        </div>
                                        <div className="text-center p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                                            <div className="text-3xl mb-2 drop-shadow-md">🏠</div>
                                            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Chimney</div>
                                            <Badge variant={analysisResult.chimney_present ? "default" : "secondary"} className="text-xs font-semibold shadow-sm">
                                                {analysisResult.chimney_present ? 'Present' : 'Absent'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Size Analysis */}
                                <div className="mt-6">
                                    <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center">
                                        <Target className="mr-2 h-4 w-4" />
                                        Detailed Size Analysis
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Door Details */}
                                        {analysisResult.door_characteristics && (
                                            <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                                                <div className="flex items-center mb-2">
                                                    <span className="text-2xl mr-2">🚪</span>
                                                    <h5 className="font-semibold text-amber-900 dark:text-amber-100">Door Characteristics</h5>
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-amber-700 dark:text-amber-300">Size:</span>
                                                        <Badge
                                                            variant={
                                                                analysisResult.door_characteristics.size_category === 'tiny' ? 'destructive' :
                                                                    analysisResult.door_characteristics.size_category === 'large' ? 'destructive' :
                                                                        'default'
                                                            }
                                                            className="capitalize"
                                                        >
                                                            {analysisResult.door_characteristics.size_category}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-amber-700 dark:text-amber-300">Position:</span>
                                                        <Badge variant="outline" className="capitalize">
                                                            {analysisResult.door_characteristics.position}
                                                        </Badge>
                                                    </div>
                                                    {analysisResult.door_characteristics.size_category === 'tiny' && (
                                                        <p className="text-xs text-red-600 dark:text-red-400 mt-2 italic">
                                                            ⚠️ Tiny doors may indicate fearfulness or withdrawal
                                                        </p>
                                                    )}
                                                    {analysisResult.door_characteristics.size_category === 'large' && (
                                                        <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 italic">
                                                            ⚠️ Large doors may indicate dependency needs
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Window Details */}
                                        {analysisResult.window_characteristics && (
                                            <div className="p-4 bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 rounded-lg border border-sky-200 dark:border-sky-800">
                                                <div className="flex items-center mb-2">
                                                    <span className="text-2xl mr-2">🪟</span>
                                                    <h5 className="font-semibold text-sky-900 dark:text-sky-100">Window Characteristics</h5>
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sky-700 dark:text-sky-300">Count:</span>
                                                        <Badge variant="outline">{analysisResult.window_characteristics.count}</Badge>
                                                    </div>
                                                    {analysisResult.window_characteristics.interpretation &&
                                                        analysisResult.window_characteristics.interpretation.length > 0 && (
                                                            <div className="mt-2">
                                                                {analysisResult.window_characteristics.interpretation.map((interp, idx) => (
                                                                    <p key={idx} className="text-xs text-sky-700 dark:text-sky-300 italic">
                                                                        {interp}
                                                                    </p>
                                                                ))}
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Chimney Details */}
                                        {analysisResult.chimney_characteristics && analysisResult.chimney_characteristics.present && (
                                            <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-lg border border-rose-200 dark:border-rose-800">
                                                <div className="flex items-center mb-2">
                                                    <span className="text-2xl mr-2">🏠</span>
                                                    <h5 className="font-semibold text-rose-900 dark:text-rose-100">Chimney Characteristics</h5>
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-rose-700 dark:text-rose-300">Size:</span>
                                                        <Badge
                                                            variant={
                                                                analysisResult.chimney_characteristics.size === 'large' ||
                                                                    analysisResult.chimney_characteristics.size === 'small' ?
                                                                    'destructive' : 'default'
                                                            }
                                                            className="capitalize"
                                                        >
                                                            {analysisResult.chimney_characteristics.size}
                                                        </Badge>
                                                    </div>
                                                    {analysisResult.chimney_characteristics.size === 'large' && (
                                                        <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 italic">
                                                            ⚠️ Oversized chimney may indicate preoccupation with fantasy
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Roof Details */}
                                        {analysisResult.roof_characteristics && analysisResult.roof_characteristics.present && (
                                            <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg border border-violet-200 dark:border-violet-800">
                                                <div className="flex items-center mb-2">
                                                    <span className="text-2xl mr-2">🏘️</span>
                                                    <h5 className="font-semibold text-violet-900 dark:text-violet-100">Roof Characteristics</h5>
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-violet-700 dark:text-violet-300">Size:</span>
                                                        <Badge
                                                            variant={
                                                                analysisResult.roof_characteristics.size === 'large' ||
                                                                    analysisResult.roof_characteristics.size === 'small' ?
                                                                    'destructive' : 'default'
                                                            }
                                                            className="capitalize"
                                                        >
                                                            {analysisResult.roof_characteristics.size}
                                                        </Badge>
                                                    </div>
                                                    {analysisResult.roof_characteristics.size === 'large' && (
                                                        <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 italic">
                                                            ⚠️ Large roof may indicate excessive fantasy or intellectual preoccupation
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Row 2: Detected Features */}
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
                                        Present Features
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {analysisResult.detected_features.map((feature) => (
                                            <Badge key={feature} className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/40 dark:to-green-900/20 dark:text-green-300 border border-green-300 dark:border-green-700 px-3 py-1.5 text-sm font-semibold shadow-sm hover:shadow-md transition-shadow">
                                                <CheckCircle className="mr-1 h-3 w-3" /> {feature}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {analysisResult.missing_features.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-red-700 dark:text-red-300 mb-3 flex items-center">
                                            <X className="mr-2 h-4 w-4" />
                                            Missing Features
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {analysisResult.missing_features.map((feature) => (
                                                <Badge key={feature} className="bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/40 dark:to-red-900/20 dark:text-red-300 border border-red-300 dark:border-red-700 px-3 py-1.5 text-sm font-semibold shadow-sm hover:shadow-md transition-shadow">
                                                    <X className="mr-1 h-3 w-3" /> {feature}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Row 3: Psychological Indicators */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Positive Indicators */}
                            <Card className="border-2 border-green-200/60 dark:border-green-800/60 bg-gradient-to-br from-green-50/80 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/10 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center text-xl font-bold">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg mr-3">
                                            <Shield className="h-5 w-5 text-green-600" />
                                        </div>
                                        <span className="bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent">
                                            Positive Indicators ({analysisResult.positive_indicators.length})
                                        </span>
                                    </CardTitle>
                                    <CardDescription className="text-xs mt-1">
                                        Strengths identified in the drawing
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {analysisResult.positive_indicators.length > 0 ? (
                                        <ul className="space-y-3">
                                            {analysisResult.positive_indicators.map((indicator, index) => (
                                                <li key={index} className="flex items-start text-sm text-green-800 dark:text-green-300 bg-white/60 dark:bg-gray-800/40 p-3 rounded-lg border border-green-200 dark:border-green-800/50 shadow-sm hover:shadow-md transition-shadow">
                                                    <TrendingUp className="mr-2 h-5 w-5 mt-0.5 flex-shrink-0 text-green-600" />
                                                    <span className="font-medium">{indicator}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-center py-8 px-4 bg-white/60 dark:bg-gray-800/40 rounded-lg border border-green-200 dark:border-green-800/50">
                                            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">No significant positive indicators identified</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Areas for Attention */}
                            {analysisResult.risk_factors.length > 0 && (
                                <Card className="border-2 border-yellow-200/60 dark:border-yellow-800/60 bg-gradient-to-br from-yellow-50/80 to-orange-50/50 dark:from-yellow-900/20 dark:to-orange-900/10 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center text-xl font-bold">
                                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg mr-3">
                                                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                            </div>
                                            <span className="bg-gradient-to-r from-yellow-700 to-orange-700 bg-clip-text text-transparent">
                                                Areas for Attention ({analysisResult.risk_factors.length})
                                            </span>
                                        </CardTitle>
                                        <CardDescription className="text-xs mt-1">
                                            Concerns requiring consideration
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {analysisResult.risk_factors.map((factor, index) => (
                                                <li key={index} className="flex items-start text-sm text-yellow-800 dark:text-yellow-300 bg-white/60 dark:bg-gray-800/40 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800/50 shadow-sm hover:shadow-md transition-shadow">
                                                    <Target className="mr-2 h-5 w-5 mt-0.5 flex-shrink-0 text-yellow-600" />
                                                    <span className="font-medium">{factor}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Row 4: AI Psychological Interpretation - Full Width */}
                        <Card className="border-2 border-purple-200/60 dark:border-purple-800/60 bg-gradient-to-br from-purple-50/80 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/10 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center text-2xl font-bold">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg mr-3">
                                        <Brain className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <span className="bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                                        AI Psychological Interpretation
                                    </span>
                                </CardTitle>
                                <CardDescription className="text-sm text-purple-700 dark:text-purple-300 mt-1">
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

                    {/* Additional Insights */}
                    <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-2 border-blue-200/50 dark:border-blue-700/30 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center text-2xl font-bold">
                                <Heart className="mr-3 h-7 w-7 text-pink-600 drop-shadow-md" />
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Analysis Summary
                                </span>
                            </CardTitle>
                            <CardDescription className="text-base mt-1 text-gray-600 dark:text-gray-400">
                                Key metrics from your house drawing analysis
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
                                            {analysisResult.detected_features.length}
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
                                            {analysisResult.positive_indicators.length}
                                        </div>
                                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Positive Indicators</div>
                                        <div className="mt-2 h-1 w-16 mx-auto bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                    <div className="relative text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-yellow-100 dark:border-yellow-900/50">
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-3">
                                            <AlertTriangle className="h-6 w-6 text-yellow-600" />
                                        </div>
                                        <div className="text-4xl font-black bg-gradient-to-br from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
                                            {analysisResult.risk_factors.length}
                                        </div>
                                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Areas of Attention</div>
                                        <div className="mt-2 h-1 w-16 mx-auto bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}