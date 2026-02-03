import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useKidAuth } from "@/contexts/KidAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Loader2, User, Lock, Delete, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ForgotPinDialog } from "@/components/ForgotPinDialog";

interface KidOption {
  id: string;
  name: string;
  avatar_url: string | null;
}

export default function KidLogin() {
  const navigate = useNavigate();
  const { loginWithPin, kidSession } = useKidAuth();
  const [kids, setKids] = useState<KidOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKid, setSelectedKid] = useState<KidOption | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [forgotPinOpen, setForgotPinOpen] = useState(false);

  // Redirect if already logged in as kid
  useEffect(() => {
    if (kidSession) {
      navigate(`/kid/${kidSession.kidId}`);
    }
  }, [kidSession, navigate]);

  // Fetch kids with PINs set
  useEffect(() => {
    async function fetchKids() {
      const { data, error } = await supabase
        .from("kids")
        .select("id, name, avatar_url")
        .not("pin_hash", "is", null);

      if (error) {
        console.error("Error fetching kids:", error);
      } else {
        setKids(data || []);
      }
      setLoading(false);
    }

    fetchKids();
  }, []);

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError("");

      // Auto-submit when 4 digits entered
      if (newPin.length === 4) {
        handleLogin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError("");
  };

  const handleLogin = async (pinValue: string) => {
    if (!selectedKid) return;

    setVerifying(true);
    const result = await loginWithPin(selectedKid.id, pinValue);
    setVerifying(false);

    if (result.success) {
      navigate(`/kid/${selectedKid.id}`);
    } else {
      setError(result.error || "Invalid PIN");
      setPin("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {!selectedKid ? (
        // Kid Selection Screen
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">👋 Welcome!</CardTitle>
            <CardDescription>Who's logging in today?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {kids.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No accounts set up yet.</p>
                <p className="text-sm mt-2">Ask your parent to set up a PIN for you!</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {kids.map((kid) => (
                  <Button
                    key={kid.id}
                    variant="outline"
                    className="h-auto p-4 justify-start gap-4 hover:bg-primary/5 hover:border-primary transition-all"
                    onClick={() => setSelectedKid(kid)}
                  >
                    <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                      <AvatarImage src={kid.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {kid.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-lg font-medium">{kid.name}</span>
                  </Button>
                ))}
              </div>
            )}

            <div className="pt-4 border-t">
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => navigate("/auth")}
              >
                <User className="h-4 w-4 mr-2" />
                Parent Login
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        // PIN Entry Screen
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-4"
              onClick={() => {
                setSelectedKid(null);
                setPin("");
                setError("");
              }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Avatar className="h-20 w-20 mx-auto mb-2 ring-4 ring-primary/20">
              <AvatarImage src={selectedKid.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {selectedKid.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">Hi, {selectedKid.name}!</CardTitle>
            <CardDescription>Enter your 4-digit PIN</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* PIN Dots */}
            <div className="flex justify-center gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "w-4 h-4 rounded-full transition-all duration-200",
                    pin.length > i
                      ? "bg-primary scale-110"
                      : "bg-muted border-2 border-muted-foreground/30"
                  )}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-center text-sm text-destructive font-medium animate-shake">
                {error}
              </p>
            )}

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Button
                  key={num}
                  variant="outline"
                  className="h-14 text-xl font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
                  onClick={() => handlePinInput(num.toString())}
                  disabled={verifying}
                >
                  {num}
                </Button>
              ))}
              <div /> {/* Empty space */}
              <Button
                variant="outline"
                className="h-14 text-xl font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={() => handlePinInput("0")}
                disabled={verifying}
              >
                0
              </Button>
              <Button
                variant="ghost"
                className="h-14"
                onClick={handleDelete}
                disabled={verifying || pin.length === 0}
              >
                <Delete className="h-5 w-5" />
              </Button>
            </div>

            {verifying && (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}

            {/* Forgot PIN */}
            <div className="pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground"
                onClick={() => setForgotPinOpen(true)}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Forgot PIN?
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Forgot PIN Dialog */}
      {selectedKid && (
        <ForgotPinDialog
          kidId={selectedKid.id}
          kidName={selectedKid.name}
          open={forgotPinOpen}
          onOpenChange={setForgotPinOpen}
        />
      )}
    </div>
  );
}
