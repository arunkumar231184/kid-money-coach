import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Coins, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  showAuth?: boolean;
  className?: string;
}

export function Navbar({ showAuth = true, className }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <nav className={cn("w-full py-4 px-4 md:px-6", className)}>
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-soft group-hover:shadow-card transition-shadow">
            <Coins className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            YouthMentor
          </span>
        </Link>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link to="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link to="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
        </div>
        
        {/* Auth buttons */}
        {showAuth && (
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
            <Button size="sm">
              Get Started
            </Button>
          </div>
        )}
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border p-4 animate-fade-in z-50">
          <div className="flex flex-col gap-4">
            <Link to="#features" className="text-sm font-medium text-foreground py-2">
              Features
            </Link>
            <Link to="#pricing" className="text-sm font-medium text-foreground py-2">
              Pricing
            </Link>
            <Link to="#about" className="text-sm font-medium text-foreground py-2">
              About
            </Link>
            {showAuth && (
              <>
                <hr className="border-border" />
                <Button variant="outline" className="w-full">Log in</Button>
                <Button className="w-full">Get Started</Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
