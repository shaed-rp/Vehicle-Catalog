import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for better type safety
export interface Database {
  public: {
    Tables: {
      vehicles: {
        Row: {
          id: number
          body_model_code_id: number | null
          model_year_id: number
          make_id: number
          model_id: number
          trim_id: number
          body_type_id: number
          drive_type_id: number
          primary_identification_id: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          body_model_code_id?: number | null
          model_year_id: number
          make_id: number
          model_id: number
          trim_id: number
          body_type_id: number
          drive_type_id: number
          primary_identification_id?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          body_model_code_id?: number | null
          model_year_id?: number
          make_id?: number
          model_id?: number
          trim_id?: number
          body_type_id?: number
          drive_type_id?: number
          primary_identification_id?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      vehicle_identifications: {
        Row: {
          id: number
          vehicle_id: number
          type: string
          value: string
          is_primary: boolean
          issued_by: string | null
          issued_date: string | null
          metadata: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          vehicle_id: number
          type: string
          value: string
          is_primary?: boolean
          issued_by?: string | null
          issued_date?: string | null
          metadata?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          vehicle_id?: number
          type?: string
          value?: string
          is_primary?: boolean
          issued_by?: string | null
          issued_date?: string | null
          metadata?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      vehicle_pricing: {
        Row: {
          id: number
          vehicle_id: number
          intro_msrp: number
          factory_dealer_invoice: number
          dealer_net: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          vehicle_id: number
          intro_msrp: number
          factory_dealer_invoice: number
          dealer_net: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          vehicle_id?: number
          intro_msrp?: number
          factory_dealer_invoice?: number
          dealer_net?: number
          created_at?: string
          updated_at?: string
        }
      }
      makes: {
        Row: {
          id: number
          name: string
          logo_url: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          logo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          logo_url?: string | null
          created_at?: string
        }
      }
      models: {
        Row: {
          id: number
          make_id: number
          name: string
          created_at: string
        }
        Insert: {
          id?: number
          make_id: number
          name: string
          created_at?: string
        }
        Update: {
          id?: number
          make_id?: number
          name?: string
          created_at?: string
        }
      }
      model_years: {
        Row: {
          id: number
          year: number
          created_at: string
        }
        Insert: {
          id?: number
          year: number
          created_at?: string
        }
        Update: {
          id?: number
          year?: number
          created_at?: string
        }
      }
      trims: {
        Row: {
          id: number
          name: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
        }
      }
      body_types: {
        Row: {
          id: number
          name: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
        }
      }
      drive_types: {
        Row: {
          id: number
          name: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
        }
      }
    }
  }
} 