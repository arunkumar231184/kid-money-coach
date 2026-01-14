import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-display font-bold text-foreground mb-8">Terms of Service</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">Last updated: January 2026</p>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using YouthMentor, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
              If you do not agree with any of these terms, you are prohibited from using or accessing this service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">2. Description of Service</h2>
            <p className="text-muted-foreground">
              YouthMentor is a financial education platform designed to help parents teach their children about money management. 
              The service includes features such as spending tracking, savings goals, challenges, and educational content.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">3. User Accounts</h2>
            <p className="text-muted-foreground">To use our service, you must:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Be at least 18 years old to create a parent account</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">4. Parental Responsibilities</h2>
            <p className="text-muted-foreground">
              As a parent using YouthMentor, you are responsible for supervising your children's use of the service, 
              ensuring the accuracy of information entered about your children, and managing your children's financial education journey.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">5. Prohibited Activities</h2>
            <p className="text-muted-foreground">You agree not to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the service</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Share your account credentials with others</li>
              <li>Upload malicious code or content</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">6. Intellectual Property</h2>
            <p className="text-muted-foreground">
              The service and its original content, features, and functionality are owned by YouthMentor and are protected by 
              international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">7. Disclaimer</h2>
            <p className="text-muted-foreground">
              YouthMentor is provided for educational purposes only and does not constitute financial advice. 
              We are not responsible for any financial decisions made based on information provided through the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">8. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              In no event shall YouthMentor be liable for any indirect, incidental, special, consequential, or punitive damages 
              resulting from your use of or inability to use the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">9. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">10. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about these Terms of Service, please contact us at legal@youthmentor.com.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
