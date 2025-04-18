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
      client_communications: {
        Row: {
          ai_generated: boolean | null
          attachments: Json | null
          client_id: string
          created_at: string | null
          customer_code: string
          edited: boolean | null
          emails_id: string[] | null
          id: number
          summary: string | null
          tags: string[] | null
          thread_count: number | null
          week_end: string | null
          week_label: string | null
          week_start: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          attachments?: Json | null
          client_id: string
          created_at?: string | null
          customer_code: string
          edited?: boolean | null
          emails_id?: string[] | null
          id?: number
          summary?: string | null
          tags?: string[] | null
          thread_count?: number | null
          week_end?: string | null
          week_label?: string | null
          week_start?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          attachments?: Json | null
          client_id?: string
          created_at?: string | null
          customer_code?: string
          edited?: boolean | null
          emails_id?: string[] | null
          id?: number
          summary?: string | null
          tags?: string[] | null
          thread_count?: number | null
          week_end?: string | null
          week_label?: string | null
          week_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_communications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client_communications_customer_code"
            columns: ["customer_code"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_code"]
          },
        ]
      }
      client_summaries: {
        Row: {
          client_id: string | null
          created_at: string | null
          edited: boolean | null
          id: string
          key_insights: string[] | null
          summary: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          edited?: boolean | null
          id?: string
          key_insights?: string[] | null
          summary?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          edited?: boolean | null
          id?: string
          key_insights?: string[] | null
          summary?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_summaries_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_extra: {
        Row: {
          company_name: string | null
          created_at: string
          customer_code: string
          id: number
          long_trend_slope: number
          name: string | null
          order_amount_in_the_past_year: number
          short_trend_slope: number
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          customer_code: string
          id?: number
          long_trend_slope: number
          name?: string | null
          order_amount_in_the_past_year: number
          short_trend_slope: number
        }
        Update: {
          company_name?: string | null
          created_at?: string
          customer_code?: string
          id?: number
          long_trend_slope?: number
          name?: string | null
          order_amount_in_the_past_year?: number
          short_trend_slope?: number
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
          ai_summary: string | null
          company: string
          created_at: string | null
          credit_level: string | null
          credit_limit: number | null
          credit_used: number | null
          customer_code: string
          email: string | null
          id: string
          industry: string | null
          last_order: string | null
          lifetime_value: number | null
          name: string
          next_meeting: string | null
          phone: string | null
          purchase_count: number | null
          region: string | null
          sales_rep: string | null
          score: number | null
          short_name: string | null
          status: number | null
          tags: string[] | null
        }
        Insert: {
          address?: string | null
          ai_summary?: string | null
          company?: string
          created_at?: string | null
          credit_level?: string | null
          credit_limit?: number | null
          credit_used?: number | null
          customer_code?: string
          email?: string | null
          id?: string
          industry?: string | null
          last_order?: string | null
          lifetime_value?: number | null
          name?: string
          next_meeting?: string | null
          phone?: string | null
          purchase_count?: number | null
          region?: string | null
          sales_rep?: string | null
          score?: number | null
          short_name?: string | null
          status?: number | null
          tags?: string[] | null
        }
        Update: {
          address?: string | null
          ai_summary?: string | null
          company?: string
          created_at?: string | null
          credit_level?: string | null
          credit_limit?: number | null
          credit_used?: number | null
          customer_code?: string
          email?: string | null
          id?: string
          industry?: string | null
          last_order?: string | null
          lifetime_value?: number | null
          name?: string
          next_meeting?: string | null
          phone?: string | null
          purchase_count?: number | null
          region?: string | null
          sales_rep?: string | null
          score?: number | null
          short_name?: string | null
          status?: number | null
          tags?: string[] | null
        }
        Relationships: []
      }
      email: {
        Row: {
          content: string | null
          created_at: string
          customer_id: string | null
          direction: string | null
          id: string
          is_read: boolean | null
          parent_id: string | null
          read_at: string | null
          receiver: string
          receiver_email: string | null
          send_at: string | null
          sender: string
          sender_email: string | null
          status: string | null
          subject: string | null
          topic: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          customer_id?: string | null
          direction?: string | null
          id: string
          is_read?: boolean | null
          parent_id?: string | null
          read_at?: string | null
          receiver: string
          receiver_email?: string | null
          send_at?: string | null
          sender: string
          sender_email?: string | null
          status?: string | null
          subject?: string | null
          topic?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          customer_id?: string | null
          direction?: string | null
          id?: string
          is_read?: boolean | null
          parent_id?: string | null
          read_at?: string | null
          receiver?: string
          receiver_email?: string | null
          send_at?: string | null
          sender?: string
          sender_email?: string | null
          status?: string | null
          subject?: string | null
          topic?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      monthly_client_data: {
        Row: {
          amount: number
          created_at: string
          customer_code: string
          customer_name: string | null
          id: number
          month: string
        }
        Insert: {
          amount: number
          created_at?: string
          customer_code: string
          customer_name?: string | null
          id?: number
          month: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer_code?: string
          customer_name?: string | null
          id?: number
          month?: string
        }
        Relationships: [
          {
            foreignKeyName: "monthly_client_data_customer_code_fkey"
            columns: ["customer_code"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_code"]
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
      sales_statistics: {
        Row: {
          completion_rate: number | null
          created_at: string
          customer_count: number | null
          id: string
          new_customer_count: number | null
          period_end: string
          period_start: string
          period_type: string
          target_amount: number | null
          total_amount: number
          total_orders: number
          updated_at: string
          ytd_sales: number | null
        }
        Insert: {
          completion_rate?: number | null
          created_at?: string
          customer_count?: number | null
          id?: string
          new_customer_count?: number | null
          period_end: string
          period_start: string
          period_type: string
          target_amount?: number | null
          total_amount?: number
          total_orders?: number
          updated_at?: string
          ytd_sales?: number | null
        }
        Update: {
          completion_rate?: number | null
          created_at?: string
          customer_count?: number | null
          id?: string
          new_customer_count?: number | null
          period_end?: string
          period_start?: string
          period_type?: string
          target_amount?: number | null
          total_amount?: number
          total_orders?: number
          updated_at?: string
          ytd_sales?: number | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string | null
          id: number
          object_id: string
          object_type: string
          updated_at: string | null
          value: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          object_id: string
          object_type: string
          updated_at?: string | null
          value: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          object_id?: string
          object_type?: string
          updated_at?: string | null
          value?: string
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
      get_client_communications_by_client_id: {
        Args: { p_client_id: string }
        Returns: {
          id: number
          week_start: string
          week_end: string
          week_label: string
          summary: string
          thread_count: number
          attachments: Json
          tags: string[]
          created_at: string
          customer_code: string
          ai_generated: boolean
          edited: boolean
          emails_id: string[]
        }[]
      }
      get_dashboard_statistics: {
        Args: Record<PropertyKey, never>
        Returns: {
          ytd_sales: number
          ytd_growth_rate: number
          weekly_new_orders: number
          weekly_growth_rate: number
          goal_completion_rate: number
          monthly_trend: Json
        }[]
      }
      get_device_distribution: {
        Args: Record<PropertyKey, never>
        Returns: {
          platform: string
          count: number
        }[]
      }
      get_market_distribution_unique_daily: {
        Args: Record<PropertyKey, never>
        Returns: {
          market: string
          count: number
        }[]
      }
      get_monthly_region_sales: {
        Args: { p_start_date?: string; p_end_date?: string }
        Returns: {
          sales_month: string
          region: string
          amount: number
          customers: string[]
          total_amount: number
          percentage: number
        }[]
      }
      get_period_dates: {
        Args: { order_date: string }
        Returns: {
          period_type: string
          period_start: string
          period_end: string
        }[]
      }
      get_visit_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_visits: number
          unique_visitors: number
          avg_duration: number
        }[]
      }
      sync_customers_from_orders: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_sales_statistics: {
        Args: { p_year?: number; p_month?: number }
        Returns: undefined
      }
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
