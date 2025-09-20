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
    Clock
} from "lucide-react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
    title: "Sample HTP Analysis Report - See How Our AI Works",
    description: "Explore a detailed sample analysis of a child's house drawing. See how our AI identifies 250+ characteristics and generates comprehensive psychological assessment reports in under 15 seconds.",
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
                            Analysis completed in 12 seconds
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
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Drawing and Basic Info */}
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

                    {/* Right Column - Analysis Results */}
                    <div className="space-y-6">
                        {/* Overall Assessment */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                                    Overall Assessment
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Positive Indicators</h4>
                                        <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                                            <li>• Strong sense of security and belonging</li>
                                            <li>• Appropriate developmental progression</li>
                                            <li>• Healthy family attachment indicators</li>
                                            <li>• Good attention to detail and planning</li>
                                        </ul>
                                    </div>
                                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Areas for Attention</h4>
                                        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                                            <li>• Slight anxiety indicators in roof structure</li>
                                            <li>• Could benefit from confidence-building activities</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Detailed Analysis Categories */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Detailed Analysis</CardTitle>
                                <CardDescription>
                                    Breakdown of key characteristics and their interpretations
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* House Structure */}
                                <div>
                                    <h4 className="font-semibold mb-3 flex items-center">
                                        <Square className="mr-2 h-4 w-4" />
                                        House Structure
                                    </h4>
                                    <div className="space-y-3 ml-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Size relative to page</span>
                                            <Badge variant="outline">Appropriate (65%)</Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Placement on page</span>
                                            <Badge variant="outline">Center-right</Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Foundation</span>
                                            <Badge className="bg-green-100 text-green-800">Strong & stable</Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Walls</span>
                                            <Badge className="bg-green-100 text-green-800">Well-proportioned</Badge>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Roof Analysis */}
                                <div>
                                    <h4 className="font-semibold mb-3 flex items-center">
                                        <Home className="mr-2 h-4 w-4" />
                                        Roof & Upper Elements
                                    </h4>
                                    <div className="space-y-3 ml-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Roof style</span>
                                            <Badge variant="outline">Traditional triangular</Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Roof size</span>
                                            <Badge className="bg-yellow-100 text-yellow-800">Slightly oversized</Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Chimney</span>
                                            <Badge className="bg-green-100 text-green-800">Present with smoke</Badge>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Doors and Windows */}
                                <div>
                                    <h4 className="font-semibold mb-3 flex items-center">
                                        <Eye className="mr-2 h-4 w-4" />
                                        Doors & Windows
                                    </h4>
                                    <div className="space-y-3 ml-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Front door</span>
                                            <Badge className="bg-green-100 text-green-800">Central, accessible</Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Windows</span>
                                            <Badge className="bg-green-100 text-green-800">4 windows, symmetrical</Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Window details</span>
                                            <Badge variant="outline">Curtains visible</Badge>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Environmental Elements */}
                                <div>
                                    <h4 className="font-semibold mb-3 flex items-center">
                                        <Palette className="mr-2 h-4 w-4" />
                                        Environmental Elements
                                    </h4>
                                    <div className="space-y-3 ml-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Ground line</span>
                                            <Badge className="bg-green-100 text-green-800">Present & stable</Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Trees/plants</span>
                                            <Badge className="bg-green-100 text-green-800">2 trees, healthy</Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Sky elements</span>
                                            <Badge variant="outline">Sun and clouds</Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Additional details</span>
                                            <Badge variant="outline">Flowers, pathway</Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Psychological Interpretation */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Heart className="mr-2 h-5 w-5 text-purple-600" />
                                    Psychological Interpretation
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Emotional State</h4>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        The drawing suggests a generally positive emotional state with strong feelings of security and belonging.
                                        The child appears to have a healthy relationship with their home environment.
                                    </p>
                                </div>
                                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                    <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Family Dynamics</h4>
                                    <p className="text-sm text-purple-700 dark:text-purple-300">
                                        Indicators suggest positive family relationships. The accessible door and well-placed windows
                                        indicate openness to social interaction and healthy communication patterns.
                                    </p>
                                </div>
                                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                                    <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">Developmental Markers</h4>
                                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                        Drawing complexity and attention to detail are appropriate for age 8. Shows good planning skills
                                        and spatial awareness. No concerning developmental delays indicated.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recommendations */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Users className="mr-2 h-5 w-5 text-orange-600" />
                                    Recommendations
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">For Parents:</h4>
                                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                                            <li>• Continue providing a stable, secure home environment</li>
                                            <li>• Encourage creative expression through art and drawing</li>
                                            <li>• Consider confidence-building activities to address minor anxiety indicators</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">For Educators:</h4>
                                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                                            <li>• Child shows good attention to detail - encourage detailed projects</li>
                                            <li>• No learning difficulties indicated at this time</li>
                                            <li>• Support social interaction opportunities</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Follow-up:</h4>
                                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                                            <li>• Routine follow-up in 6-12 months recommended</li>
                                            <li>• Monitor for any changes in drawing patterns</li>
                                            <li>• No immediate psychological intervention needed</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="max-w-4xl mx-auto mt-16 text-center">
                    <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
                        <CardContent className="pt-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Ready to Analyze Your Own House Drawing?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Upload a house drawing and get a comprehensive analysis report like this one in under 15 seconds.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" className="px-8">
                                    <Brain className="mr-2 h-5 w-5" />
                                    Start Your Analysis
                                </Button>
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