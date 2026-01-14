import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-display font-bold text-foreground mb-8">Cookie Policy</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">Last updated: January 2026</p>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">1. What Are Cookies?</h2>
            <p className="text-muted-foreground">
              Cookies are small text files that are stored on your device when you visit a website. 
              They help websites remember your preferences and improve your browsing experience.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">2. How We Use Cookies</h2>
            <p className="text-muted-foreground">YouthMentor uses cookies to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Keep you signed in to your account</li>
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our service</li>
              <li>Improve our service based on usage patterns</li>
              <li>Ensure the security of your account</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">3. Types of Cookies We Use</h2>
            
            <div className="space-y-3">
              <h3 className="text-xl font-medium text-foreground">Essential Cookies</h3>
              <p className="text-muted-foreground">
                These cookies are necessary for the website to function properly. They enable core functionality such as security, 
                network management, and account access. You cannot opt out of these cookies.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-medium text-foreground">Performance Cookies</h3>
              <p className="text-muted-foreground">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. 
                This helps us improve our service.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-medium text-foreground">Functionality Cookies</h3>
              <p className="text-muted-foreground">
                These cookies enable enhanced functionality and personalization, such as remembering your preferences 
                and providing features you have requested.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">4. Third-Party Cookies</h2>
            <p className="text-muted-foreground">
              We may use third-party services that place cookies on your device. These services help us with analytics 
              and improving our service. Third-party cookies are subject to their respective privacy policies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">5. Managing Cookies</h2>
            <p className="text-muted-foreground">
              Most web browsers allow you to control cookies through their settings. You can typically:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>View cookies stored on your device</li>
              <li>Delete all or specific cookies</li>
              <li>Block cookies from specific or all websites</li>
              <li>Set preferences for different types of cookies</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Please note that blocking essential cookies may affect the functionality of our service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">6. Cookie Retention</h2>
            <p className="text-muted-foreground">
              Session cookies are deleted when you close your browser. Persistent cookies remain on your device for a set period 
              or until you delete them. Authentication cookies typically expire after 30 days of inactivity.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">7. Updates to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">8. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about our use of cookies, please contact us at privacy@youthmentor.com.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
