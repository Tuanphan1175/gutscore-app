# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gutscore is a gut health assessment mobile app built with Expo SDK 55 and expo-router. It scores users' gut health (0-100) based on 29 questions across 4 categories, with AI-powered nutritional recommendations via GPT-4o.

## Common Commands

```bash
npm install          # Install dependencies
npx expo start       # Start development server
npx expo start --web # Start web dev server
npm run android      # Run on Android
npm run ios          # Run on iOS
npm run lint         # Run ESLint
npx tsc --noEmit     # Type check
```

## Environment Setup

Copy `.env.example` to `.env` and fill in:
- `EXPO_PUBLIC_SUPABASE_URL` - Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `EXPO_PUBLIC_OPENAI_API_KEY` - OpenAI API key for GPT-4o

## Architecture

### App Structure (expo-router file-based routing)

```
src/app/
├── _layout.tsx              # Root stack layout
├── (tabs)/                 # Tab navigation
│   ├── _layout.tsx          # Tab bar config
│   ├── index.tsx           # Home screen
│   ├── assessment.tsx       # 29-question form wizard
│   ├── history.tsx          # Assessment history from Supabase
│   └── profile.tsx          # User profile
├── result.tsx               # Result screen with AI analysis

src/components/ui/           # Reusable UI components
src/constants/               # Theme tokens + 29 questions
src/lib/                     # Scoring, AI analysis, Supabase client
src/store/                  # Zustand state management
src/types/                  # TypeScript interfaces
```

### Key Libraries

- **expo-router** ~55.0.14 — File-based routing
- **zustand** — State management for assessment
- **@supabase/supabase-js** — Database persistence
- **openai** — GPT-4o AI analysis
- **react-native-reanimated** 4.2.1 — Animations

### Path Aliases

`@/*` maps to `./src/*` — use `@/components`, `@/lib`, `@/constants`, etc.

## Gut Health Scoring

4 sub-scores (each 0-100):
1. **Gut Health Index** (35% weight) — bowel habits, symptoms
2. **Fiber Score** (25% weight) — vegetable, fruit, whole grain intake
3. **Microbiome Score** (20% weight) — fermented foods, stress, sleep
4. **Nutritional Risk Index** (20% weight) — processed food, red meat

Overall score = weighted average. Labels: ≥80 "Xuất sắc", ≥60 "Tốt", ≥40 "Trung bình", ≥20 "Yếu", <20 "Cần cải thiện"

## Expo-Specific Notes

- **Read Expo v55.0.0 docs** at https://docs.expo.dev/versions/v55.0.0/ before writing code
- Deep links use scheme `gutscoreapp://`
- Splash screen: backgroundColor `#208AEF`