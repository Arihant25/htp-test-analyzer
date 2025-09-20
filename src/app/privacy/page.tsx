import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Shield, Server, Trash2, Lock, Eye } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
    title: "Privacy Policy - HTP Analyzer Data Protection",
    description: "Learn about our privacy-first approach. We don't store your data permanently - all uploads are automatically deleted after analysis. Complete transparency and security for psychological assessments.",
    keywords: [
        "privacy policy",
        "data protection",
        "psychological assessment privacy",
        "HTP test privacy",
        "no data storage",
        "privacy-focused AI",
        "secure psychological analysis",
        "data deletion policy"
    ],
    openGraph: {
        title: "Privacy Policy - HTP Analyzer Data Protection",
        description: "Learn about our privacy-first approach. We don't store your data permanently - all uploads are automatically deleted after analysis.",
        url: '/privacy',
        images: [
            {
                url: '/privacy-og.jpg',
                width: 1200,
                height: 630,
                alt: 'HTP Analyzer Privacy Policy - Your Data Protection Matters',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Privacy Policy - HTP Analyzer Data Protection",
        description: "Learn about our privacy-first approach. We don't store your data permanently - all uploads are automatically deleted after analysis.",
        images: ['/privacy-og.jpg'],
    },
};

export default function Privacy() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
            {/* Header */}
            <Navbar
                rightContent={
                    <Link href="/">
                        <Button variant="outline">Back to Home</Button>
                    </Link>
                }
            />

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-4xl mx-auto">
                    <Shield className="h-16 w-16 text-orange-600 mx-auto mb-6" />
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        Privacy <span className="text-orange-600">Policy</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        Your privacy is our top priority. We've designed HTP Analyzer with privacy-first principles
                        to ensure your sensitive data remains secure and protected.
                    </p>
                </div>
            </section>

            {/* Main Privacy Content */}
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">

                    {/* Data Storage Policy */}
                    <Card className="mb-8">
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <Server className="h-8 w-8 text-orange-600" />
                                <div>
                                    <CardTitle className="text-2xl">Data Storage Policy</CardTitle>
                                    <CardDescription>How we handle your uploaded drawings and analysis data</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-3">
                                    🔒 No Permanent Data Storage
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    <strong>We do not store any of your data on our servers permanently.</strong> When you upload a house drawing
                                    for analysis, the image and generated report are only kept in memory during the processing phase and are
                                    immediately deleted once the analysis is complete and delivered to you.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex items-start space-x-3">
                                    <Trash2 className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Automatic Deletion</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            All uploaded images and analysis results are automatically deleted from our servers
                                            within minutes of processing completion.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Lock className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Encrypted Processing</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            During the brief processing period, all data is encrypted in transit and
                                            processed in secure, isolated environments.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* What We Collect */}
                    <Card className="mb-8">
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <Eye className="h-8 w-8 text-orange-600" />
                                <div>
                                    <CardTitle className="text-2xl">What We Process</CardTitle>
                                    <CardDescription>Information that temporarily passes through our system</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="border-l-4 border-orange-500 pl-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Drawing Images</h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        The house drawings you upload for analysis. These are processed by our AI model
                                        to identify the 250+ characteristics used in HTP assessment.
                                    </p>
                                </div>

                                <div className="border-l-4 border-orange-500 pl-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Analysis Results</h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        The generated psychological assessment report containing identified patterns,
                                        characteristics, and interpretative insights.
                                    </p>
                                </div>

                                <div className="border-l-4 border-orange-500 pl-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Technical Data</h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Basic technical information like IP addresses and browser types, used only for
                                        system security and performance monitoring. This data is not linked to your uploads.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Your Rights */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="text-2xl">Your Privacy Rights</CardTitle>
                            <CardDescription>What you can expect from our privacy practices</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">✅ No Account Required</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Use our service completely anonymously without creating an account or providing personal information.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">✅ No Tracking</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        We don't use cookies, analytics, or tracking technologies to monitor your behavior.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">✅ Open Source</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Our code is open source, allowing you to verify our privacy practices and data handling.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">✅ No Data Sharing</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        We never share, sell, or transfer your data to third parties since we don't store it.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Measures */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="text-2xl">Security Measures</CardTitle>
                            <CardDescription>How we protect your data during processing</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🔐 End-to-End Encryption</h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        All data is encrypted during transmission using industry-standard TLS encryption.
                                    </p>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🛡️ Secure Processing</h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Analysis is performed in isolated, secure environments with automatic data purging.
                                    </p>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">⚡ Minimal Retention</h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Data exists on our servers for the shortest time possible - typically under 60 seconds.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Questions About Privacy?</CardTitle>
                            <CardDescription>We're here to address any privacy concerns</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                If you have any questions about this privacy policy or our data practices,
                                please feel free to reach out to us through our GitHub repository or contact channels.
                            </p>
                            <div className="flex space-x-4">
                                <Button className="bg-orange-600 hover:bg-orange-700">
                                    View on GitHub
                                </Button>
                                <Button variant="outline">
                                    Contact Us
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </section>

            {/* Footer */}
            <footer className="container mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-700 mt-16">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <Brain className="h-6 w-6 text-orange-600" />
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">HTP Analyzer</span>
                    </div>
                    <div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-400">
                        <Link href="/" className="hover:text-orange-600">Home</Link>
                        <Link href="#" className="hover:text-orange-600">About</Link>
                        <Link href="#" className="hover:text-orange-600">GitHub</Link>
                        <Link href="#" className="hover:text-orange-600">Contact</Link>
                    </div>
                </div>
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                    © 2025 HTP Analyzer. Free & Open Source Psychology Assessment Tool.
                </div>
            </footer>
        </div>
    );
}