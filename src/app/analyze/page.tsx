"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain } from "lucide-react";
import Navbar from "@/components/Navbar";
import UploadAnalyzer from "@/components/UploadAnalyzer";


export default function AnalyzePage() {
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
                <div className="max-w-4xl mx-auto text-center mb-8">
                    <Brain className="h-16 w-16 text-orange-600 mx-auto mb-6" />
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Analyze House Drawing
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                        Upload a house drawing and get a comprehensive psychological assessment report
                        powered by AI. Our analysis identifies 250+ characteristics and provides
                        professional-grade insights in under 5 seconds.
                    </p>

                    {/* Key Features */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8">
                        <div>
                            <div className="text-2xl font-bold text-orange-600">250+</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Characteristics</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-orange-500">~15s</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Analysis Time</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-orange-700">Free</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">No Cost</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-orange-800">Private</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">No Data Stored</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Upload and Analysis Component */}
            <section className="container mx-auto px-4 pb-16">
                <div className="max-w-4xl mx-auto">
                    <UploadAnalyzer />
                </div>
            </section>

            {/* Footer */}
            <footer className="container mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <Brain className="h-6 w-6 text-orange-600" />
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">HTP Analyzer</span>
                    </div>
                    <div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-400">
                        <Link href="/" className="hover:text-orange-600">Home</Link>
                        <Link href="/privacy" className="hover:text-orange-600">Privacy</Link>
                        <Link href="/sample-analysis" className="hover:text-orange-600">Sample Analysis</Link>
                        <a href="https://github.com/Arihant25/htp-test-analyzer" className="hover:text-orange-600">GitHub</a>
                    </div>
                </div>
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                    © 2025 HTP Analyzer. Free & Open Source Psychology Assessment Tool.
                </div>
            </footer>
        </div>
    );
}