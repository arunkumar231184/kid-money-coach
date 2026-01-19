import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface KidSession {
  kidId: string;
  kidName: string;
  avatarUrl: string | null;
}

interface KidAuthContextType {
  kidSession: KidSession | null;
  isLoading: boolean;
  loginWithPin: (kidId: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const KidAuthContext = createContext<KidAuthContextType | undefined>(undefined);

const KID_SESSION_KEY = "kid_session";

export function KidAuthProvider({ children }: { children: ReactNode }) {
  const [kidSession, setKidSession] = useState<KidSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const stored = localStorage.getItem(KID_SESSION_KEY);
    if (stored) {
      try {
        setKidSession(JSON.parse(stored));
      } catch {
        localStorage.removeItem(KID_SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const loginWithPin = async (kidId: string, pin: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validate PIN format (4 digits)
      if (!/^\d{4}$/.test(pin)) {
        return { success: false, error: "PIN must be 4 digits" };
      }

      // Call the verify function
      const { data, error } = await supabase.rpc("verify_kid_pin", {
        p_kid_id: kidId,
        p_pin: pin,
      });

      if (error) {
        console.error("PIN verification error:", error);
        return { success: false, error: "Failed to verify PIN" };
      }

      if (!data) {
        return { success: false, error: "Invalid PIN" };
      }

      // Get kid details for the session
      const { data: kidData, error: kidError } = await supabase
        .from("kids")
        .select("id, name, avatar_url")
        .eq("id", kidId)
        .single();

      if (kidError || !kidData) {
        return { success: false, error: "Failed to load profile" };
      }

      const session: KidSession = {
        kidId: kidData.id,
        kidName: kidData.name,
        avatarUrl: kidData.avatar_url,
      };

      setKidSession(session);
      localStorage.setItem(KID_SESSION_KEY, JSON.stringify(session));

      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: "Something went wrong" };
    }
  };

  const logout = () => {
    setKidSession(null);
    localStorage.removeItem(KID_SESSION_KEY);
  };

  return (
    <KidAuthContext.Provider value={{ kidSession, isLoading, loginWithPin, logout }}>
      {children}
    </KidAuthContext.Provider>
  );
}

export function useKidAuth() {
  const context = useContext(KidAuthContext);
  if (context === undefined) {
    throw new Error("useKidAuth must be used within a KidAuthProvider");
  }
  return context;
}
