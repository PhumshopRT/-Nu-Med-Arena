# Workspace Rules: JEV System One Maximum Efficiency Standard

This repository strictly implements TypeSafe's **JEV System One** as the primary technical decision-maker and gatekeeper. All agents and workflows must adhere to the following standards:

---

## 1. Architectural Role: Deterministic Layer Before LLM
- **System 1 (JEV):** Handles high-speed categorical choices (`choice`), probabilities (`noul`), and scoring (`score`) in 70–250ms.
- **Deterministic Code:** React components, TypeScript engines, MQTT sync, and state machines consume JEV's typed output directly.
- **System 2 (Generative LLMs):** Only invoked downstream for open-ended creative text or when JEV escalates.
- **Selection Over Generation:** Never generate raw HTML/CSS from scratch. JEV selects pre-verified slots (`NAV_SLOT`, `CONTENT_SLOT`, `THEME_SLOT`), and code renders them instantly.

---

## 2. Mandatory Real API Execution & Zero-Simulation Strict Protocol
- **Strict Real Upstream Usage Monitoring:** The user actively monitors the live TypeSafe Usage Dashboard (`input_tokens`, `output_tokens`, request IDs). All JEV System One queries MUST be transmitted over the wire directly to TypeSafe API (`https://api.typesafe.ai` / model `jev-1.13.0`).
- **Zero Simulation / Zero Mock Enforcement:** Under NO circumstances may an agent mock, fake, simulate, or bypass the real JEV API call. Faking API calls or claiming usage without an actual upstream network request is strictly prohibited.
- **Active Canonical Key Enforcement:** The client MUST use the active canonical API key (`REVOKED_KEY_REMOVED`) stored in `.env`, `.env.local`, and user environment. Any expired key (`REVOKED_KEY_REMOVED...`) must be rejected.
- **Token Usage Verification:** Every real API execution must log or verify returned usage: `[JEV Live API Usage] Model: jev-1.13.0 | Input Tokens: X | Output Tokens: Y` to confirm token registration on the upstream server.
- **Pre-Modification Protocol:** Before modifying any files related to JEV decision-making or game logic:
  1. Open and inspect: `.agents/skills/jev-design/SKILL.md`, `apps/web/src/lib/jev-engine.ts`, `apps/web/src/lib/user.ts`, `apps/web/src/lib/sync.ts`
  2. Execute actual API call via `@typesafe-ai/sdk` (`client.systemOne(...)`) or `scripts/run_jev_kahoot_lobby.ts`.
  3. Report opened files, functions called, and returned values with confidence ratings and token usage.
- **Clean UI Constraint:** Under no circumstances should "JEV" or developer evaluator badges be placed on public user-facing interfaces.

---

## 3. The 5 Efficiency Pillars
1. **Selection Over Generation:** Pre-built components in the registry, selected via typed Enums.
2. **Speculative Fan-Out:** Batch orthogonal questions into a single System One call (~100ms) rather than sequential round-trips.
3. **Confidence Gating & Escalation:**
   - $\ge 0.80$: Execute autonomously without asking.
   - $0.60 - 0.79$: Apply safe defaults or confirmation chip.
   - $< 0.60$: Escalate to heavier reasoning model or prompt user.
4. **Code Owns Exact Rules, JEV Supplies Judgment:**
   - Mathematics, score rules, Regex, and PIN generators remain in deterministic code.
   - Human intent, layout slot picking, and AI bot personality remain in JEV.
5. **Deterministic Local Matrix Fallback:**
   - `apps/web/src/lib/jev-engine.ts` must maintain a calibrated local decision matrix so localhost, offline play, and static exports run 100% reliably.
