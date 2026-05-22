import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient;

export function getSupabase(): SupabaseClient {
  if (!supabase) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
    }
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return supabase;
}

export async function saveAssessmentResult(result: {
  gut_health_index: number;
  fiber_score: number;
  microbiome_score: number;
  nutritional_risk_index: number;
  overall_score: number;
  answers: number[];
  ai_analysis?: string;
}) {
  const client = getSupabase();
  const { data, error } = await client
    .from('assessments')
    .insert([result])
    .select()
    .single();

  if (error) {
    console.error('Save assessment error:', error);
    throw error;
  }
  return data;
}

export async function getAssessmentHistory() {
  const client = getSupabase();
  const { data, error } = await client
    .from('assessments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Get history error:', error);
    throw error;
  }
  return data || [];
}

export async function createSubscriptionRequest(request: {
  fullname: string;
  email: string;
  phone: string;
  plan: 'monthly' | 'yearly';
}) {
  const client = getSupabase();
  const { data, error } = await client
    .from('subscription_requests')
    .insert([request])
    .select()
    .single();

  if (error) {
    console.error('Create subscription request error:', error);
    throw error;
  }
  return data;
}

export async function checkSubscriptionStatus(email: string, phone: string) {
  const client = getSupabase();
  const { data, error } = await client
    .from('subscription_requests')
    .select('*')
    .or(`email.eq.${email},phone.eq.${phone}`)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Check subscription status error:', error);
    throw error;
  }
  return data && data.length > 0 ? data[0] : null;
}