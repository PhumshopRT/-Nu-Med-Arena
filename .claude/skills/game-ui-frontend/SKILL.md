---
name: game-ui-frontend
description: Design UI surfaces for browser games. Use when the user asks for HUDs, menus, overlays, responsive layouts, or visual direction that must protect the playfield.
---

# Game UI Frontend

## Overview

Use this skill whenever the game needs a visible interface layer. The job is not to produce generic dashboard UI. The job is to produce a readable, thematic browser-game interface that supports the play experience.

Default assumption: build the game world in canvas or WebGL, and build text-heavy UI in DOM.

## Frontend Standards

Establish visual direction before coding.

- Genre and fantasy

- Material language

- Typography

- Palette

- Motion tone

- Use CSS variables for the UI theme.

Build clear hierarchy.

- Critical combat or survival information first

- Secondary tools second

- Rarely used settings behind menus or drawers

Protect the playfield first, especially in 3D.

- The initial screen should feel playable within a few seconds.

- Default to one primary persistent HUD cluster and at most one small secondary cluster.

- Keep the center of the playfield clear during normal play.

- Keep the lower-middle playfield mostly clear during normal play.

- Put lore, field notes, quest details, and long control lists behind drawers, toggles, or pause surfaces.

- Prefer contextual prompts and transient hints over permanent boxed panels.

Keep overlays readable over motion.

- Use backing panels, edge treatment, contrast, and restrained blur where needed.

- Design for both desktop and mobile from the start.

Design 3D UI around camera and input control boundaries.

- Pause or gate camera-control input when menus, dialogs, or pointer-driven UI are active.

- Keep pointer-lock, drag-to-look, and menu interaction states explicit.

## 3D Starter Defaults

For exploration, traversal, or third-person starter scaffolds, prefer this UI budget:

- one compact objective chip or status strip at the edge

- one transient controls hint or interaction prompt

- one optional collapsible secondary surface such as a journal, map, or quest log

Do not open every informational surface on first load. The scene should be readable before the user opens any deeper UI.

As a default implementation constraint for 3D browser games:

- no always-on full-width header plus multi-card body plus full-width footer layout

- no large center-screen or lower-middle overlays during normal movement

- no more than roughly 20-25% of the viewport covered by persistent HUD on desktop unless the user explicitly requests a denser layout

- on mobile, collapse to a narrow stack or contextual chips before covering the playfield with larger panels

## Prompting Rules

When asking the model to design or implement game UI, include:

- the game fantasy

- the camera or viewpoint

- the player verbs

- the HUD layers

- the camera or control mode when the game is 3D

- the tone of motion

- desktop and mobile expectations

- playfield protection and disclosure strategy

- explicit anti-patterns to avoid

Use `../../references/frontend-prompts.md` for concrete prompt shapes.

## Motion Rules

- Prefer a few meaningful transitions over constant micro-animation.

- Reserve strong motion for state change, reward, danger, and onboarding.

- Respect reduced-motion settings for non-essential animation.

- Keep 3D HUD motion from competing with camera motion.

## What Good Looks Like

- HUD elements are legible without flattening the scene.

- Menus feel native to the game world, not like a SaaS admin panel.

- Layout adapts cleanly across breakpoints.

- Pointer, keyboard, and game-state feedback are obvious.

- In 3D games, menu and HUD states do not fight camera control or pointer-lock.

- In 3D games, the first playable view keeps most of the viewport available for movement, aiming, and spatial reading.

- Persistent information density is low enough that screenshots still read as game scenes, not UI comps.

## Anti-Patterns

- Generic app dashboard layouts

- Flat placeholder styling with no theme

- Default font stacks without intent

- Dense overlays that obscure the playfield

- Large title cards or multi-paragraph notes sitting over a live playable scene

- Equal-weight boxed panels distributed around every edge of the viewport

- Controls, objectives, notes, and lore all expanded at once on first load

- Full-width top-and-bottom chrome with large always-on center or body panels in 3D play

- Excessive motion on every element

- Canvas-only UI when DOM would be clearer and cheaper

- Forcing HUD controls into the 3D scene when standard DOM would be clearer

- Letting camera input remain active under modals or inventory panels

## References

- Shared architecture: `../web-game-foundations/SKILL.md`

- Prompt recipes: `../../references/frontend-prompts.md`

- Low-chrome 3D layout patterns: `../../references/three-hud-layout-patterns.md`

- React-hosted 3D UI context: `../react-three-fiber-game/SKILL.md`

- Playtest review: `../../references/playtest-checklist.md`

27:["$","div",null,{"className":"min-h-screen max-w-6xl mx-auto px-4 py-2 sm:py-12 sm:px-6 lg:px-8","children":[["$","script",null,{"type":"application/ld+json","dangerouslySetInnerHTML":{"__html":"{\"@context\":\"https://schema.org\",\"@type\":\"SoftwareApplication\",\"name\":\"game-ui-frontend\",\"description\":\"Design UI surfaces for browser games. Use when the user asks for HUDs, menus, overlays, responsive layouts, or visual direction that must protect the playfield.\",\"url\":\"https://www.skills.sh/openai/plugins/game-ui-frontend\",\"applicationCategory\":\"DeveloperApplication\",\"operatingSystem\":\"Cross-platform\",\"publisher\":{\"@type\":\"Organization\",\"name\":\"openai\",\"url\":\"https://www.skills.sh/openai\"},\"offers\":{\"@type\":\"Offer\",\"price\":\"0\",\"priceCurrency\":\"USD\"},\"interactionStatistic\":{\"@type\":\"InteractionCounter\",\"interactionType\":\"https://schema.org/InstallAction\",\"userInteractionCount\":57}}"}}],["$","script",null,{"type":"application/ld+json","dangerouslySetInnerHTML":{"__html":"{\"@context\":\"https://schema.org\",\"@type\":\"BreadcrumbList\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Skills\",\"item\":\"https://www.skills.sh\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"openai\",\"item\":\"https://www.skills.sh/openai\"},{\"@type\":\"ListItem\",\"position\":3,\"name\":\"plugins\",\"item\":\"https://www.skills.sh/openai/plugins\"},{\"@type\":\"ListItem\",\"position\":4,\"name\":\"game-ui-frontend\",\"item\":\"https://www.skills.sh/openai/plugins/game-ui-frontend\"}]}"}}],["$","main",null,{"children":[["$","nav",null,{"aria-label":"Breadcrumb","className":"mb-6 flex min-w-0 items-center gap-2 text-sm text-(--ds-gray-600)","children":[["$","$L3",null,{"href":"/","className":"shrink-0 hover:text-foreground","children":"skills"}],[["$","$1","/openai:0",{"children":[["$","span",null,{"aria-hidden":"true","className":"shrink-0","children":"/"}],["$","$L3",null,{"href":"/openai","className":"min-w-0 truncate hover:text-foreground","children":"openai"}]]}],["$","$1","/openai/plugins:1",{"children":[["$","span",null,{"aria-hidden":"true","className":"shrink-0","children":"/"}],["$","$L3",null,{"href":"/openai/plugins","className":"min-w-0 truncate hover:text-foreground","children":"plugins"}]]}],["$","$1",":2",{"children":[["$","span",null,{"aria-hidden":"true","className":"shrink-0","children":"/"}],["$","span",null,{"className":"min-w-0 truncate text-(--ds-gray-600)","children":"game-ui-frontend"}]]}]]]}],["$","h1",null,{"className":"text-4xl font-semibold text-foreground mb-2 tracking-tight","children":"game-ui-frontend"}],false,"$undefined",["$","div",null,{"className":"grid grid-cols-1 lg:grid-cols-12 gap-16","children":[["$","div",null,{"className":"lg:col-span-9 min-w-0 overflow-hidden","children":[["$","div",null,{"className":"my-10","children":["$","$L2f",null,{"label":"Installation","command":"npx skills add https://github.com/openai/plugins --skill game-ui-frontend","prompt":"Run `npx skills use \"https://github.com/openai/plugins\" --skill \"game-ui-frontend\"` and follow the generated skill instructions now. Read its complete output, redirecting it to a temporary file first if necessary. Resolve relative paths from the supporting-files directory it provides."}]}],null,["$","div",null,{"className":"bg-background","children":[["$","div",null,{"className":"flex items-center gap-2 text-sm font-mono text-white mb-4 pb-4 border-b border-border","children":["$","span",null,{"children":"SKILL.md"}]}],false,["$","$L30",null,{"previewHtml":"# Game UI Frontend

\n## Overview

\nUse this skill whenever the game needs a visible interface layer. The job is not to produce generic dashboard UI. The job is to produce a readable, thematic browser-game interface that supports the play experience.

\nDefault assumption: build the game world in canvas or WebGL, and build text-heavy UI in DOM.

\n## Frontend Standards

","restHtml":"$31","proseClassName":"prose prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-4xl prose-h1:mb-2 prose-h2:text-2xl prose-h2:mb-2 prose-h3:text-lg prose-h3:mb-2 prose-p:text-muted-foreground prose-li:text-muted-foreground prose-code:bg-muted prose-code:text-foreground prose-code:px-1 prose-code:py-0.5 prose-code:rounded-sm prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:text-foreground prose-pre:border prose-pre:border-border prose-pre:rounded-md [&_table]:!border-[color:var(--border)] [&_th]:!border-[color:var(--border)] [&_td]:!border-[color:var(--border)]"}]]}],false]}],"$L32"]}]]}]]}]
33:I[233650,["/_next/static/immutable/chunks/1-d_4hcs8did5.js","/_next/static/immutable/chunks/0ugqy0hfn8pzy.js","/_next/static/immutable/chunks/1iv8g77zll1c3.js","/_next/static/immutable/chunks/05ibr6udxyg_a.js"],"InstallSparkline"]
32:["$","div",null,{"className":" lg:col-span-3","children":[["$","div",null,{"className":"bg-background pb-8","children":[["$","div",null,{"className":"text-sm font-mono uppercase text-white mb-2","children":["$","span",null,{"children":"Installs"}]}],["$","div",null,{"className":"text-3xl font-semibold font-mono tracking-tight text-foreground","children":"57"}],["$","$L33",null,{"values":[1,3,5,6,8,11,0,6],"className":"group/sparkline mt-5 h-12 w-40","width":160,"height":48}]]}],["$","div",null,{"className":"bg-background py-8","children":[["$","div",null,{"className":"flex items-center gap-1.5 text-sm font-mono uppercase text-white mb-2","children":[["$","span",null,{"children":"Repository"}],["$","span",null,{"title":"Verified organization on GitHub","children":["$","svg",null,{"dangerouslySetInnerHTML":{"__html":""},"viewBox":"0 0 16 16","height":16,"width":16,"data-slot":"geist-icon","style":{"color":"currentColor"},"className":"h-3.5 w-3.5 text-(--ds-blue-700)","aria-label":"Verified organization on GitHub"}]}]]}],["$","a",null,{"href":"https://github.com/openai/plugins","target":"_blank","rel":"ugc nofollow noopener noreferrer","className":"text-sm font-mono text-foreground hover:underline break-all","title":"openai/plugins","children":"openai/plugins"}]]}],["$","div",null,{"className":"bg-background py-8","children":[["$","div",null,{"className":"text-sm font-mono uppercase text-white mb-2","children":["$","span",null,{"children":"GitHub Stars"}]}],["$","div",null,{"className":"flex items-center gap-1.5 text-sm font-mono text-foreground","children":[["$","svg",null,{"dangerouslySetInnerHTML":{"__html":""},"viewBox":"0 0 16 16","height":16,"width":16,"data-slot":"geist-icon","style":{"color":"currentColor"},"className":"h-4 w-4 text-(--ds-amber-700)"}],["$","span",null,{"children":"7.2K"}]]}]]}],["$","div",null,{"className":"bg-background py-8","children":[["$","div",null,{"className":"text-sm font-mono uppercase text-white mb-2","children":["$","span",null,{"children":"First Seen"}]}],["$","div",null,{"className":"text-sm font-mono text-foreground","children":"Apr 25, 2026"}]]}],["$","div",null,{"className":"bg-background py-8","children":[["$","div",null,{"className":"text-sm font-mono uppercase text-white mb-3","children":"Security Audits"}],["$","div",null,{"className":"divide-y divide-border","children":[["$","$L3","agent-trust-hub",{"href":"/openai/plugins/game-ui-frontend/security/agent-trust-hub","className":"block py-2 hover:bg-muted/40 -mx-3 px-3 rounded transition-colors border-0","children":["$","div",null,{"className":"flex items-center justify-between mb-1","children":[["$","span",null,{"className":"text-sm font-medium text-foreground truncate","children":"Gen Agent Trust Hub"}],["$","span",null,{"className":"text-xs font-mono uppercase px-2 py-1 rounded bg-green-500/10 text-green-500","children":"Pass"}]]}]}],["$","$L3","socket",{"href":"/openai/plugins/game-ui-frontend/security/socket","className":"block py-2 hover:bg-muted/40 -mx-3 px-3 rounded transition-colors border-0","children":"$L34"}],"$L35"]}]]}],false]}]
34:["$","div",null,{"className":"flex items-center justify-between mb-1","children":[["$","span",null,{"className":"text-sm font-medium text-foreground truncate","children":"Socket"}],["$","span",null,{"className":"text-xs font-mono uppercase px-2 py-1 rounded bg-green-500/10 text-green-500","children":"Pass"}]]}]
35:["$","$L3","snyk",{"href":"/openai/plugins/game-ui-frontend/security/snyk","className":"block py-2 hover:bg-muted/40 -mx-3 px-3 rounded transition-colors border-0","children":["$","div",null,{"className":"flex items-center justify-between mb-1","children":[["$","span",null,{"className":"text-sm font-medium text-foreground truncate","children":"Snyk"}],["$","span",null,{"className":"text-xs font-mono uppercase px-2 py-1 rounded bg-green-500/10 text-green-500","children":"Pass"}]]}]}]
"])

Establish visual direction before coding.

- Genre and fantasy

- Material language

- Typography

- Palette

- Motion tone

- Use CSS variables for the UI theme.

Build clear hierarchy.

- Critical combat or survival information first

- Secondary tools second

- Rarely used settings behind menus or drawers

Protect the playfield first, especially in 3D.

- The initial screen should feel playable within a few seconds.

- Default to one primary persistent HUD cluster and at most one small secondary cluster.

- Keep the center of the playfield clear during normal play.

- Keep the lower-middle playfield mostly clear during normal play.

- Put lore, field notes, quest details, and long control lists behind drawers, toggles, or pause surfaces.

- Prefer contextual prompts and transient hints over permanent boxed panels.

Keep overlays readable over motion.

- Use backing panels, edge treatment, contrast, and restrained blur where needed.

- Design for both desktop and mobile from the start.

Design 3D UI around camera and input control boundaries.

- Pause or gate camera-control input when menus, dialogs, or pointer-driven UI are active.

- Keep pointer-lock, drag-to-look, and menu interaction states explicit.

## 3D Starter Defaults

For exploration, traversal, or third-person starter scaffolds, prefer this UI budget:

- one compact objective chip or status strip at the edge

- one transient controls hint or interaction prompt

- one optional collapsible secondary surface such as a journal, map, or quest log

Do not open every informational surface on first load. The scene should be readable before the user opens any deeper UI.

As a default implementation constraint for 3D browser games:

- no always-on full-width header plus multi-card body plus full-width footer layout

- no large center-screen or lower-middle overlays during normal movement

- no more than roughly 20-25% of the viewport covered by persistent HUD on desktop unless the user explicitly requests a denser layout

- on mobile, collapse to a narrow stack or contextual chips before covering the playfield with larger panels

## Prompting Rules

When asking the model to design or implement game UI, include:

- the game fantasy

- the camera or viewpoint

- the player verbs

- the HUD layers

- the camera or control mode when the game is 3D

- the tone of motion

- desktop and mobile expectations

- playfield protection and disclosure strategy

- explicit anti-patterns to avoid

Use `../../references/frontend-prompts.md` for concrete prompt shapes.

## Motion Rules

- Prefer a few meaningful transitions over constant micro-animation.

- Reserve strong motion for state change, reward, danger, and onboarding.

- Respect reduced-motion settings for non-essential animation.

- Keep 3D HUD motion from competing with camera motion.

## What Good Looks Like

- HUD elements are legible without flattening the scene.

- Menus feel native to the game world, not like a SaaS admin panel.

- Layout adapts cleanly across breakpoints.

- Pointer, keyboard, and game-state feedback are obvious.

- In 3D games, menu and HUD states do not fight camera control or pointer-lock.

In 3D games, the first pla
