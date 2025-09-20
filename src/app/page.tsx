import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, Brain, Clock, Users, Shield, ChartBar, Heart, Target, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-orange-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">HTP Analyzer</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="https://github.com/Arihant25/htp-test-analyzer">
              <Button variant="outline">GitHub</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Revolutionizing <span className="text-orange-600">House-Tree-Person</span> Test Analysis
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Transform subjective psychological assessments into objective, standardized reports.
            Analyze children's house drawings with AI-powered precision, reducing interpretation time
            and increasing diagnostic accuracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-3">
              <Upload className="mr-2 h-5 w-5" />
              Analyze Drawing Now
            </Button>
            <Link href="/sample-analysis">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                View Sample Analysis
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            No account required • Completely free • Privacy-focused
          </p>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            The Challenge with Traditional HTP Testing
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Target className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <CardTitle>Subjective Interpretation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Manual analysis leads to inconsistent results between practitioners,
                  making it unreliable for early screening.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <CardTitle>Time-Intensive Process</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Analyzing 250+ characteristics per drawing requires extensive
                  experience and significant time investment.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <CardTitle>Parent & Child Barriers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Stigma and lack of transparency make parents hesitant,
                  while children may feel judged during assessment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-white dark:bg-gray-800 rounded-lg mx-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How Our AI-Powered Solution Helps
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <ChartBar className="h-16 w-16 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Objective Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Standardized interpretation of 250+ house characteristics using consistent,
                evidence-based criteria.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Clock className="h-16 w-16 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Time Reduction</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Cut analysis time by 50-75%, allowing psychologists to help
                nearly double the number of children.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="h-16 w-16 text-orange-700 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Privacy & Trust</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Transparent, non-judgmental process that builds trust with
                parents and reduces child anxiety.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Brain className="h-16 w-16 text-orange-800 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Early Detection</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Identify learning difficulties, emotional conflicts, and
                behavioral patterns with greater accuracy.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Users className="h-16 w-16 text-orange-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Free and open-source tool makes professional-grade analysis
                accessible to all practitioners.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Star className="h-16 w-16 text-orange-300 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Standardization</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Reduces variability between practitioners and provides
                consistent diagnostic support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Built for Everyone in the Assessment Process
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Heart className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>For Children</CardTitle>
                <CardDescription>Making assessment less intimidating</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Non-judgmental analysis process</li>
                  <li>• Reduced test anxiety</li>
                  <li>• Faster identification of support needs</li>
                  <li>• Focus on strengths and growth areas</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Brain className="h-12 w-12 text-orange-500 mb-4" />
                <CardTitle>For Psychologists</CardTitle>
                <CardDescription>Professional diagnostic support</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Standardized interpretation guidelines</li>
                  <li>• Significant time savings</li>
                  <li>• Consistent results across practitioners</li>
                  <li>• Enhanced diagnostic confidence</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-orange-700 mb-4" />
                <CardTitle>For Parents</CardTitle>
                <CardDescription>Transparent and trustworthy</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Clear, understandable reports</li>
                  <li>• Reduced stigma and judgment</li>
                  <li>• Evidence-based recommendations</li>
                  <li>• Supportive approach to child development</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Transform Your HTP Analysis?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Start analyzing house drawings with our AI-powered tool. No setup required,
            completely free, and privacy-focused.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-4">
              <Upload className="mr-2 h-5 w-5" />
              Upload House Drawing
            </Button>
            <Link href="/sample-analysis">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                View Sample Analysis
              </Button>
            </Link>
          </div>
          <Separator className="my-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-orange-600">250+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Characteristics Analyzed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-500">75%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Time Reduction</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-700">Free</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Always & Forever</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-800">Open</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Source & Transparent</div>
            </div>
          </div>
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
            <a href="#" className="hover:text-orange-600">About</a>
            <a href="/privacy" className="hover:text-orange-600">Privacy</a>
            <a href="https://github.com/Arihant25/htp-test-analyzer" className="hover:text-orange-600">GitHub</a>
            <a href="#" className="hover:text-orange-600">Contact</a>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          © 2025 HTP Analyzer. Free & Open Source Psychology Assessment Tool.
        </div>
      </footer>
    </div>
  );
}
