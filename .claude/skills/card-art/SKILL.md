---
name: card-art
description: Specifications and constraints for NucMed Arena trading cards rendering.
---

# Card Art Design Specification

1. **Format**: All cards MUST be pure React components + inline SVG / HTML styling. Never use full-card generated raster images.
2. **Aspect Ratio & Geometry**:
   - Trading card standard ratio: **63 / 88** (e.g. 252px × 352px or 270px × 377px).
   - Card outer corner radius: **18px** (`rounded-[18px]`).
   - Inner card corner radius: **12px** to **14px**.
3. **Locked Palette**:
   - **RP (Radiopharmaceutical)**: `#2F6FED` (Accent pill `#2EB8E6`, light bg `#E8F1FF`)
   - **MECH (Mechanism)**: `#E6A100` (Header badge `#FEF3C7`, dark amber `#B45309`)
   - **CASE (Clinical Case)**: `#C81E33` (Question box `#EBF5FF`, badge `#FEE2E2`)
   - **CLUE (Target / Clue)**: `#0E8A58` (Hint box `#ECFDF5`, border `#A7F3D0`)
4. **Text Integrity**:
   - NEVER truncate important fields with `...` (ellipsis) or `line-clamp` on sample cards.
   - Use clean responsive typography down to 10px-11px so every field (Target, Transporter, Mechanism, Application, case prompt, bullets, hints) fits without overflowing.
5. **Nuclides & Chemistry**:
   - Always use proper superscripts for mass numbers (e.g., `¹⁸F-FDG`, `⁹⁹ᵐTc-MAA`, `¹²³I-NaI`, `¹³¹I`, `¹¹¹In-pentetreotide`).
   - Chemical notations must use correct valence states (e.g., `Na⁺/I⁻ symporter`).
6. **Organ Illustrations**:
   - Flat pastel medical vector style with clean SVG paths matching `card-prototype.jpg`.
   - Thyroid (T-03) MUST be drawn as the human neck/trachea with the classic butterfly-shaped thyroid gland (two lobes + central isthmus), never lungs.
