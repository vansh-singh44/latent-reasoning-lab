# Latent Reasoning Lab — One-Page Concept Summary

## The Core Idea

**How can an AI "think more" without saying more?**

Modern AI reasoning is dominated by Chain-of-Thought (CoT): models "think" by generating more text tokens. But a growing body of research shows that reasoning can happen in **latent space** — by repeatedly updating a hidden state vector without emitting intermediate natural-language tokens. This architectural shift changes fundamental trade-offs around compute efficiency, memory usage, latency, and observability.

---

## Technical Mechanism

### Token-Based Reasoning (Status Quo)
- **Intermediate representation:** Text tokens appended to context
- **Additional compute:** Generate more tokens (linear context growth)
- **Memory:** KV cache grows O(context × hidden_dim)
- **Observability:** High — human-readable reasoning trace
- **Limitation:** Context window bounds; quadratic attention cost

### Latent Recurrent Reasoning (Emerging Paradigm)
- **Intermediate representation:** Hidden state vector *h* ∈ ℝⁿ
- **Additional compute:** Recurrent update *h*ₜ₊₁ = f(*h*ₜ, *x*) for *T* steps
- **Memory:** Fixed-size state O(*n*²) independent of reasoning depth
- **Observability:** Low — requires probes/visualization tools
- **Advantage:** Unbounded reasoning depth; adaptive compute; KV-cache sharing

### Key Research Foundations

| Paper | Core Contribution |
|-------|-------------------|
| **Coconut** (Hao et al., 2024) | Feed last hidden state as next input embedding ("continuous thought"); enables BFS-like search over reasoning paths |
| **Recurrent Depth** (Geiping et al., NeurIPS 2025) | Depth-recurrent transformer scales test-time compute: 3.5B model, GSM8K 22%→59% (r=1→32) |
| **TRM** (Jolicoeur-Martineau, 2025) | Single 2-layer net (7M params) achieves 45% ARC-AGI-1 via recursive refinement |
| **BDH** (Kosowski et al., 2025) | Reorganizes attention as synaptic memory in scale-free neuron graph; fixed-size state |
| **BDH-CQ** (Engdahl et al., 2026) | Demonstrations update recurrent memory → query solved by latent iteration; 29.5% ARC-AGI-1 at $0.0007/task |

---

## Why It Matters

### Compute Efficiency
Latent reasoning decouples **reasoning depth** from **context length**. A model can spend arbitrary test-time compute (recurrent steps) without growing its KV cache. This enables:
- **Adaptive compute:** Easy problems exit early; hard problems iterate longer
- **Speculative decoding & KV-cache sharing** (Recurrent Depth paper)
- **Cost reduction:** BDH-CQ achieves 57× cheaper inference than GPT-5.6 Luna at comparable accuracy

### Memory Architecture
- **Transformers:** External growing cache (KV cache)
- **Latent/BDH:** Internal fixed-size state (synaptic/recurrent memory)
- **Implication:** Effectively infinite context within information capacity bounds

### Observability Trade-off
The central tension: **visible reasoning tokens = human interpretable** but **compute-expensive**; **hidden state updates = compute-efficient** but **require tooling to inspect**. This is not a bug — it's a fundamental Pareto frontier shift.

---

## BDH & BDH-CQ Connection

**BDH (Dragon Hatchling)** re-derives attention from biologically inspired principles:
- Neurons = computational units with sparse positive activations
- Synapses = connections carrying Hebbian-updated memory
- Attention emerges from **local message passing** on a scale-free graph
- GPU-friendly formulation (BDH-GPU) matches Transformer scaling laws

**BDH-CQ** adds in-context learning:
1. **Demonstrations** sequentially update recurrent synaptic state
2. **Query** processed through iterative latent reasoning loop
3. **Answer** decoded from final state — no intermediate tokens verbalized

This is the first architecture to **unify in-context learning with recurrent latent reasoning** in a single coherent system.

---

## Evidence

| Claim | Evidence Level | Source |
|-------|----------------|--------|
| Latent reasoning enables BFS over reasoning paths | **Experimental** | Coconut (ProsQA: 67.8% vs 54.2% CoT) |
| Test-time compute scales with recurrent depth | **Experimental** | Recurrent Depth (GSM8K 22%→59%, r=1→32) |
| Tiny recursive nets solve hard puzzles | **Experimental** | TRM (7M params, 45% ARC-AGI-1) |
| Attention = synaptic memory in local graph | **Formal + Experimental** | BDH (scaling laws, graph emergence) |
| Demos → recurrent memory → latent reasoning | **Experimental** | BDH-CQ (29.5% ARC-AGI-1, $0.0007/task) |

---

## Limitations (Honest Labeling)

1. **Diminishing returns:** More recurrent steps ≠ always better (saturation, oscillation)
2. **Observability gap:** Hidden states require probes; no free lunch on interpretability
3. **Memory fragility:** Recurrent memory overwritten by new demos; interference catastrophically corrupts
4. **State capacity ceiling:** Fixed dimension bounds representational capacity
5. **Training instability:** Coconut needs careful curriculum; recurrent depth needs random depth sampling
6. **Task specificity:** TRM needs task-tuned architectures; BDH-CQ struggles with composition/ordering

> **Key insight from Failure Lab:** "More compute is not the same thing as more intelligence."

---

## Why Interactive Artifact > Prose

| Prose | Latent Reasoning Lab |
|-------|---------------------|
| Static claim | **Manipulate** recurrent depth slider → **observe** accuracy/compute/state change |
| "Hidden state updates" | **Watch** 64D state trajectory heatmap evolve over 32 steps |
| "Demos update memory" | **Add** demonstrations → **see** memory heatmap change → **run** query |
| "Trade-offs exist" | **Allocate** fixed budget across tokens/latent/memory/demos → **compare** |
| "Limitations exist" | **Break** the reasoner: noise, interference, saturation, low dimension |

The lab makes the **substrate** of the concept directly manipulable. Learners don't read about the accuracy/compute trade-off — they **move the slider and watch the Pareto frontier shift in real time**.

---

## Reproducibility & Honesty

- **Toy model:** 64D linear recurrent + ReLU (browser, <100ms, deterministic seed=42)
- **Every result labeled:** LIVE TOY / PUBLISHED / ILLUSTRATIVE / TOY
- **No fake animations:** All visualizations driven by actual computation or explicit paper data
- **Citations traceable:** Every claim linked to primary source
- **Limitations explicit:** Failure Lab shows 6 breaking regimes

---

## Conclusion

Latent reasoning is not "better than CoT" — it's a **different computational organization** with distinct trade-offs. The Latent Reasoning Lab teaches this one idea completely: **reasoning compute can live in recurrent state updates rather than token generation, and this changes the Pareto frontier of AI reasoning systems.** From Coconut's continuous thoughts to BDH's synaptic memory to BDH-CQ's demonstration-driven latent reasoning, the frontier is moving from *saying more* to *thinking deeper*.