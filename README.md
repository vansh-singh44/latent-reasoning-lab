# Latent Reasoning Lab

**DataForge 2026 × Pathway** — "Explain the Frontier"

An interactive educational platform teaching one precise technical concept:

> **"Some modern reasoning architectures can spend additional inference compute by repeatedly updating a latent/recurrent state instead of generating additional natural-language reasoning tokens; this can change the accuracy, latency, cost, and observability trade-offs of reasoning."**

---

## 🎯 Problem

Modern AI reasoning is dominated by **Chain-of-Thought (CoT)**: models "think" by generating more text tokens. But recent research shows reasoning can happen in **latent space** — repeatedly updating a hidden state without emitting intermediate tokens. This changes fundamental trade-offs around compute, memory, interpretability, and cost.

---

## 👥 Target Learner

**Technically curious ML practitioners** who understand:
- Basic linear algebra & neural networks
- Transformer intuition (tokens, context, attention)
- *No prior knowledge of latent reasoning required*

**Audience label shown in UI:**
> "Designed for ML learners who know the basics of neural networks but have never seen latent-space reasoning."

---

## 📜 Central Claim (Falsifiable)

> **"Reasoning compute does not have to appear as additional natural-language tokens: a recurrent architecture can repeatedly update a hidden state in latent space, so increasing recurrent depth can change task performance without producing a longer verbal chain-of-thought."**

**BDH-CQ refinement:**
> **"BDH-CQ combines in-context learning with recurrent latent reasoning: demonstrations update recurrent memory, and the model then performs iterative computation in latent space without verbalizing intermediate reasoning."**

---

## 📚 Prerequisites

- Basic linear algebra (vectors, matrices)
- Basic neural network concepts (layers, activations, backprop)
- Intuitive familiarity with tokens/context in LLMs
- **No prior knowledge of latent reasoning, BDH, or recurrent depth required**

---

## 🎓 Learning Objectives

After completing the lab, learners can:

1. **Explain** token reasoning vs latent reasoning
2. **Describe** what a recurrent latent update is
3. **Explain** why more latent steps = more compute
4. **Explain** why hidden reasoning is harder to observe
5. **Describe** how BDH-CQ uses demonstrations & recurrent memory
6. **Name at least one limitation** of latent reasoning

---

## 🏗️ Architecture

```
apps/latent-reasoning-lab/
├── src/
│   ├── app/                    # Next.js 14 App Router pages
│   │   ├── page.tsx            # Home — live experiment
│   │   ├── tokens/             # Think in Tokens
│   │   ├── latents/            # Think in Latents
│   │   ├── bdh/                # BDH / BDH-CQ
│   │   ├── experiments/        # All experiments
│   │   ├── evidence/           # Evidence Room
│   │   ├── failure-lab/        # Break the Reasoner
│   │   └── challenge/          # Challenge Yourself
│   ├── components/
│   │   ├── visualization/      # GridDisplay, StateVisualization, Charts
│   │   ├── controls/           # Slider, Toggle, Select, NumberInput
│   │   ├── layout/             # PageLayout, Navigation
│   │   └── research/           # EvidenceBadge
│   ├── lib/
│   │   ├── experiment.ts       # Toy model + experiment runner
│   │   └── utils.ts            # Formatting, colors, a11y helpers
│   └── styles/                 # Tailwind + globals.css
├── data/
│   ├── papers.json             # 9 research sources
│   └── published-results.json  # Benchmark numbers from papers
├── __tests__/                  # Vitest + React Testing Library
└── public/                     # Static assets
```

**Tech Stack:**
- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS (dark research-lab theme)
- **Visualization:** SVG + Canvas (D3-free, lightweight)
- **Computation:** Pure TypeScript in browser (<100ms)
- **State:** Zustand with persistence
- **Testing:** Vitest + React Testing Library

---

## 🔬 Live vs Precomputed vs Toy

| Badge | Meaning |
|-------|---------|
| 🟢 **LIVE TOY COMPUTATION** | Runs in your browser right now (deterministic, seeded) |
| 🔵 **PRECOMPUTED RESULT** | Precomputed from toy runs, saved as fixture |
| 🟡 **PUBLISHED RESULT** | Directly from cited paper (with citation) |
| 🟠 **REPORTED BY AUTHORS** | Claim from paper, not independently verified |
| 🟣 **TOY / PEDAGOGICAL** | Simplified simulation for teaching |
| 🟣 **ILLUSTRATIVE DIAGRAM** | Conceptual visualization, not computation |

**Every result in the lab is explicitly labeled.**

---

## 📖 Research Sources

### Primary Papers (5)

1. **Coconut** — Hao et al., 2024 (ICLR 2025) — `arXiv:2412.06769`
2. **Recurrent Depth** — Geiping et al., NeurIPS 2025 — `arXiv:2502.05171`
3. **TRM** — Jolicoeur-Martineau, 2025 — `arXiv:2510.04871`
4. **BDH** — Kosowski et al., 2025 — `arXiv:2509.26507`
5. **BDH-CQ** — Engdahl et al., 2026 — `arXiv:2608.09888`

### Pathway Explanatory Material (3)

6. **Why BDH Uses Brain-Inspired Architecture** — Pathway Blog, 2026
7. **From Attention to Synapses: Deriving BDH** — Pathway Blog, 2026
8. **What Emerges in Trained BDH Models** — Pathway Blog, 2026

---

## 🧪 Experiments

| ID | Title | Type | Key Interaction |
|----|-------|------|-----------------|
| **Home** | Live Mini-Lab | Guided + Sandbox | Thinking budget slider (1→32) |
| **A** | Tokens vs Latents | Comparison | Side-by-side at equal compute |
| **B** | Recurrent Depth | Sweep | Accuracy vs depth chart |
| **C** | Demo → Memory → Reason | BDH-CQ Flow | Add demos, watch memory update |
| **D** | Budget Laboratory | Allocation | Split compute: tokens/latent/memory/demos |
| **E** | Failure Lab | Break It | Noise, interference, saturation |

---

## ⚡ Quick Start

```bash
cd apps/latent-reasoning-lab
npm install
npm run dev
# Open http://localhost:3001
```

**Commands:**
- `npm run dev` — Development server (port 3001)
- `npm run build` — Production build
- `npm run start` — Production server
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript check
- `npm run test` — Run Vitest suite
- `npm run test:watch` — Watch mode

---

## ✅ Reproducibility

- **Fixed seed:** `42` for all experiments
- **Deterministic RNG:** LCG + Box-Muller (SeededRNG)
- **Reset button:** Restores exact initial state
- **Copy config:** JSON export of all parameters
- **No server computation:** Pure client-side TypeScript

---

## 🔍 Verification Checklist

- [ ] Toy model deterministic (same seed → same result)
- [ ] All evidence badges present and accurate
- [ ] Citations traceable to primary sources
- [ ] No toy animation presented as real model trace
- [ ] Limitations explicitly shown (Failure Lab)
- [ ] Accessibility: keyboard nav, ARIA, reduced motion
- [ ] Responsive: desktop, tablet, mobile
- [ ] Performance: <100ms parameter updates
- [ ] Rime voice: server-side only (not in repo)

---

## 📄 Submission Materials

| File | Description |
|------|-------------|
| `README.md` | This file |
| `ONE_PAGE_CONCEPT_SUMMARY.md` | 500-950 word summary |
| `AI_DISCLOSURE.md` | AI assistance documentation |
| `SOURCE_AND_LICENSES.md` | Source attribution & licenses |
| `RESEARCH_NOTES.md` | Detailed research synthesis |
| `ARCHITECTURE.md` | Technical architecture doc |

---

## 🏆 Credits

**Research:** Pathway, Meta FAIR, UMD, Samsung SAIL Montréal  
**Platform:** Built for DataForge 2026 Pathway Track  
**Design:** Research-lab aesthetic (dark, high information density)  

---

## 📜 License

MIT License — see `LICENSE` in repo root.

---

## 🤖 AI Assistance Disclosure

This platform was built with assistance from AI coding tools (see `AI_DISCLOSURE.md`). All research claims, citations, and educational design decisions were made by the human author. Toy model implementation, visualization components, and UI code were generated with AI assistance and reviewed for correctness.