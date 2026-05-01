# AI Job Assistant

A modern, AI-powered career tool that analyzes how well a candidate matches a job offer. Paste a job description and your CV to get an instant match score, strengths & weaknesses breakdown, and a tailored cover letter — in seconds.

Built with **Nuxt 3**, **DeepSeek AI**, and **TypeScript**. No external UI libraries.

---

## Features

- **Match Score** — Realistic 0–100 compatibility score with a short explanation
- **Strengths & Weaknesses** — Recruiter-style analysis based on the actual job requirements
- **Cover Letter** — Professional letter generated in the language you choose
- **Soft Skills integration** — Weaves your soft skills naturally into the cover letter
- **Multilingual UI** — Interface available in English, Spanish, and German
- **Multilingual output** — Cover letter can be generated in German, English, or Spanish, regardless of input language
- **Copy to clipboard** — One-click copy for the generated cover letter
- **Robust error handling** — Field validation, API errors, and loading states fully covered
- **Responsive** — Optimized for mobile, tablet, and desktop

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Nuxt 3 (SSR + API routes via Nitro) |
| Language | TypeScript (strict mode) |
| AI Provider | DeepSeek (`deepseek-chat`) via REST |
| Styling | SCSS (BEM, no Tailwind, no UI libs) |
| State | Vue 3 Composition API + Nuxt `useState` |

---

## Project Structure

```
├── assets/
│   ├── images/          # Logo assets (1:1 and 16:9)
│   └── scss/            # Global styles and design tokens
│       ├── variables.scss
│       ├── base.scss
│       └── main.scss
│
├── components/
│   ├── AnalysisLoader.vue   # Animated loading state
│   ├── AppButton.vue        # Primary / secondary button
│   ├── AppTextarea.vue      # Textarea with label, hint, inline error
│   ├── InsightList.vue      # Strengths / weaknesses list
│   ├── LangSwitcher.vue     # UI language toggle (EN / ES / DE)
│   ├── OutputLangSelector.vue  # Cover letter language selector
│   ├── ResultCard.vue       # Generic result card shell
│   └── ScoreCard.vue        # Animated match score ring
│
├── composables/
│   ├── useI18n.ts           # UI translations and locale state
│   └── useJobAnalysis.ts    # Form state, validation, API call
│
├── layouts/
│   └── default.vue          # App shell (header, main, footer)
│
├── lib/
│   └── ai-client.ts         # Reusable DeepSeek fetch wrapper
│
├── pages/
│   └── index.vue            # Main page
│
├── public/
│   └── favicon.png
│
├── scripts/
│   └── test-ai.ts           # Quick AI client smoke test
│
└── server/
    └── api/
        └── analyze.ts       # POST /api/analyze — orchestrates all AI calls
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [DeepSeek API key](https://platform.deepseek.com)

### Installation

```bash
git clone https://github.com/your-username/ai-job-application-assistant.git
cd ai-job-application-assistant
npm install
```

### Environment

Copy the example file and add your key:

```bash
cp .env.example .env
```

```env
AI_API_KEY=your_deepseek_api_key_here
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## API

### `POST /api/analyze`

**Request body:**

```json
{
  "cv": "string (min 20 chars)",
  "jobOffer": "string (min 20 chars)",
  "softSkills": "string (optional)",
  "outputLanguage": "German | English | Spanish (optional, default: German)"
}
```

**Response:**

```json
{
  "coverLetter": "string",
  "matchScore": 82,
  "reason": "string",
  "strengths": ["string"],
  "weaknesses": ["string"]
}
```

**Error responses:**

| Status | Cause |
|--------|-------|
| `400` | Missing or too-short input fields |
| `502` | AI generation or JSON parsing failed |
| `503` | API key not configured |

---

## AI Architecture

The endpoint makes **3 parallel AI calls** via `Promise.all`, each with a focused prompt:

```
POST /api/analyze
├── generateCoverLetter()    → focused prompt, temp 0.4, max 600 tokens
├── generateMatchScore()     → focused prompt, temp 0.2, max 100 tokens
└── generateStrengthsWeaknesses() → focused prompt, temp 0.2, max 200 tokens
```

All calls share the same reusable client in [`lib/ai-client.ts`](lib/ai-client.ts).

---

## Language System

Three independent language layers:

| Layer | Options | Controlled by |
|-------|---------|--------------|
| UI language | EN / ES / DE | `LangSwitcher` → `useI18n` |
| Output language | German / English / Spanish | `OutputLangSelector` → prompt |
| Input language | Any (detected by model) | Not controlled — intentional |

The AI model handles multilingual input natively. Only the output language is explicitly controlled.

---

## Testing the AI Client

```bash
AI_API_KEY=your_key npx tsx scripts/test-ai.ts
```

---

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run typecheck  # Run TypeScript checks
```
