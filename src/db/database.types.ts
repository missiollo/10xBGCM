export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  graphql_public: {
    Tables: Record<never, never>;
    Views: Record<never, never>;
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
  public: {
    Tables: {
      audit_logs: {
        Row: {
          changed_at: string;
          changed_data: Json | null;
          id: number;
          operation: string;
          record_id: number;
          table_name: string;
          user_id: string | null;
        };
        Insert: {
          changed_at?: string;
          changed_data?: Json | null;
          id?: number;
          operation: string;
          record_id: number;
          table_name: string;
          user_id?: string | null;
        };
        Update: {
          changed_at?: string;
          changed_data?: Json | null;
          id?: number;
          operation?: string;
          record_id?: number;
          table_name?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      categories: {
        Row: {
          description: string | null;
          id: number;
          nazwa: string;
        };
        Insert: {
          description?: string | null;
          id?: number;
          nazwa: string;
        };
        Update: {
          description?: string | null;
          id?: number;
          nazwa?: string;
        };
        Relationships: [];
      };
      collections: {
        Row: {
          added_at: string;
          game_id: number;
          id: number;
          user_id: string;
        };
        Insert: {
          added_at?: string;
          game_id: number;
          id?: number;
          user_id: string;
        };
        Update: {
          added_at?: string;
          game_id?: number;
          id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collections_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "collections_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      game_categories: {
        Row: {
          category_id: number;
          game_id: number;
        };
        Insert: {
          category_id: number;
          game_id: number;
        };
        Update: {
          category_id?: number;
          game_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "game_categories_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "game_categories_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
        ];
      };
      game_mechanics: {
        Row: {
          game_id: number;
          mechanic_id: number;
        };
        Insert: {
          game_id: number;
          mechanic_id: number;
        };
        Update: {
          game_id?: number;
          mechanic_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "game_mechanics_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "game_mechanics_mechanic_id_fkey";
            columns: ["mechanic_id"];
            isOneToOne: false;
            referencedRelation: "mechanics";
            referencedColumns: ["id"];
          },
        ];
      };
      game_ratings: {
        Row: {
          comment: string | null;
          created_at: string;
          game_id: number;
          id: number;
          rating: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          comment?: string | null;
          created_at?: string;
          game_id: number;
          id?: number;
          rating: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          comment?: string | null;
          created_at?: string;
          game_id?: number;
          id?: number;
          rating?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "game_ratings_game_id_fkey";
            columns: ["game_id"];
            isOneToOne: false;
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "game_ratings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      games: {
        Row: {
          created_at: string;
          czas_rozgrywki: number | null;
          id: number;
          max_graczy: number;
          min_graczy: number;
          tytul: string;
          updated_at: string;
          wydawca: string | null;
        };
        Insert: {
          created_at?: string;
          czas_rozgrywki?: number | null;
          id?: number;
          max_graczy: number;
          min_graczy: number;
          tytul: string;
          updated_at?: string;
          wydawca?: string | null;
        };
        Update: {
          created_at?: string;
          czas_rozgrywki?: number | null;
          id?: number;
          max_graczy?: number;
          min_graczy?: number;
          tytul?: string;
          updated_at?: string;
          wydawca?: string | null;
        };
        Relationships: [];
      };
      mechanics: {
        Row: {
          description: string | null;
          id: number;
          nazwa: string;
        };
        Insert: {
          description?: string | null;
          id?: number;
          nazwa: string;
        };
        Update: {
          description?: string | null;
          id?: number;
          nazwa?: string;
        };
        Relationships: [];
      };
      recommendations: {
        Row: {
          created_at: string;
          id: number;
          input_data: Json;
          recommendation: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          input_data: Json;
          recommendation?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          input_data?: Json;
          recommendation?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recommendations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          password_hash: string;
          updated_at: string;
          username: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          password_hash: string;
          updated_at?: string;
          username: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          password_hash?: string;
          updated_at?: string;
          username?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
}

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
