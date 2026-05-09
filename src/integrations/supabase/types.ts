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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      coach_mentees: {
        Row: {
          coach_id: string
          created_at: string
          id: string
          mentee_email: string | null
          mentee_name: string
          mentee_whatsapp: string | null
          notes: string | null
          status: string
          updated_at: string
          window_id: string
        }
        Insert: {
          coach_id: string
          created_at?: string
          id?: string
          mentee_email?: string | null
          mentee_name: string
          mentee_whatsapp?: string | null
          notes?: string | null
          status?: string
          updated_at?: string
          window_id: string
        }
        Update: {
          coach_id?: string
          created_at?: string
          id?: string
          mentee_email?: string | null
          mentee_name?: string
          mentee_whatsapp?: string | null
          notes?: string | null
          status?: string
          updated_at?: string
          window_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_mentees_window_id_fkey"
            columns: ["window_id"]
            isOneToOne: false
            referencedRelation: "windows"
            referencedColumns: ["id"]
          },
        ]
      }
      peer_responses: {
        Row: {
          created_at: string
          id: string
          peer_name: string | null
          window_id: string
          words: string[]
        }
        Insert: {
          created_at?: string
          id?: string
          peer_name?: string | null
          window_id: string
          words?: string[]
        }
        Update: {
          created_at?: string
          id?: string
          peer_name?: string | null
          window_id?: string
          words?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "peer_responses_window_id_fkey"
            columns: ["window_id"]
            isOneToOne: false
            referencedRelation: "windows"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      windows: {
        Row: {
          age: number | null
          code: string
          created_at: string
          email: string
          gender: string
          id: string
          name: string
          occupation: string
          owner_id: string | null
          owner_type: string
          referral_source: string | null
          self_words: string[]
          whatsapp: string
        }
        Insert: {
          age?: number | null
          code: string
          created_at?: string
          email: string
          gender: string
          id?: string
          name: string
          occupation: string
          owner_id?: string | null
          owner_type?: string
          referral_source?: string | null
          self_words?: string[]
          whatsapp: string
        }
        Update: {
          age?: number | null
          code?: string
          created_at?: string
          email?: string
          gender?: string
          id?: string
          name?: string
          occupation?: string
          owner_id?: string | null
          owner_type?: string
          referral_source?: string | null
          self_words?: string[]
          whatsapp?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_window: {
        Args: {
          _age: number
          _code: string
          _email: string
          _gender: string
          _name: string
          _occupation: string
          _referral_source?: string
          _self_words: string[]
          _whatsapp: string
        }
        Returns: {
          code: string
          id: string
        }[]
      }
      get_client_window: {
        Args: { _code: string }
        Returns: {
          code: string
          id: string
          name: string
          owner_type: string
          self_done: boolean
        }[]
      }
      get_coach_roster: {
        Args: never
        Returns: {
          code: string
          created_at: string
          mentee_email: string
          mentee_id: string
          mentee_name: string
          mentee_whatsapp: string
          notes: string
          peer_count: number
          self_done: boolean
          status: string
          window_id: string
        }[]
      }
      get_my_windows: {
        Args: never
        Returns: {
          code: string
          created_at: string
          id: string
          name: string
        }[]
      }
      get_self_window: {
        Args: { _id: string }
        Returns: {
          code: string
          created_at: string
          id: string
          name: string
          self_words: string[]
        }[]
      }
      get_window_by_code: {
        Args: { _code: string }
        Returns: {
          code: string
          created_at: string
          id: string
          name: string
        }[]
      }
      get_window_by_id: {
        Args: { _id: string }
        Returns: {
          code: string
          created_at: string
          id: string
          name: string
        }[]
      }
      get_window_full: {
        Args: { _id: string }
        Returns: {
          code: string
          created_at: string
          id: string
          name: string
          owner_id: string
          owner_type: string
          self_words: string[]
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      submit_client_self: {
        Args: { _code: string; _name?: string; _self_words: string[] }
        Returns: string
      }
      submit_peer_response: {
        Args: { _code: string; _peer_name: string; _words: string[] }
        Returns: string
      }
      window_exists: { Args: { _window_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "coach" | "team_lead"
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
    Enums: {
      app_role: ["admin", "coach", "team_lead"],
    },
  },
} as const
