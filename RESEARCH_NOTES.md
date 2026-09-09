# Research Notes — Latent Reasoning Lab

## Synthesis Methodology

### Source Selection Criteria
1. **Primary research papers** (peer-reviewed or reputable preprint)
2. **Official Pathway explanatory material** for BDH/BDH-CQ
3. **Recent** (2024-2026) — captures current frontier
4. **Directly relevant** to: latent reasoning, recurrent depth, BDH, BDH-CQ, recursive reasoning
5. **Diverse evidence types:** formal, experimental, reported, explanatory

### Excluded Sources
- Blog summaries (unless official Pathway)
- YouTube explanations
- SEO content farms
- Unverified social media claims

---

## Paper-by-Paper Deep Dive

### 1. Coconut (Hao et al., 2024)

**Core Mechanism:**
```
Standard LLM:  h_t = Transformer(E_t) → token_{t+1} = softmax(W h_t)
Coconut:       h_t = Transformer(E_t) → E_{t+1} = h_t  (continuous thought)
```

**Key Insight:** Continuous thoughts represent **multiple alternative next steps in superposition** → enables BFS over reasoning paths vs CoT's single trajectory commitment.

**Training:** Multi-stage curriculum (inspired by iCoT):
- Stage 0: Standard CoT training
- Stage k: Replace first k CoT tokens with continuous thoughts
- Mix data from all stages (p=0.3) to prevent forgetting

**Results:**
- ProsQA (GPT-2): 54.2% (CoT) → 67.8% (Coconut k=4)
- GSM8K: Llama 3.2-3B: 26.0% → 31.7%; Llama 3-8B: 42.2% → 43.6%
- **Limitation:** Training instability when adding 3+ continuous thoughts at once; larger models benefit less

**Concept for Lab:** "Continuous thought" = hidden state fed back as next input. Directly maps to our latent recurrent update.

---

### 2. Recurrent Depth (Geiping et al., NeurIPS 2025)

**Architecture:** Depth-recurrent transformer with shared block applied *r* times.
- Random *r* sampled during training (1 to max_depth)
- At inference: choose *r* for compute budget

**Results (3.5B params, 800B tokens):**
| Task | r=1 | r=32 |
|------|-----|------|
| ARC-Challenge | 34.1% | 42.3% |
| GSM8K | 22.4% | 58.7% |
| HumanEval | 18.3% | 34.1% |
| MMLU | 48.2% | 55.4% |
| Mastermind | 12.5% | 48.9% |

**Emergent Behaviors:**
- **Adaptive compute:** Easy tasks (SciQ, BLiMP) converge at r≈1; hard tasks need r≈32
- **Path independence:** Different recurrence paths converge to similar states
- **Zero-shot abilities:** Speculative decoding, KV-cache sharing, per-token adaptive compute
- **Latent rotations:** Model rotates shapes in latent space for arithmetic

**Limitations:** Not dominant paradigm; oversight concerns vs CoT; convergence analysis incomplete.

**Concept for Lab:** **Recurrent depth slider** directly mirrors *r* parameter. Accuracy vs depth chart replicates their Figure 1.

---

### 3. TRM (Jolicoeur-Martineau, 2025)

**Insight:** HRM's hierarchy is unnecessary. Single tiny network + two state variables suffices.

**Architecture:**
- **y** = solution state (output prediction)
- **z** = memory state (reasoning trace)
- Single 2-layer MLP updates both recursively

**Results:**
| Benchmark | HRM (27M) | TRM (7M) |
|-----------|-----------|----------|
| ARC-AGI-1 | 40% | **45%** |
| ARC-AGI-2 | 5% | **8%** |
| Sudoku-Extreme | 55% | **87%** |
| Maze-Hard | 75% | **85%** |

**Key Finding:** Two latent variables (y, z) optimal; more hurts. EMA critical for stability. Optimal recursion: T=3, n=6 (42 total).

**Concept for Lab:** Minimal recurrent state (solution + memory). Our toy model uses single state vector but demonstrates same principle.

---

### 4. BDH (Kosowski et al., 2025)

**Core Thesis:** Transformer attention can be **re-derived as local graph dynamics** on a scale-free neuron-synapse network.

**Derivation Path:**
1. Standard attention: `Attention(Q,K,V) = softmax(QK^T/√d)V`
2. Rewrite as: `ρ = Σ V_τ K_τ^T` (synaptic state)
3. Factor: `V = E a`, `Q = F a` (low-rank, a = neuron activations)
4. Apply ReLU: sparse positive activations
5. Add decay: `ρ_t = U ρ_{t-1} + V_t K_t^T` (Hebbian + decay)
6. **Result:** Local message passing on neuron graph → global attention emerges

**BDH-GPU (Practical):**
- Neurons: n-dimensional vectors (n = model dim)
- Synapses: n×n matrix (fixed size!)
- Activations: sparse ReLU (≈5% non-zero)
- Communication: low-rank (E, F matrices)
- **Matches Transformer scaling laws** at 10M-1B params

**Emergent Properties (Chapter 3):**
- Scale-free connectivity (power-law degree distribution)
- Monosemantic synapses (individual synapses track concepts)
- Modular organization (functional clusters)
- Uniform sharding (add neurons without rewiring)

**Equations of Reasoning:** Closed-form local dynamics at neurons/synapses (Table 1, Eq 6).

**Concept for Lab:** BDH module shows derivation from attention → synapses. Equation explorer layers intuition → simple math → BDH equations → full formalism.

---

### 5. BDH-CQ (Engdahl et al., 2026)

**Architecture:** BDH + in-context learning interface.

**Pipeline:**
```
Demonstrations D = {(x_t, y_t)}_{t=1}^K
    ↓ (sequential processing)
Recurrent Memory: S_t = U_θ(S_{t-1}, D_t)
    ↓
Query x*
    ↓
Latent Reasoning Loop: S*_τ = V_θ(S*_{τ-1}, x*)
    ↓
Answer: decode(S*_T)
```

**Key Separation:** Two distinct channels
- **MEMORY UPDATE:** Demonstrations → recurrent state (Hebbian-like)
- **REASONING COMPUTATION:** Query → latent iterations (no tokens)

**Results:**
- ARC-AGI-1 public: 29.5% pass@2, 24.25% pass@1
- Cost: $0.00070/task (150M params, H200 @ $3/hr)
- **57× cheaper than GPT-5.6 Luna (Low)** at comparable accuracy

**ConceptARC Profile:**
| Concept | BDH-CQ | Baseline |
|---------|--------|----------|
| Propagation | 78% | 45% |
| Copying | 82% | 52% |
| Dense Mappings | 71% | 38% |
| Rotation | 58% | 41% |
| Relocation | 54% | 39% |
| Composition | 31% | 18% |
| Ordering | 22% | 15% |
| Nesting | 19% | 12% |
| Conditional | 16% | 10% |

**Limitations:** Composition, ordering, nesting, conditional rules, unseen params.

**Concept for Lab:** Experiment C implements toy version: add demos → watch memory update → run latent reasoning → decode answer. Published results panel shows real BDH-CQ numbers.

---

## Cross-Paper Concept Map

| Concept | Coconut | Recurrent Depth | TRM | BDH | BDH-CQ |
|---------|---------|-----------------|-----|-----|--------|
| Latent state as reasoning | ✓ (continuous thought) | ✓ (recurrent block) | ✓ (y, z) | ✓ (neuron acts) | ✓ (recurrent mem) |
| Recurrent depth scaling | ✓ (k continuous thoughts) | ✓ (r=1→32) | ✓ (T, n recursion) | ~ (fixed depth) | ✓ (latent loop) |
| In-context learning | ✗ | ✗ | ✗ | ~ (synaptic mem) | ✓ (demo→mem) |
| Fixed memory size | ✗ (context grows) | ✓ (fixed block) | ✓ (fixed y,z) | ✓ (fixed synapses) | ✓ (fixed recurrent) |
| Observability | Low (probes needed) | Low (probes needed) | Low | Medium (synapse graphs) | Low |
| Bio-inspiration | Low | Low | Medium (HRM) | **High** | High |

---

## Evidence Classification Decisions

| Display | Classification | Rationale |
|---------|----------------|-----------|
| Home hero animation | ILLUSTRATIVE | Conceptual, not computed |
| Home live experiment | LIVE TOY | Runs in browser, deterministic |
| Experiment A charts | LIVE TOY | Computed from toy model |
| Experiment B sweep | LIVE TOY | Real toy measurements |
| Experiment C memory | LIVE TOY | Toy recurrent memory |
| BDH-CQ published panel | PUBLISHED | Direct from Engdahl et al. 2026 |
| BDH scaling laws | PUBLISHED | Direct from Kosowski et al. 2025 |
| Coconut ProsQA | PUBLISHED | Direct from Hao et al. 2024 |
| Recurrent Depth GSM8K | PUBLISHED | Direct from Geiping et al. 2025 |
| TRM benchmarks | PUBLISHED | Direct from Jolicoeur-Martineau 2025 |
| Evidence Room cards | REPORTED BY AUTHORS | Summarized from papers |
| Failure Lab outcomes | LIVE TOY | Toy model pushed to limits |

---

## Toy Model Design Decisions

### Why This Toy Model?
- **Minimal:** Linear recurrent + ReLU (not Transformer)
- **Deterministic:** SeededRNG (LCG + Box-Muller)
- **Fast:** <10ms per experiment in browser
- **Interpretable:** State dimension visible, changes measurable
- **Task:** 4×4 grid transforms (rotation/translation/flip/composition) — visually verifiable

### What It Captures
- Recurrent depth → accuracy curve (diminishing returns)
- State trajectory evolution (heatmap over steps)
- Memory update from demonstrations (Hebbian-style)
- Noise/interference/dimension failure modes

### What It Does NOT Capture
- Transformer attention mechanics
- Language modeling
- Real BDH synaptic dynamics
- Training dynamics (only inference)
- Scale effects (64D vs 1M+ params)

### Honest Labeling
Every toy result labeled **LIVE TOY COMPUTATION** or **TOY / PEDAGOGICAL**. Never presented as real model behavior.

---

## Failure Mode Taxonomy (from Literature + Toy Discovery)

| Failure Mode | Source | Toy Reproduction |
|--------------|--------|------------------|
| State saturation | Recurrent Depth (convergence analysis) | High depth + high decay → Δstate → 0 |
| Oscillation | Recurrent Depth (path independence) | Low decay + specific init → cycling state |
| Catastrophic forgetting | BDH-CQ (interference expts) | Many demos + high interference → early demos lost |
| Noise amplification | Coconut (training instability) | High noise + high depth → accuracy degrades |
| Dimension bottleneck | TRM (state dim ablation) | Low state_dim + complex task → accuracy ceiling |
| Composition failure | BDH-CQ (ConceptARC) | Composition task → low accuracy even at high depth |

---

## Open Questions (Not Addressed in Lab)

1. **Why does recursion help so much?** (TRM paper's open question)
2. **Can latent reasoning scale to language generation?** (BDH does LM; Coconut does reasoning; unified?)
3. **What's the optimal memory/reasoning split?** (BDH-CQ separates; Budget Lab explores)
4. **How to interpret latent states at scale?** (Probes? Monosemanticity? BDH's synapse graphs?)
5. **Can we combine token + latent reasoning?** (Coconut hybrid approach)
6. **Recurrent depth at 100B+ params?** (Only tested to 3.5B)
7. **BDH-CQ on language tasks?** (Only ARC visual reasoning evaluated)