export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          description: string | null
          earned_at: string
          icon: string
          id: string
          kid_id: string
          name: string
          rarity: string
        }
        Insert: {
          description?: string | null
          earned_at?: string
          icon: string
          id?: string
          kid_id: string
          name: string
          rarity?: string
        }
        Update: {
          description?: string | null
          earned_at?: string
          icon?: string
          id?: string
          kid_id?: string
          name?: string
          rarity?: string
        }
        Relationships: [
          {
            foreignKeyName: "badges_kid_id_fkey"
            columns: ["kid_id"]
            isOneToOne: false
            referencedRelation: "kids"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_connections: {
        Row: {
          access_token: string
          account_id: string | null
          account_name: string | null
          bank_name: string | null
          connected_at: string
          created_at: string
          id: string
          kid_id: string
          last_synced_at: string | null
          provider: string
          refresh_token: string | null
          status: string
          token_expires_at: string | null
          updated_at: string
        }
        Insert: {
          access_token: string
          account_id?: string | null
          account_name?: string | null
          bank_name?: string | null
          connected_at?: string
          created_at?: string
          id?: string
          kid_id: string
          last_synced_at?: string | null
          provider?: string
          refresh_token?: string | null
          status?: string
          token_expires_at?: string | null
          updated_at?: string
        }
        Update: {
          access_token?: string
          account_id?: string | null
          account_name?: string | null
          bank_name?: string | null
          connected_at?: string
          created_at?: string
          id?: string
          kid_id?: string
          last_synced_at?: string | null
          provider?: string
          refresh_token?: string | null
          status?: string
          token_expires_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_connections_kid_id_fkey"
            columns: ["kid_id"]
            isOneToOne: false
            referencedRelation: "kids"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          created_at: string
          current_days: number | null
          current_value: number | null
          description: string | null
          end_date: string | null
          id: string
          kid_id: string
          reward_badge: string | null
          reward_xp: number | null
          start_date: string
          status: string
          target_days: number | null
          target_value: number
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_days?: number | null
          current_value?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          kid_id: string
          reward_badge?: string | null
          reward_xp?: number | null
          start_date?: string
          status?: string
          target_days?: number | null
          target_value: number
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_days?: number | null
          current_value?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          kid_id?: string
          reward_badge?: string | null
          reward_xp?: number | null
          start_date?: string
          status?: string
          target_days?: number | null
          target_value?: number
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenges_kid_id_fkey"
            columns: ["kid_id"]
            isOneToOne: false
            referencedRelation: "kids"
            referencedColumns: ["id"]
          },
        ]
      }
      kids: {
        Row: {
          age: number
          allowance_amount: number | null
          allowance_frequency: string | null
          avatar_url: string | null
          bank_account_connected: boolean | null
          created_at: string
          current_streak: number | null
          id: string
          level: number | null
          name: string
          parent_id: string
          total_badges: number | null
          total_saved: number | null
          updated_at: string
          xp_points: number | null
        }
        Insert: {
          age: number
          allowance_amount?: number | null
          allowance_frequency?: string | null
          avatar_url?: string | null
          bank_account_connected?: boolean | null
          created_at?: string
          current_streak?: number | null
          id?: string
          level?: number | null
          name: string
          parent_id: string
          total_badges?: number | null
          total_saved?: number | null
          updated_at?: string
          xp_points?: number | null
        }
        Update: {
          age?: number
          allowance_amount?: number | null
          allowance_frequency?: string | null
          avatar_url?: string | null
          bank_account_connected?: boolean | null
          created_at?: string
          current_streak?: number | null
          id?: string
          level?: number | null
          name?: string
          parent_id?: string
          total_badges?: number | null
          total_saved?: number | null
          updated_at?: string
          xp_points?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      savings_goals: {
        Row: {
          created_at: string
          current_amount: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          kid_id: string
          name: string
          target_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_amount?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          kid_id: string
          name: string
          target_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_amount?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          kid_id?: string
          name?: string
          target_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "savings_goals_kid_id_fkey"
            columns: ["kid_id"]
            isOneToOne: false
            referencedRelation: "kids"
            referencedColumns: ["id"]
          },
        ]
      }
      spending_limits: {
        Row: {
          category: string
          created_at: string
          id: string
          is_active: boolean | null
          kid_id: string
          limit_amount: number
          period: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          kid_id: string
          limit_amount: number
          period?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          kid_id?: string
          limit_amount?: number
          period?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "spending_limits_kid_id_fkey"
            columns: ["kid_id"]
            isOneToOne: false
            referencedRelation: "kids"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          bank_connection_id: string | null
          category: string
          created_at: string
          description: string | null
          external_id: string | null
          id: string
          is_income: boolean | null
          kid_id: string
          merchant: string
          transaction_date: string
        }
        Insert: {
          amount: number
          bank_connection_id?: string | null
          category: string
          created_at?: string
          description?: string | null
          external_id?: string | null
          id?: string
          is_income?: boolean | null
          kid_id: string
          merchant: string
          transaction_date?: string
        }
        Update: {
          amount?: number
          bank_connection_id?: string | null
          category?: string
          created_at?: string
          description?: string | null
          external_id?: string | null
          id?: string
          is_income?: boolean | null
          kid_id?: string
          merchant?: string
          transaction_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_bank_connection_id_fkey"
            columns: ["bank_connection_id"]
            isOneToOne: false
            referencedRelation: "bank_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_kid_id_fkey"
            columns: ["kid_id"]
            isOneToOne: false
            referencedRelation: "kids"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_insights: {
        Row: {
          created_at: string
          id: string
          insight_type: string
          is_read: boolean | null
          kid_id: string
          message: string
          week_ending: string
        }
        Insert: {
          created_at?: string
          id?: string
          insight_type: string
          is_read?: boolean | null
          kid_id: string
          message: string
          week_ending: string
        }
        Update: {
          created_at?: string
          id?: string
          insight_type?: string
          is_read?: boolean | null
          kid_id?: string
          message?: string
          week_ending?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_insights_kid_id_fkey"
            columns: ["kid_id"]
            isOneToOne: false
            referencedRelation: "kids"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      user_owns_kid: { Args: { kid_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
