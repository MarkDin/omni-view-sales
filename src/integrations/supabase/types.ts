export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customer_extra: {
        Row: {
          created_at: string
          id: number
          trend_chart: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          trend_chart?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          trend_chart?: string | null
        }
        Relationships: []
      }
      customer_orders: {
        Row: {
          country: string | null
          customer_code: string | null
          customer_name: string | null
          customer_short_name: string | null
          id: string
          material: string | null
          order_amount: number | null
          order_month: string | null
          product_type: string | null
          sales_person: string | null
          type: string | null
        }
        Insert: {
          country?: string | null
          customer_code?: string | null
          customer_name?: string | null
          customer_short_name?: string | null
          id?: string
          material?: string | null
          order_amount?: number | null
          order_month?: string | null
          product_type?: string | null
          sales_person?: string | null
          type?: string | null
        }
        Update: {
          country?: string | null
          customer_code?: string | null
          customer_name?: string | null
          customer_short_name?: string | null
          id?: string
          material?: string | null
          order_amount?: number | null
          order_month?: string | null
          product_type?: string | null
          sales_person?: string | null
          type?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          company: string | null
          created_at: string | null
          email: string | null
          id: string
          industry: string | null
          last_purchase: string | null
          lifetime_value: number | null
          name: string
          phone: string | null
          purchase_count: number | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          last_purchase?: string | null
          lifetime_value?: number | null
          name: string
          phone?: string | null
          purchase_count?: number | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          last_purchase?: string | null
          lifetime_value?: number | null
          name?: string
          phone?: string | null
          purchase_count?: number | null
        }
        Relationships: []
      }
      email: {
        Row: {
          content: string | null
          created_at: string
          customer_id: string | null
          id: number
          receiver: string
          send_at: string | null
          sender: string
          topic: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          customer_id?: string | null
          id?: number
          receiver: string
          send_at?: string | null
          sender: string
          topic?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          customer_id?: string | null
          id?: number
          receiver?: string
          send_at?: string | null
          sender?: string
          topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string | null
          customers: number | null
          growth: number | null
          id: string
          inventory: number | null
          margin: number | null
          name: string
          price: number
          profit: number | null
          sales: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          customers?: number | null
          growth?: number | null
          id?: string
          inventory?: number | null
          margin?: number | null
          name: string
          price: number
          profit?: number | null
          sales?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          customers?: number | null
          growth?: number | null
          id?: string
          inventory?: number | null
          margin?: number | null
          name?: string
          price?: number
          profit?: number | null
          sales?: number | null
        }
        Relationships: []
      }
      visit_records: {
        Row: {
          created_at: string | null
          device_info: Json | null
          id: string
          market: string | null
          path: string
          user_email: string | null
          visit_end_time: string | null
          visit_start_time: string | null
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          id?: string
          market?: string | null
          path: string
          user_email?: string | null
          visit_end_time?: string | null
          visit_start_time?: string | null
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          id?: string
          market?: string | null
          path?: string
          user_email?: string | null
          visit_end_time?: string | null
          visit_start_time?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
