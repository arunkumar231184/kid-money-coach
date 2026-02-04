import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Coins, ArrowLeft, Users } from "lucide-react";

export default function LoginSelect() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5 flex flex-col">
      {/* Header */}
      <div className="p-4">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-soft group-hover:shadow-card transition-shadow">
                <Coins className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-2xl text-foreground">
                YouthMentor
              </span>
            </Link>
          </div>
          
          {/* Selection card */}
          <Card className="p-6 md:p-8 shadow-card border-2">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Welcome back!
              </h1>
              <p className="text-muted-foreground">
                Choose how you'd like to log in
              </p>
            </div>
            
            {/* Parent Login */}
            <Link to="/auth" className="block">
              <Card className="p-6 border-2 hover:border-primary hover:shadow-card transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      Log In
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Access your family dashboard
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/auth" className="text-primary font-medium hover:underline">
                  Sign up as a parent
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
