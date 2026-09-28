---
name: splash-layout
description: Layout rules and screen-zoning constraints for NucMed Arena splash page.
---

# Splash Layout Constraints

1. **Master Viewport & Grid Zoning (1440×900 baseline, responsive down to 1180×820)**:
   - Screen is divided into 5 distinct non-overlapping zones:
     - `[ sky 0–58% ]`: Logo + Subtitle upper center (unobstructed). Mascots in a single row below subtitle and strictly ABOVE the PLAY button.
     - `[ deck 58–100% ]`: Green 3D PLAY button centered on the wooden deck horizon. Secondary action buttons below PLAY. Credits plaque at bottom.
     - `[ cards-left ]`: x 24–210, two cards arranged vertically, rotation strictly between -6° and +6°.
     - `[ cards-right ]`: x 1230–1416, two cards arranged vertically, rotation strictly between -6° and +6°.
2. **Stacking & Z-Index Hierarchy**:
   - Background canvas: `z-0`
   - Wooden deck / counters: `z-1`
   - Floating cards: `z-10`
   - Mascots: `z-20`
   - Buttons & Interactive modals: `z-30`+
3. **No Overlap Rules**:
   - Floating cards MUST NOT enter the center zone ($x = 430\text{px}$ to $1010\text{px}$).
   - Left cards (R-01 and M-03) MUST NOT overlap each other or the center wooden sign.
   - Right cards (C-05 and T-03) MUST NOT overlap each other or the center wooden sign.
   - Mascots MUST NOT drop below or stand inside the top boundary of the PLAY button.
   - Character name tags MUST sit in dedicated 22px height pill containers under their feet without being clipped by the wooden deck or PLAY button.
4. **Card Rotation & Viewport Bounds**:
   - Card container `overflow` must be `visible` so rotated corners are not abruptly cropped.
   - On narrower viewports ($< 1100\text{px}$), cards scale down (e.g. `scale-80` to `scale-85`) or tuck into sides cleanly.
5. **No Text Truncation**:
   - No `line-clamp` or `truncate` that cuts required scientific card content on the splash cards.
   - Typography scales dynamically down to 10–11px if required to guarantee zero text loss.
