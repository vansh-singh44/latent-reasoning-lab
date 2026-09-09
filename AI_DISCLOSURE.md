# AI Assistance Disclosure

## Overview

This project (Latent Reasoning Lab) was developed with assistance from AI coding tools. This document discloses the nature and extent of AI assistance per DataForge 2026 requirements.

## AI Tools Used

- **OpenCode (Nemotron-3-Ultra)** — Primary development agent for code generation, architecture decisions, and implementation
- **GitHub Copilot / similar** — Code completion and boilerplate generation

## Human vs AI Contributions

### Human-Authored (Decision & Design)
- **Research synthesis:** Paper selection, claim extraction, evidence classification, source-to-claim mapping
- **Educational design:** Learning objectives, learner journey, guided tour structure, quiz questions, failure modes
- **Scientific honesty framework:** Evidence badge system, labeling requirements, limitation disclosure
- **UI/UX decisions:** Dark research-lab aesthetic, information density, navigation structure, accessibility requirements
- **Central claim formulation:** Falsifiable one-sentence claim, BDH-CQ refinement
- **Experiment specification:** Variables, ranges, ground truth tasks, comparison metrics

### AI-Assisted (Implementation)
- **Next.js 14 project structure:** App router, TypeScript config, Tailwind setup
- **Component implementation:** All React components (visualization, controls, layout, research)
- **Toy model code:** `ToyLatentReasoner`, `SeededRNG`, grid transformations, experiment runner
- **Visualization components:** SVG-based GridDisplay, StateHeatmap, StateTrajectory, charts
- **Control components:** Slider, Toggle, Select, NumberInput, RadioGroup, ButtonGroup
- **Research components:** EvidenceBadge, EvidencePanel, EvidenceLegend
- **Chart components:** AccuracyComputeChart, AccuracyVsDepthChart, ComparisonTable, MetricCard
- **Page implementations:** Home, Tokens, Latents, BDH, Experiments, Evidence, Failure Lab, Challenge
- **Test suite:** Vitest setup, toy model determinism tests, component accessibility tests
- **Data files:** `papers.json`, `published-results.json` (formatted from human research)
- **Documentation:** README, ONE_PAGE_CONCEPT_SUMMARY, this disclosure, architecture notes

### Human-Reviewed & Verified
- All research citations and claims
- Toy model mathematical correctness
- Evidence classification accuracy
- Accessibility compliance (keyboard nav, ARIA, reduced motion)
- Performance characteristics (<100ms updates)
- No hallucinated benchmarks or fabricated results

## Specific AI-Generated Code Sections

```
src/lib/experiment.ts          → ToyLatentReasoner, SeededRNG, runExperiment, runRecurrentDepthSweep
src/components/visualization/  → GridDisplay, StateVisualization, Charts (all SVG/Canvas)
src/components/controls/       → Slider, Toggle, Select, NumberInput, RadioGroup, ButtonGroup
src/components/research/       → EvidenceBadge, EvidencePanel
src/components/layout/         → PageLayout, Navigation, TopBar
src/app/*/page.tsx             → All 8 page implementations
__tests__/*.test.ts            → Complete test suite
data/papers.json               → Formatted from human research notes
data/published-results.json    → Formatted from paper data extraction
```

## What AI Did NOT Do

- ❌ Select research papers or extract claims
- ❌ Design the educational narrative or learner journey
- ❌ Formulate the central falsifiable claim
- ❌ Decide evidence classification taxonomy
- ❌ Invent benchmark numbers (all from cited papers)
- ❌ Design failure modes or quiz questions
- ❌ Make scientific honesty judgments

## Verification Process

All AI-generated code was:
1. **Reviewed for correctness** against specifications
2. **Tested for determinism** (fixed seed → identical results)
3. **Validated against research sources** (no hallucinated claims)
4. **Checked for accessibility** (keyboard, ARIA, reduced motion)
5. **Performance tested** (<100ms parameter updates)

## Attribution

This disclosure follows the principle: **AI as implementation accelerator, human as scientific/educational author.** The research synthesis, educational design, and scientific integrity are entirely human-driven. AI assistance accelerated the translation of those decisions into working code.