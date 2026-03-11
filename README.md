# Flux — Daily Energy Estimator

Anonymous, science-based daily calorie estimator. No login. No email. No account. All data stored locally in your browser.

**Live data sources:** USDA FoodData Central · Open Food Facts

---

## Local Dev

```bash
npm install
cp .env.example .env.local
npm run dev
```

---

## Deploy to Vercel

### Via CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Via GitHub + Vercel Dashboard
1. Push to GitHub
2. Go to vercel.com/new → Import repo
3. Click Deploy (auto-detects Next.js)

### Optional Environment Variable
| Key | Value |
|-----|-------|
| `USDA_API_KEY` | Free key from fdc.nal.usda.gov (DEMO_KEY works for dev) |

---

## Architecture
- Next.js 16 App Router + TypeScript + Tailwind
- Zero auth, zero backend for user data
- All user state in localStorage
- Food search via edge API routes → USDA + Open Food Facts
- Prisma schema included for optional food cache (Neon Postgres)

## Science Sources
- RMR: Mifflin-St Jeor / Cunningham equations
- Exercise: 2024 Adult Compendium of Physical Activities
- Walking/Running: ACSM metabolic equations
- TEF: Macro-based (P 25%, C 7.5%, F 2%)
