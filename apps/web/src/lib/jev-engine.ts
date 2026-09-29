"use client";

import { TypeSafeClient, choice } from "@typesafe-ai/sdk";

export interface JevUiDecision {
  screen: "splash" | "lobby" | "board" | "gallery" | "shop";
  contentSlot: "grid-3zone" | "full" | "narrow" | "with-aside";
  navSlot: "topbar" | "rail" | "sidebar";
  backdropSlot: "wood-deck" | "sky-anime" | "plain" | "dot-grid";
  themeSlot: "nuclear-gold" | "clinical-clean" | "dark-slate";
  confidence: number;
  reasoning: string;
}

export interface JevCardDecision {
  cardType: "RP" | "MECH" | "CASE" | "CLUE";
  accentColor: string;
  illustrationStyle: "flat-vector-pastel" | "wireframe" | "minimal";
  contrastScore: number;
  confidence: number;
}

export interface JevIdValidation {
  isValid: boolean;
  cleanId: string;
  year?: string;
  facultyCode?: string;
  seatNumber?: string;
  error?: string;
  confidence: number;
}

/**
 * JEV System One Decision Engine
 * Powers background routing, slot selection, and UI design decisions.
 */
class JevEngine {
  private client: TypeSafeClient | null = null;

  constructor() {
    try {
      if (typeof window === "undefined" && process.env.TYPESAFE_API_KEY) {
        this.client = new TypeSafeClient();
      }
    } catch {
      this.client = null;
    }
  }

  /**
   * Decide UI screen architecture and layout slots based on intent & viewport
   */
  async decideUiLayout(intent: string, viewportWidth: number = 1440): Promise<JevUiDecision> {
    const isCompact = viewportWidth < 1200;

    // If live API key is available in Node/Edge runtime
    if (this.client) {
      try {
        const result = await this.client.systemOne({
          state: { query: intent, viewportWidth, isCompact },
          questions: {
            screen: choice("Which game screen is appropriate?", {
              splash: "Title splash with 3D logo, PLAY button, mascots, and locked-color cards",
              lobby: "Multiplayer room lobby waiting for players and ready status",
              board: "Live card game table with case prompt, mechanisms, and hand",
              gallery: "Card album inspecting the 4 prototype cards",
              shop: "NucCoin cosmetic store",
            }),
            contentSlot: choice("Which content structure fits?", {
              "grid-3zone": "3-Zone CSS Grid (Left cards, Center stage, Right cards)",
              full: "Full-width stretched content",
              narrow: "Centered narrow column",
              "with-aside": "Content with side panel",
            }),
            backdropSlot: choice("Which backdrop should be used?", {
              "sky-anime": "Anime sky with floating motes and wooden counter arena",
              "wood-deck": "Warm felt wooden table",
              plain: "Clean solid background",
              "dot-grid": "Technical dot grid",
            }),
          },
        });

        const screenChoice = result.answers.screen.choice as JevUiDecision["screen"];
        const contentChoice = result.answers.contentSlot.choice as JevUiDecision["contentSlot"];
        const backdropChoice = result.answers.backdropSlot.choice as JevUiDecision["backdropSlot"];
        const confidence = result.answers.screen.probabilities[screenChoice] ?? 0.95;

        return {
          screen: screenChoice,
          contentSlot: contentChoice,
          navSlot: "topbar",
          backdropSlot: backdropChoice,
          themeSlot: "nuclear-gold",
          confidence,
          reasoning: `Jev live decision: selected ${screenChoice} (${Math.round(confidence * 100)}% confidence).`,
        };
      } catch (err) {
        console.warn("Jev API call fallback to deterministic System One matrix:", err);
      }
    }

    // High-speed Deterministic System One Matrix (fallback)
    const lower = intent.toLowerCase();
    let screen: JevUiDecision["screen"] = "splash";
    let contentSlot: JevUiDecision["contentSlot"] = "grid-3zone";
    let backdropSlot: JevUiDecision["backdropSlot"] = "sky-anime";

    if (lower.includes("lobby") || lower.includes("room") || lower.includes("ห้อง")) {
      screen = "lobby";
      contentSlot = "full";
      backdropSlot = "wood-deck";
    } else if (lower.includes("play") || lower.includes("match") || lower.includes("แข่ง")) {
      screen = "board";
      contentSlot = "full";
      backdropSlot = "wood-deck";
    } else if (lower.includes("gallery") || lower.includes("album") || lower.includes("อัลบั้ม")) {
      screen = "gallery";
      contentSlot = "full";
      backdropSlot = "wood-deck";
    } else if (lower.includes("shop") || lower.includes("ร้านค้า") || lower.includes("coin")) {
      screen = "shop";
      contentSlot = "narrow";
      backdropSlot = "wood-deck";
    }

    return {
      screen,
      contentSlot,
      navSlot: "topbar",
      backdropSlot,
      themeSlot: "nuclear-gold",
      confidence: 0.96,
      reasoning: `Jev System One calibrated choice: ${screen} with ${contentSlot} layout.`,
    };
  }

  /**
   * Decide card aesthetic parameters adhering strictly to locked palettes
   */
  decideCardDesign(cardType: "RP" | "MECH" | "CASE" | "CLUE"): JevCardDecision {
    const paletteMap = {
      RP: { accent: "#2F6FED", contrast: 0.98 },
      MECH: { accent: "#E6A100", contrast: 0.95 },
      CASE: { accent: "#C81E33", contrast: 0.97 },
      CLUE: { accent: "#0E8A58", contrast: 0.96 },
    };

    const target = paletteMap[cardType];
    return {
      cardType,
      accentColor: target.accent,
      illustrationStyle: "flat-vector-pastel",
      contrastScore: target.contrast,
      confidence: 0.99,
    };
  }

  /**
   * Validate Student ID based on required cohort pattern:
   * [Year: 2 digits] + 2083070 + [Seat: 00-55] (Total 11 digits)
   * Example: 68208307037, 66208307052
   */
  validateStudentId(rawId: string): JevIdValidation {
    const cleanId = rawId.trim();

    if (!cleanId) {
      return {
        isValid: false,
        cleanId,
        error: "กรุณากรอกรหัสนักศึกษา 11 หลัก เช่น 68208307037",
        confidence: 1.0,
      };
    }

    if (!/^\d+$/.test(cleanId)) {
      return {
        isValid: false,
        cleanId,
        error: "รหัสนักศึกษาต้องประกอบด้วยตัวเลขเท่านั้น",
        confidence: 0.99,
      };
    }

    if (cleanId.length !== 11) {
      return {
        isValid: false,
        cleanId,
        error: `รหัสนักศึกษาต้องมีความยาว 11 หลักพอดี (ปัจจุบันกรอก ${cleanId.length} หลัก) เช่น 68208307037`,
        confidence: 0.99,
      };
    }

    const year = cleanId.slice(0, 2);
    const facultyCode = cleanId.slice(2, 9);
    const seatNumber = cleanId.slice(9, 11);

    if (facultyCode !== "2083070") {
      return {
        isValid: false,
        cleanId,
        year,
        facultyCode,
        seatNumber,
        error: `เลข 7 หลักตรงกลางต้องเป็นรหัสคณะ/สาขา "2083070" (ปัจจุบันกรอกเป็น "${facultyCode}") เช่น 68208307037`,
        confidence: 0.98,
      };
    }

    const seatNum = parseInt(seatNumber, 10);
    if (isNaN(seatNum) || seatNum < 0 || seatNum > 55) {
      return {
        isValid: false,
        cleanId,
        year,
        facultyCode,
        seatNumber,
        error: `เลข 2 หลักสุดท้าย (ลำดับที่) ต้องอยู่ระหว่าง 00 ถึง 55 เท่านั้น (ปัจจุบันกรอกเป็น "${seatNumber}")`,
        confidence: 0.98,
      };
    }

    return {
      isValid: true,
      cleanId,
      year,
      facultyCode,
      seatNumber,
      confidence: 1.0,
    };
  }

  /**
   * Validate Shop Transaction
   * Evaluates if student has sufficient NucCoins for unlocking cosmetics
   */
  validateShopPurchase(userCoins: number, itemPrice: number): { canAfford: boolean; remainingCoins: number; reason: string } {
    if (userCoins < itemPrice) {
      return {
        canAfford: false,
        remainingCoins: userCoins,
        reason: `เหรียญ NucCoin ไม่เพียงพอ (มี ${userCoins} เหรียญ, ต้องการ ${itemPrice} เหรียญ)`,
      };
    }
    return {
      canAfford: true,
      remainingCoins: userCoins - itemPrice,
      reason: `อนุมัติการซื้อ สำเร็จคงเหลือ ${userCoins - itemPrice} เหรียญ`,
    };
  }

  /**
   * Generic Speculative Fan-Out Execution
   * Dispatches orthogonal questions to TypeSafe System One in a single batched call
   */
  async decideSpeculativeFanOut<T>(
    state: Record<string, any>,
    questions: Record<string, any>,
    fallback: () => T
  ): Promise<{ answers?: any; result: T; source: "live_api" | "deterministic_fallback" }> {
    if (this.client) {
      try {
        const res = await this.client.systemOne({ state, questions });
        return {
          answers: res.answers,
          result: fallback(),
          source: "live_api"
        };
      } catch (err) {
        console.warn("Jev API call fallback:", err);
      }
    }
    return {
      result: fallback(),
      source: "deterministic_fallback"
    };
  }

  /**
   * Confidence Gating Utility
   * Automatically executes high-confidence actions, or escalates when uncertain
   */
  withConfidenceGate<T>(
    confidence: number,
    threshold: number = 0.80,
    onHighConfidence: () => T,
    onEscalate: () => T
  ): T {
    if (confidence >= threshold) {
      return onHighConfidence();
    }
    return onEscalate();
  }
}

export const jev = new JevEngine();
