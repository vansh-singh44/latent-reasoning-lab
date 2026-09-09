# Latent Reasoning Lab — Technical Architecture

## Overview

Single-page application (Next.js 14 App Router) with client-side computation. All experiments run in-browser via TypeScript — no backend required for core functionality.

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 14 App Router                     │
├─────────────────────────────────────────────────────────────┤
│  Pages (App Router)                                          │
│  ├─ /              → Home (guided tour + live experiment)   │
│  ├─ /tokens        → Think in Tokens (CoT baseline)         │
│  ├─ /latents       → Think in Latents (recurrent depth)     │
│  ├─ /bdh           → BDH / BDH-CQ (architecture + pipeline) │
│  ├─ /experiments   → All experiments (A–E)                  │
│  ├─ /evidence      → Evidence Room (papers + results)       │
│  ├─ /failure-lab   → Break the Reasoner                     │
│  └─ /challenge     → Quiz + free response                   │
├─────────────────────────────────────────────────────────────┤
│  Shared Layout (PageLayout)                                 │
│  ├─ Navigation (left, fixed)                                │
│  ├─ TopBar (fixed)                                          │
│  └─ Main content (scrollable)                               │
└─────────────────────────────────────────────────────────────┘
```

## State Management

### Zustand Store (`useExperimentStore`)

```typescript
interface ExperimentState {
  config: ExperimentConfig;           // Current parameters
  result: ExperimentResult | null;    // Last run result
  recurrentDepthResults: RecurrentDepthResult[] | null; // Depth sweep
  isRunning: boolean;                 // Computation in progress
  guidedStep: number;                 // Guided tour progress
  
  // Actions
  setConfig: (partial) => void;
  runExperiment: () => void;
  runDepthSweep: () => void;
  setGuidedStep: (n) => void;
  reset: () => void;
}
```

**Persistence:** LocalStorage (key: `latent-reasoning-lab-experiment`)

**Computation:** Offloaded to `requestAnimationFrame` to avoid blocking UI.

---

## Toy Model Architecture

### `ToyLatentReasoner` Class

```typescript
class ToyLatentReasoner {
  // Dimensions
  stateDim: number;      // Hidden state size (default 64)
  inputDim: number;      // Input encoding size (16 for 4×4 grid)
  outputDim: number;     // Output decoding size (16 for 4×4 grid)
  
  // Weights (Xavier initialized)
  weights: Float32Array;        // [stateDim, stateDim] recurrent
  inputWeights: Float32Array;   // [stateDim, inputDim] input projection
  outputWeights: Float32Array;  // [outputDim, stateDim] readout
  
  // State
  state: Float32Array;          // Current hidden state
  decay: number;                // State retention (0.5–1.0)
  
  // RNG
  rng: SeededRNG;               // Deterministic randomness
}
```

### Forward Pass (Single Recurrent Step)

```
Input: x ∈ ℝ¹⁶ (encoded grid)
State: hₜ ∈ ℝ⁶⁴

hₜ₊₁ = ReLU( decay · hₜ + W_rec · hₜ + W_in · x + noise )

Output: ŷ = W_out · hₜ₊₁  → decode to 4×4 grid
```

### Demonstration Memory Update (Hebbian-style)

```
For each demo (x_demo, y_demo):
  h ← decay · h + η · W_in · encode(x_demo)  // Simplified Hebbian
```

---

## Visualization Pipeline

### GridDisplay (SVG)
- 4×4 or configurable size
- Categorical color scheme (10 colors)
- Diff highlighting vs ground truth
- Animated transitions (AnimatedGrid)

### StateVisualization
| Component | Purpose | Implementation |
|-----------|---------|----------------|
| StateHeatmap | 2D state matrix | SVG rects, Viridis colormap |
| StateTrajectory | Steps × Dimensions | SVG rects, time on X, dim on Y |
| StateVectorBars | 1D activation bars | CSS flex bars, height = activation |
| StateChangeChart | Δstate per step | SVG path + area, 280×120 |

### Charts
| Chart | Data | Type |
|-------|------|------|
| AccuracyComputeChart | Token vs Latent | Log-X scatter + lines |
| AccuracyVsDepthChart | Depth sweep | Line + confidence band |
| ComparisonTable | Property rows | HTML table |
| MetricCard | Single value | Styled card + badge |

---

## Controls System

All controls are **uncontrolled components** (state in Zustand):

| Control | Props | Accessibility |
|---------|-------|---------------|
| Slider | min, max, step, marks, unit | `role="slider"`, `aria-label`, keyboard |
| Toggle | label, description | `role="checkbox"`, focus visible |
| Select | options, error | `<label>` + `<select>` |
| NumberInput | min, max, step, unit | `type="number"`, `role="spinbutton"` |
| RadioGroup | options, orientation | `<fieldset>` + `<legend>` |
| ButtonGroup | options, icons | `role="group"` |

**Reduced Motion:** CSS media query disables all animations.

---

## Data Layer

### `data/papers.json`
9 entries with schema:
```typescript
interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  url: string;
  github?: string;
  centralClaim: string;
  evidenceType: string;
  relevantConcepts: string[];
  keyResults: { metric, value, condition }[];
  limitations: string[];
  whatItDoesNotDemonstrate: string[];
  evidenceLevel: 'FORMAL' | 'EXPERIMENTAL' | 'REPORTED_BY_AUTHORS' | 'EXPLANATORY' | 'DERIVATIONAL';
  conceptFamily: 'latent-reasoning' | 'bdh' | 'bdh-cq';
}
```

### `data/published-results.json`
Benchmark numbers extracted from papers:
- recurrentDepthSweep (6 points)
- coconutProsQA (7 points)
- coconutGSM8K (2 models)
- trmBenchmarks (4 tasks)
- bdhScaling (5 scales)
- bdhcqArcAgi (4 models)
- conceptArc (9 concepts)

---

## Experiment Modules

### Home (`/`)
- **Guided tour** (6 steps, 60 sec)
- **Live experiment** (3 columns: Input/Reasoning/Answer)
- **Thinking budget slider** (1→32, central control)
- **Mode toggle** (Token/Latent/Compare)
- **Real-time charts** (Accuracy vs Compute, Depth sweep)

### Tokens (`/tokens`)
- Token reasoning simulation (animated steps)
- KV cache growth visualization
- Memory characteristics panel

### Latents (`/latents`)
- State heatmap + vector bars
- Full trajectory heatmap (toggle summary/full)
- State change magnitude chart
- Recurrent depth sweep chart

### BDH (`/bdh`)
- Transformer vs BDH comparison flow
- Equation explorer (4 levels)
- BDH-CQ pipeline visualization
- Published results panel

### Experiments (`/experiments`)
- Experiment selector (A–E)
- Experiment A: Tokens vs Latents comparison
- Experiment B: Recurrent depth sweep
- Experiment C: Demo→Memory→Reasoning
- Experiment D: Budget Laboratory (original)
- Experiment E: Failure Lab entry point
- Global parameter controls

### Evidence (`/evidence`)
- Evidence legend
- Paper cards (all 9 sources)
- Published benchmark tables
- ConceptARC capability profile
- BDH scaling laws
- Reproducibility panel

### Failure Lab (`/failure-lab`)
- 6 preset failure modes (cards)
- Custom failure builder (4 sliders + selects)
- Live results for active failure
- Literature failure mode table

### Challenge (`/challenge`)
- 7 multiple-choice questions (reasoning, not recall)
- Immediate feedback with explanations
- Free-response explanation (300 char)
- Transparent rubric feedback
- Learning objectives checklist

---

## Performance Strategy

### Client-Side Computation
- **Toy model:** ~1-5ms per experiment run
- **Depth sweep:** ~10-30ms (32 runs)
- **All visualizations:** SVG/Canvas, no heavy libs

### Optimization
- `requestAnimationFrame` for non-blocking runs
- Zustand persistence (no re-computation on refresh)
- Memoized derivations (state trajectories)
- Lazy-loaded pages (Next.js default)

### Bundle Size
- **Target:** <200KB JS gzipped
- **No D3** (custom SVG)
- **No Chart.js** (custom charts)
- **Tree-shaken** lucide icons

---

## Accessibility

### Keyboard Navigation
- All interactive elements focusable
- Focus visible rings (2px lab-accent)
- Tab order logical (left nav → top bar → main)
- Slider arrow keys, Toggle space, Select arrows

### Screen Readers
- ARIA labels on all controls
- `role="img"` + `aria-label` on visualizations
- `aria-live="polite"` for dynamic results
- Evidence badges have descriptive labels

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

### Color
- Not color-only (patterns + labels + text)
- High contrast (WCAG AA minimum)
- Colorblind-safe palettes (Viridis, categorical)

---

## Rime Voice Integration (Optional)

**Architecture:** Server-side only
- `/api/voice/explain` → generates TTS for current concept
- `/api/voice/quiz` → generates TTS for quiz questions
- **Fallback:** Browser SpeechSynthesis API
- **Config:** Server-side env vars (not in repo)

**Not implemented in this repo** — placeholder for future enhancement.

---

## Testing Strategy

### Unit Tests (`__tests__/toy-model.test.ts`)
- SeededRNG determinism
- ToyLatentReasoner forward pass
- Grid transforms (rotation, translation, flip, composition)
- runExperiment determinism
- runRecurrentDepthSweep output structure

### Component Tests (`__tests__/components.test.tsx`)
- Control accessibility (ARIA, keyboard)
- Visualization rendering
- Evidence badge rendering
- Chart rendering

### Integration Tests (`__tests__/integration.test.tsx`)
- Page rendering
- Store structure
- Data file validation
- Evidence classification completeness

---

## Deployment

### Vercel (Recommended)
```bash
# Root directory: apps/latent-reasoning-lab
# Build command: npm run build
# Output: .next
# Port: 3001 (dev), 3000 (prod)
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Static Export (Optional)
```javascript
// next.config.mjs
output: 'export',
images: { unoptimized: true },
```

---

## Future Extensibility

### Adding New Experiments
1. Add config params to `ExperimentConfig`
2. Create page in `src/app/new-exp/`
3. Add to `EXPERIMENTS` array in Experiments page
4. Add evidence classification

### Adding New Papers
1. Add entry to `data/papers.json`
2. Add benchmark data to `data/published-results.json`
3. Reference in relevant page components

### Adding New Visualizations
1. Create component in `src/components/visualization/`
2. Follow SVG/Canvas pattern
3. Add accessibility attributes

### Server-Side Features
- Rime TTS endpoints (`/api/voice/*`)
- Experiment persistence (database)
- User progress tracking
- Collaborative experiments

---

## Security Considerations

- **No user input eval** — all params validated
- **No external API calls** in core (Rime optional, server-side)
- **CSP compatible** — no inline scripts/styles
- **No secrets in client** — Rime keys server-only
- **Deterministic computation** — no timing side channels