# Sources and Licenses

## Research Papers (Primary Sources)

| Paper | Authors | Year | Venue | License/Access |
|-------|---------|------|-------|----------------|
| Coconut: Training LLMs to Reason in Continuous Latent Space | Hao et al. | 2024 | arXiv:2412.06769 / ICLR 2025 | arXiv perpetual non-exclusive |
| Scaling Test-Time Compute with Latent Reasoning | Geiping et al. | 2025 | NeurIPS 2025 / arXiv:2502.05171 | arXiv perpetual non-exclusive |
| Less is More: Recursive Reasoning with Tiny Networks | Jolicoeur-Martineau | 2025 | arXiv:2510.04871 | arXiv perpetual non-exclusive |
| The Dragon Hatchling: Missing Link Transformer/Brain | Kosowski et al. | 2025 | arXiv:2509.26507 | arXiv perpetual non-exclusive |
| BDH-CQ: In-Context Learning with Recurrent Latent Reasoning | Engdahl et al. | 2026 | arXiv:2608.09888 | arXiv perpetual non-exclusive |

**Usage:** Cited for claims, benchmark numbers, and conceptual foundations. All numbers reproduced from published tables/figures with citation. No redistribution of paper PDFs.

## Pathway Explanatory Material (Secondary Sources)

| Material | URL | Access Date | License |
|----------|-----|-------------|---------|
| Why BDH Uses Brain-Inspired Architecture | pathway.com/research/bdh-explainer/brain-inspired-ai-architecture | 2026-09-08 | Pathway Research Blog (CC-BY implied) |
| From Attention to Synapses: Deriving BDH | pathway.com/research/bdh-explainer/bdh-architecture-derivation | 2026-09-08 | Pathway Research Blog |
| What Emerges in Trained BDH Models | pathway.com/research/bdh-explainer/emergent-properties | 2026-09-08 | Pathway Research Blog |
| Introducing BDH-CQ | pathway.com/research/introducing-bdh-cq | 2026-09-08 | Pathway Research Blog |

**Usage:** Conceptual explanations, derivation walkthroughs, design requirements. Paraphrased with attribution.

## Code Dependencies (Runtime)

| Package | Version | License | Purpose |
|---------|---------|---------|---------|
| next | 14.2.15 | MIT | React framework |
| react | 18.3.1 | MIT | UI library |
| react-dom | 18.3.1 | MIT | React renderer |
| d3 | 7.9.0 | BSD-3-Clause | Visualization utilities (minimal) |
| clsx | 2.1.1 | MIT | Class name utility |
| tailwind-merge | 2.5.4 | MIT | Tailwind class merging |
| lucide-react | 0.453.0 | ISC | Icons |
| framer-motion | 11.11.9 | MIT | Animations |
| zod | 3.23.8 | MIT | Schema validation |
| zustand | 4.5.0 | MIT | State management |

## Development Dependencies

| Package | Version | License |
|---------|---------|---------|
| typescript | 5.6.3 | Apache-2.0 |
| tailwindcss | 3.4.14 | MIT |
| postcss | 8.4.47 | MIT |
| autoprefixer | 10.4.20 | MIT |
| eslint | 8.57.1 | MIT |
| eslint-config-next | 14.2.15 | MIT |
| vitest | 2.1.4 | MIT |
| @testing-library/react | 16.0.1 | MIT |
| @testing-library/jest-dom | 6.6.3 | MIT |
| jsdom | 25.0.1 | MIT |

## Fonts (Google Fonts API)

| Font | License |
|------|---------|
| IBM Plex Sans | SIL Open Font License 1.1 |
| IBM Plex Mono | SIL Open Font License 1.1 |
| Space Grotesk | SIL Open Font License 1.1 |

**Loaded via:** `fonts.googleapis.com` (preconnect in layout.tsx)

## Asset Licenses

- **No external images, icons, or media used** — all visualizations are programmatic (SVG/Canvas)
- **Lucide icons** — ISC license (included via lucide-react)
- **No stock photography or AI-generated imagery**

## Project License

**MIT License** — see root `LICENSE` file.

```
MIT License

Copyright (c) 2026 Latent Reasoning Lab Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Attribution Requirements

When using or adapting this platform:

1. **Cite the research papers** for any claims reproduced from them
2. **Attribute Pathway** for BDH/BDH-CQ explanatory material
3. **Preserve evidence badges** — do not present toy results as published results
4. **Include this SOURCE_AND_LICENSES.md** in redistributions
5. **Respect arXiv licenses** for paper content (perpetual non-exclusive, no redistribution of PDFs)

## No Conflicting Licenses

All dependencies are permissive (MIT, BSD, ISC, Apache-2.0, SIL OFL). No GPL, AGPL, or copyleft dependencies.