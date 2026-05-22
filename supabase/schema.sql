-- Gutscore App Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Firebase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid TEXT UNIQUE,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessments table
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  gut_health_index INTEGER NOT NULL CHECK (gut_health_index >= 0 AND gut_health_index <= 100),
  fiber_score INTEGER NOT NULL CHECK (fiber_score >= 0 AND fiber_score <= 100),
  microbiome_score INTEGER NOT NULL CHECK (microbiome_score >= 0 AND microbiome_score <= 100),
  nutritional_risk_index INTEGER NOT NULL CHECK (nutritional_risk_index >= 0 AND nutritional_risk_index <= 100),
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  answers INTEGER[] NOT NULL,
  ai_analysis TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster history queries
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON public.assessments(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid()::TEXT = firebase_uid);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid()::TEXT = firebase_uid);

-- Assessments policies
CREATE POLICY "Users can view own assessments" ON public.assessments
  FOR SELECT USING (user_id IN (SELECT id FROM public.users WHERE firebase_uid = auth.uid()::TEXT));

CREATE POLICY "Users can create own assessments" ON public.assessments
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.users WHERE firebase_uid = auth.uid()::TEXT));

-- Function to auto-link assessment to user
CREATE OR REPLACE FUNCTION public.get_or_create_user()
RETURNS TRIGGER AS $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM public.users WHERE firebase_uid = auth.uid()::TEXT;
  IF user_id IS NULL THEN
    INSERT INTO public.users (firebase_uid, email)
    VALUES (auth.uid()::TEXT, auth.email())
    RETURNING id INTO user_id;
  END IF;
  RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for assessments
CREATE OR REPLACE FUNCTION public.set_assessment_user()
RETURNS TRIGGER AS $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM public.users WHERE firebase_uid = auth.uid()::TEXT;
  IF user_id IS NOT NULL THEN
    NEW.user_id = user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Subscription Requests table for Admin Manual Approval Flow
CREATE TABLE IF NOT EXISTS public.subscription_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fullname TEXT NOT NULL DEFAULT 'Khách hàng',
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for subscription_requests
ALTER TABLE public.subscription_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit a subscription request
CREATE POLICY "Allow public insert subscription_requests" ON public.subscription_requests
  FOR INSERT WITH CHECK (true);

-- Allow anyone to check their request status using email/phone
CREATE POLICY "Allow public select subscription_requests" ON public.subscription_requests
  FOR SELECT USING (true);