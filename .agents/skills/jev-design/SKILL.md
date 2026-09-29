---
name: jev-design
description: Use TypeSafe's Jev System One decision model for fast UI generative design, component slot selection, UI screen testing, and autonomous decision orchestration without token-generation lag.
---

# JEV Design & Decision Engine

Jev is TypeSafe AI's flagship **System One model**. Unlike standard LLMs that generate autoregressive text or code tokens (which are slow, non-deterministic, and prone to syntax errors), Jev is a dedicated **high-speed decision engine** (70–250ms latency) that outputs typed structured answers:
- **Choice**: Categorical selection with calibrated probability distributions.
- **Score**: Rubric-based numerical evaluations (e.g. 0.0 to 1.0).
- **Noul**: Calibrated Yes/No probabilities.

---

## 1. The Jev Generative UI Architecture (`jev-design-test`)

Instead of asking an LLM to write HTML/React code from scratch, Jev uses the **Selection over Generation** paradigm:

```
[ User Request / Prompt / Game Context ]
                   │
                   ▼
     ┌───────────────────────────┐
     │  Jev System One Decision  │  (~100ms batched fan-out)
     └─────────────┬─────────────┘
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
   [NAV_SLOT] [CONTENT_SLOT] [BACKDROP_SLOT] ...
       │           │           │
       ▼           ▼           ▼
  (Select from Pre-tested Verified Component Registry)
                   │
                   ▼
  [ Cohesive, Zero-Error, Production-Ready Screen ]
```

### Core Slots Definition

1. **`NAV_SLOT`**:
   - `sidebar`: Full left navigation bar with grouped items.
   - `rail`: Compact icon-only rail for maximum content canvas.
   - `topbar`: Single horizontal header bar.
2. **`CONTENT_SLOT`**:
   - `full`: Content stretches the full width of the container.
   - `narrow`: Centered in a focused column with comfortable side breathing room.
   - `with-aside`: Content flanked by a context/profile/stats panel.
   - `grid-3zone`: Balanced 3-zone layout (Left cards, Center stage, Right cards).
3. **`BACKDROP_SLOT`**:
   - `plain`: Clean background.
   - `wood-deck`: Warm textured wooden table arena.
   - `sky-anime`: Vibrant gradient sky with floating particles.
   - `dot-grid`: Subtle technical matrix.
4. **`THEME_SLOT`**:
   - `nuclear-gold`: Deep amber, glowing radiation gold, dark wood.
   - `clinical-clean`: Crisp medical blue and pure white.
   - `dark-slate`: High-contrast tournament night mode.

---

## 2. Using `@typesafe-ai/sdk` in Code

```typescript
import { TypeSafeClient, choice } from "@typesafe-ai/sdk";

// Initialize client (reads TYPESAFE_API_KEY from environment)
const client = new TypeSafeClient();

export async function decideScreenLayout(userIntent: string) {
  const result = await client.systemOne({
    state: { query: userIntent },
    questions: {
      screenType: choice("Which screen should be displayed?", {
        splash: "Initial title splash with mascots, play button, and 4 floating cards",
        lobby: "Multiplayer room lobby waiting for players and ready status",
        board: "Live match table with case card, clues, and 5 hand cards",
        gallery: "Trading card album showcasing 4 locked-color prototypes",
        shop: "NucCoin cosmetic and avatar store"
      }),
      layoutDensity: choice("What density fits this viewport and intent?", {
        spacious: "Generous margins, large cards, cinematic scale (1440x900+)",
        compact: "Calibrated scales, tucked cards, zero overlap (1180x820)"
      })
    }
  });

  return {
    screen: result.answers.screenType.choice,
    density: result.answers.layoutDensity.choice,
    confidence: result.answers.screenType.probabilities[result.answers.screenType.choice]
  };
}
```

---

## 3. The 5 Efficiency Pillars for Maximum JEV Performance

1. **Selection Over Generation (Slot Registry):**
   - Pre-build and verify components in code.
   - Let JEV output typed Enums (`screen`, `slot`, `theme`).
   - React consumes Enums deterministically. Zero syntax hallucination.
2. **Speculative Fan-Out (Parallel Batched Questions):**
   - Query multiple orthogonal dimensions in a single `systemOne` request (~100ms) rather than sequential round-trips.
3. **Confidence Gating & Escalation:**
   - $\ge 0.80$: Execute autonomously without prompting.
   - $0.60 - 0.79$: Apply safe default or render a fast confirmation chip.
   - $< 0.60$: Escalate to heavier reasoning model or prompt the user.
4. **Code Owns Rules & Math, JEV Supplies Semantic Judgment:**
   - Calculations, point scoring, Regex, and PIN generators remain in deterministic code.
   - Human intent, layout slot picking, and AI bot personalities remain in JEV.
5. **Deterministic Local Matrix Fallback:**
   - Always maintain a calibrated local decision matrix in `jev-engine.ts` so the application never halts if offline or when API keys are absent.

---

## 4. Mandatory Real API Execution & Action Protocol
Whenever executing tasks governed by JEV:
1. **Open and inspect:**
   - `.agents/skills/jev-design/SKILL.md`
   - `apps/web/src/lib/jev-engine.ts`
   - `apps/web/src/lib/user.ts`
   - `apps/web/src/lib/sync.ts`
2. **Execute actual API call:**
   - Dispatch real request via `@typesafe-ai/sdk` (`client.systemOne(...)`) or run the decision script (`scripts/run_jev_kahoot_lobby.ts`).
   - Must send the actual request; do not skip or simulate.
3. **Report before edit:**
   - Report the opened files, functions called, and returned values with confidence ratings.
4. **Clean UI Constraint:**
   - Never render "JEV" or developer badges on public user-facing interfaces.
