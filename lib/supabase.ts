// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// .env.local に設定した接続用のURLとキーを読み込みます
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Supabaseと通信を行うための「接続クライアント（窓口）」を作り、他のプログラムから使えるように公開（export）します
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
