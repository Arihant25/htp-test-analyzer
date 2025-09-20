import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Brain,
    ArrowLeft,
    Download,
    Share,
    CheckCircle,
    AlertTriangle,
    Info,
    Home,
    Palette,
    Square,
    Eye,
    Heart,
    Users,
    Clock,
    Shield,
    Target,
    TrendingUp
} from "lucide-react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
    title: "Sample HTP Analysis Report - See How Our AI Works",
    description: "Explore a detailed sample analysis of a child's house drawing. See how our AI identifies 250+ characteristics and generates comprehensive psychological assessment reports in under 5 seconds.",
    keywords: [
        "HTP analysis sample",
        "house drawing analysis example",
        "psychological assessment demo",
        "AI drawing analysis",
        "children's art interpretation",
        "sample psychological report",
        "HTP test example",
        "drawing assessment demo"
    ],
    openGraph: {
        title: "Sample HTP Analysis Report - See How Our AI Works",
        description: "Explore a detailed sample analysis of a child's house drawing. See how our AI identifies 250+ characteristics and generates comprehensive psychological assessment reports.",
        url: '/sample-analysis',
        images: [
            {
                url: '/sample-analysis-og.jpg',
                width: 1200,
                height: 630,
                alt: 'Sample HTP Analysis Report - AI-Powered Psychological Assessment',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Sample HTP Analysis Report - See How Our AI Works",
        description: "Explore a detailed sample analysis of a child's house drawing. See how our AI identifies 250+ characteristics and generates comprehensive psychological assessment reports.",
        images: ['/sample-analysis-og.jpg'],
    },
};

export default function SampleAnalysis() {
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
                            Analysis completed in 2 seconds
                        </Badge>
                        <Badge variant="secondary" className="px-3 py-1">
                            <Eye className="mr-1 h-4 w-4" />
                            254 characteristics analyzed
                        </Badge>
                        <Badge variant="secondary" className="px-3 py-1">
                            <Brain className="mr-1 h-4 w-4" />
                            AI Confidence: 94%
                        </Badge>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 pb-16">
                <div className="max-w-6xl mx-auto">
                    {/* Header with Overall Results */}
                    <Card className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 border-0 shadow-lg mb-8">
                        <CardHeader className="text-center pb-4">
                            <CardTitle className="flex items-center justify-center text-2xl">
                                <CheckCircle className="mr-3 h-8 w-8 text-green-600" />
                                Analysis Complete
                            </CardTitle>
                            <CardDescription className="text-lg">
                                <Clock className="inline mr-2 h-4 w-4" />
                                Analysis completed in 1.52 seconds
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="mb-6">
                                <div className="text-6xl font-bold text-orange-600 mb-2">
                                    49.1%
                                </div>
                                <div className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                                    Overall Analysis Confidence
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Analysis Grid */}
                    <div className="grid lg:grid-cols-2 gap-8">

                        {/* Left Column - House Characteristics */}
                        <div className="space-y-6">
                            {/* Sample Drawing */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Home className="mr-2 h-5 w-5" />
                                        Original Drawing
                                    </CardTitle>
                                    <CardDescription>
                                        House drawing by Emma, age 8
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
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline">
                                            <Download className="mr-2 h-4 w-4" />
                                            Download Report
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            <Share className="mr-2 h-4 w-4" />
                                            Share
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

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
                                            <Badge variant="destructive" className="text-xs">No</Badge>
                                        </div>
                                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="text-2xl mb-1">🪟</div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Windows</div>
                                            <Badge variant="outline" className="text-xs">1</Badge>
                                        </div>
                                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="text-2xl mb-1">🏠</div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Chimney</div>
                                            <Badge variant="secondary" className="text-xs">Absent</Badge>
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
                                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                ✓ wall
                                            </Badge>
                                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                ✓ window
                                            </Badge>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-3 text-red-700 dark:text-red-300">Missing Features</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                                ✗ chimney
                                            </Badge>
                                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                                ✗ door
                                            </Badge>
                                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                                ✗ house
                                            </Badge>
                                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                                ✗ roof
                                            </Badge>
                                        </div>
                                    </div>
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
                                            Positive Indicators (0)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">No significant positive indicators identified</p>
                                    </CardContent>
                                </Card>

                                {/* Areas for Attention */}
                                <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center text-yellow-800 dark:text-yellow-200 text-lg">
                                            <AlertTriangle className="mr-2 h-5 w-5" />
                                            Areas for Attention (3)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            <li className="flex items-start text-sm text-yellow-700 dark:text-yellow-300">
                                                <Target className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                                                lack of emotional warmth
                                            </li>
                                            <li className="flex items-start text-sm text-yellow-700 dark:text-yellow-300">
                                                <Target className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                                                social difficulties
                                            </li>
                                            <li className="flex items-start text-sm text-yellow-700 dark:text-yellow-300">
                                                <Target className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                                                isolation
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Psychological Interpretation */}
                            <Card className="border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-purple-800 dark:text-purple-200">
                                        <Brain className="mr-2 h-6 w-6" />
                                        Psychological Interpretation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                            Door Missing: insecurity, difficulty connecting with others; Chimney Missing: lack of warmth in home environment
                                        </p>
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
                                        <span className="text-gray-600 dark:text-gray-400">Child's Age:</span>
                                        <span className="font-medium">8 years old</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Drawing Medium:</span>
                                        <span className="font-medium">Colored pencils</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Paper Size:</span>
                                        <span className="font-medium">A4 (8.5" × 11")</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Drawing Time:</span>
                                        <span className="font-medium">~15 minutes</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Submission Date:</span>
                                        <span className="font-medium">September 20, 2025</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Additional Insights */}
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700 mt-8">
                        <CardHeader>
                            <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
                                <Heart className="mr-2 h-6 w-6" />
                                Analysis Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">2</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Features Detected</div>
                                </div>
                                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">0</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Positive Indicators</div>
                                </div>
                                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-600">3</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Areas of Attention</div>
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
