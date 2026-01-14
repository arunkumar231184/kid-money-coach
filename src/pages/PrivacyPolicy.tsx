import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-display font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">Last updated: January 2026</p>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">1. Introduction</h2>
            <p className="text-muted-foreground">
              Welcome to YouthMentor. We are committed to protecting your personal information and your right to privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">2. Information We Collect</h2>
            <p className="text-muted-foreground">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Account information (name, email address, password)</li>
              <li>Profile information for children (name, age)</li>
              <li>Financial data (transaction history, savings goals, allowance information)</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">3. How We Use Your Information</h2>
            <p className="text-muted-foreground">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Generate insights and educational content for financial literacy</li>
              <li>Monitor and analyze trends, usage, and activities</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">4. Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our service is designed for families with children. We take extra precautions to protect children's data. 
              All child accounts are managed by parents, and we require parental consent before collecting any information from children under 16.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">5. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational security measures to protect your personal information. 
              All data is encrypted in transit and at rest, and we regularly review our security practices.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">6. Your Rights</h2>
            <p className="text-muted-foreground">You have the right to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">7. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us at privacy@youthmentor.com.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
