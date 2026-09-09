import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================
// Types
// ============================================

export type ReasoningMode = 'token' | 'latent';
export type EvidenceType = 
  | 'LIVE_TOY_COMPUTATION' 
  | 'PRECOMPUTED_PUBLISHED_RESULT' 
  | 'PUBLISHED_RESULT'
  | 'REPORTED_BY_AUTHORS'
  | 'INDEPENDENTLY_EVALUATED'
  | 'TOY_PEDAGOGICAL'
  | 'ILLUSTRATIVE_DIAGRAM';

export interface GridPattern {
  grid: number[][];
  label: string;
}

export interface Demonstration {
  input: GridPattern;
  output: GridPattern;
}

export interface ExperimentConfig {
  // Core parameters
  recurrentDepth: number;        // 1-32
  stateDim: number;              // 16-128
  stateDecay: number;            // 0.5-1.0
  noiseLevel: number;            // 0.0-0.5
  interferenceLevel: number;     // 0.0-1.0
  
  // Task
  taskType: 'rotation' | 'translation' | 'flip' | 'composition';
  numDemos: number;              // 1-5
  
  // Token reasoning sim
  tokenSteps: number;            // 1-32 (simulated)
  
  // Random seed for reproducibility
  seed: number;
}

export interface ExperimentResult {
  // Ground truth
  groundTruth: GridPattern;
  
  // Token reasoning outputs
  tokenPrediction: GridPattern;
  tokenAccuracy: number;
  tokenStepsUsed: number;
  tokenComputeEstimate: number;
  tokenMemoryEstimate: number;
  tokenObservability: 'high' | 'medium' | 'low';
  
  // Latent reasoning outputs
  latentPrediction: GridPattern;
  latentAccuracy: number;
  latentStepsUsed: number;
  latentComputeEstimate: number;
  latentMemoryEstimate: number;
  latentObservability: 'high' | 'medium' | 'low';
  
  // Latent state trajectory (for visualization)
  stateTrajectory: number[][];  // [step][stateDim]
  stateChanges: number[];       // Magnitude of change per step
  
  // Metadata
  config: ExperimentConfig;
  timestamp: number;
  evidenceType: EvidenceType;
}

export interface RecurrentDepthResult {
  step: number;
  accuracy: number;
  prediction: GridPattern;
  confidence: number;
  stateChange: number;
  computeEstimate: number;
  stateVector: number[];
}

// ============================================
// Toy Model: Simple Recurrent Network for Grid Transformations
// ============================================

class ToyLatentReasoner {
  private state: Float32Array;
  private weights: Float32Array;  // [stateDim, stateDim]
  private inputWeights: Float32Array;  // [stateDim, inputDim]
  private outputWeights: Float32Array; // [outputDim, stateDim]
  private stateDim: number;
  private inputDim: number;
  private outputDim: number;
  private decay: number;
  private rng: SeededRNG;
  
  constructor(stateDim: number, inputDim: number, outputDim: number, seed: number) {
    this.stateDim = stateDim;
    this.inputDim = inputDim;
    this.outputDim = outputDim;
    this.decay = 0.9;
    this.rng = new SeededRNG(seed);
    
    // Initialize state
    this.state = new Float32Array(stateDim);
    
    // Xavier initialization for weights
    this.weights = new Float32Array(stateDim * stateDim);
    this.inputWeights = new Float32Array(stateDim * inputDim);
    this.outputWeights = new Float32Array(outputDim * stateDim);
    
    this.initWeights();
  }
  
  private initWeights(): void {
    const scaleW = Math.sqrt(2 / (this.stateDim + this.stateDim));
    const scaleIn = Math.sqrt(2 / (this.inputDim + this.stateDim));
    const scaleOut = Math.sqrt(2 / (this.stateDim + this.outputDim));
    
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] = this.rng.normal() * scaleW;
    }
    for (let i = 0; i < this.inputWeights.length; i++) {
      this.inputWeights[i] = this.rng.normal() * scaleIn;
    }
    for (let i = 0; i < this.outputWeights.length; i++) {
      this.outputWeights[i] = this.rng.normal() * scaleOut;
    }
  }
  
  setDecay(decay: number): void {
    this.decay = Math.max(0.1, Math.min(1.0, decay));
  }
  
  resetState(): void {
    this.state.fill(0);
  }
  
  // Encode grid pattern to input vector
  encodeInput(grid: number[][]): Float32Array {
    const flat = grid.flat();
    const input = new Float32Array(this.inputDim);
    for (let i = 0; i < Math.min(flat.length, this.inputDim); i++) {
      input[i] = flat[i] / 9.0;  // Normalize 0-9 to 0-1
    }
    return input;
  }
  
  // Decode state to grid prediction
  decodeOutput(): number[][] {
    const output = new Float32Array(this.outputDim);
    
    // Simple linear readout
    for (let i = 0; i < this.outputDim; i++) {
      let sum = 0;
      for (let j = 0; j < this.stateDim; j++) {
        sum += this.outputWeights[i * this.stateDim + j] * this.state[j];
      }
      output[i] = sum;
    }
    
    // Convert to 4x4 grid (16 outputs)
    const grid: number[][] = [];
    for (let r = 0; r < 4; r++) {
      const row: number[] = [];
      for (let c = 0; c < 4; c++) {
        const idx = r * 4 + c;
        const val = Math.round(Math.max(0, Math.min(9, output[idx] * 9)));
        row.push(val);
      }
      grid.push(row);
    }
    return grid;
  }
  
  // Single recurrent update step
  step(input: Float32Array, noiseLevel: number = 0): number {
    const newState = new Float32Array(this.stateDim);
    let totalChange = 0;
    
    for (let i = 0; i < this.stateDim; i++) {
      // Recurrent connection
      let sum = 0;
      for (let j = 0; j < this.stateDim; j++) {
        sum += this.weights[i * this.stateDim + j] * this.state[j];
      }
      
      // Input connection
      for (let j = 0; j < this.inputDim; j++) {
        sum += this.inputWeights[i * this.inputDim + j] * input[j];
      }
      
      // Apply decay and activation (ReLU)
      const newVal = Math.max(0, this.decay * this.state[i] + sum);
      newState[i] = newVal;
      totalChange += Math.abs(newVal - this.state[i]);
    }
    
    // Add noise
    if (noiseLevel > 0) {
      for (let i = 0; i < this.stateDim; i++) {
        newState[i] += this.rng.normal() * noiseLevel;
        newState[i] = Math.max(0, newState[i]);  // Keep non-negative
      }
    }
    
    this.state = newState;
    return totalChange;
  }
  
  // Run multiple recurrent steps
  reason(input: Float32Array, steps: number, noiseLevel: number = 0): { trajectory: number[][]; changes: number[] } {
    const trajectory: number[][] = [];
    const changes: number[] = [];
    
    for (let s = 0; s < steps; s++) {
      const change = this.step(input, noiseLevel);
      trajectory.push(Array.from(this.state));
      changes.push(change);
    }
    
    return { trajectory, changes };
  }
  
  getState(): Float32Array {
    return this.state;
  }
  
  // For demonstration memory: update state with demo pair
  updateWithDemo(inputGrid: number[][], outputGrid: number[][]): void {
    const input = this.encodeInput(inputGrid);
    const target = this.encodeInput(outputGrid);
    
    // Simple Hebbian-style update: state += η * input * target^T (simplified)
    const lr = 0.1;
    for (let i = 0; i < this.stateDim; i++) {
      let sum = 0;
      for (let j = 0; j < this.inputDim; j++) {
        sum += this.inputWeights[i * this.inputDim + j] * input[j];
      }
      this.state[i] = this.decay * this.state[i] + lr * sum;
    }
  }
}

// ============================================
// Seeded Random Number Generator
// ============================================

class SeededRNG {
  private seed: number;
  
  constructor(seed: number) {
    this.seed = seed >>> 0;
  }
  
  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) >>> 0;
    return this.seed / 0x100000000;
  }
  
  normal(): number {
    // Box-Muller transform
    const u1 = this.next();
    const u2 = this.next();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }
  
  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  
  reset(seed: number): void {
    this.seed = seed >>> 0;
  }
}

// ============================================
// Grid Task Generation
// ============================================

type TransformFn = (grid: number[][]) => number[][];

const TRANSFORMS: Record<string, TransformFn> = {
  rotation: (grid) => {
    const n = grid.length;
    const result: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        result[c][n - 1 - r] = grid[r][c];
      }
    }
    return result;
  },
  translation: (grid) => {
    const n = grid.length;
    const result: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
    const dr = 1, dc = 1;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const nr = (r + dr) % n;
        const nc = (c + dc) % n;
        result[nr][nc] = grid[r][c];
      }
    }
    return result;
  },
  flip: (grid) => {
    const n = grid.length;
    const result: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        result[r][n - 1 - c] = grid[r][c];
      }
    }
    return result;
  },
  composition: (grid) => {
    // Rotate then flip
    const rotated = TRANSFORMS.rotation(grid);
    return TRANSFORMS.flip(rotated);
  },
};

function generateRandomGrid(seed: number, size: number = 4): number[][] {
  const rng = new SeededRNG(seed);
  const grid: number[][] = [];
  for (let r = 0; r < size; r++) {
    const row: number[] = [];
    for (let c = 0; c < size; c++) {
      row.push(rng.int(0, 3));  // 4 colors
    }
    grid.push(row);
  }
  return grid;
}

function applyTransform(grid: number[][], transformName: string): number[][] {
  const fn = TRANSFORMS[transformName];
  if (!fn) return grid.map(r => [...r]);
  return fn(grid);
}

function gridsEqual(a: number[][], b: number[][]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].length !== b[i].length) return false;
    for (let j = 0; j < a[i].length; j++) {
      if (a[i][j] !== b[i][j]) return false;
    }
  }
  return true;
}

function gridAccuracy(pred: number[][], target: number[][]): number {
  let correct = 0;
  let total = 0;
  for (let i = 0; i < pred.length; i++) {
    for (let j = 0; j < pred[i].length; j++) {
      total++;
      if (pred[i][j] === target[i][j]) correct++;
    }
  }
  return total > 0 ? correct / total : 0;
}

// ============================================
// Token Reasoning Simulation
// ============================================

function simulateTokenReasoning(
  demos: Demonstration[],
  queryInput: number[][],
  groundTruth: number[][],
  tokenSteps: number,
  seed: number
): { prediction: number[][]; accuracy: number; computeEstimate: number; memoryEstimate: number } {
  const rng = new SeededRNG(seed + 1000);
  
  // Simulate token-based reasoning: more steps = more "thinking tokens"
  // In reality, this would be an LLM generating CoT
  // Here we simulate: with more tokens, accuracy improves but with diminishing returns
  
  // Base accuracy from demos (how well can we infer the rule?)
  let inferredAccuracy = 0;
  if (demos.length > 0) {
    // Check if demos are consistent
    const transformName = demos[0].output.label; // Hack: store transform in label
    let consistent = true;
    for (const demo of demos) {
      const predicted = applyTransform(demo.input.grid, transformName);
      if (!gridsEqual(predicted, demo.output.grid)) {
        consistent = false;
        break;
      }
    }
    inferredAccuracy = consistent ? 0.7 + 0.2 * Math.min(1, demos.length / 3) : 0.3;
  } else {
    inferredAccuracy = 0.1;
  }
  
  // Token steps improve accuracy (simulated CoT benefit)
  const tokenBoost = Math.min(0.3, tokenSteps * 0.02);
  const finalAccuracy = Math.min(0.95, inferredAccuracy + tokenBoost + rng.normal() * 0.05);
  
  // Generate prediction based on accuracy
  let prediction: number[][];
  if (rng.next() < finalAccuracy) {
    prediction = groundTruth.map(r => [...r]);
  } else {
    // Wrong prediction - apply wrong transform or noise
    const wrongTransforms = Object.keys(TRANSFORMS).filter(t => t !== demos[0]?.output.label);
    const wrongT = wrongTransforms[rng.int(0, wrongTransforms.length - 1)];
    prediction = applyTransform(queryInput, wrongT);
  }
  
  // Compute estimates (rough)
  const computeEstimate = tokenSteps * 50000; // FLOPs per token (very rough)
  const memoryEstimate = tokenSteps * 4096;   // KV cache growth per token
  
  return { prediction, accuracy: finalAccuracy, computeEstimate, memoryEstimate };
}

// ============================================
// Main Experiment Runner
// ============================================

export function runExperiment(config: ExperimentConfig): ExperimentResult {
  const { 
    recurrentDepth, stateDim, stateDecay, noiseLevel, interferenceLevel,
    taskType, numDemos, tokenSteps, seed 
  } = config;
  
  // Generate task
  const querySeed = seed + 1;
  const queryInput = generateRandomGrid(querySeed);
  const groundTruthGrid = applyTransform(queryInput, taskType);
  const groundTruth: GridPattern = { grid: groundTruthGrid, label: taskType };
  
  // Generate demonstrations
  const demos: Demonstration[] = [];
  for (let d = 0; d < numDemos; d++) {
    const demoInput = generateRandomGrid(seed + 100 + d * 10);
    const demoOutput = applyTransform(demoInput, taskType);
    demos.push({
      input: { grid: demoInput, label: taskType },
      output: { grid: demoOutput, label: taskType },
    });
  }
  
  // --- TOKEN REASONING (simulated) ---
  const tokenResult = simulateTokenReasoning(
    demos, queryInput, groundTruthGrid, tokenSteps, seed
  );
  
  // --- LATENT REASONING (actual computation) ---
  const reasoner = new ToyLatentReasoner(stateDim, 16, 16, seed + 2000);
  reasoner.setDecay(stateDecay);
  
  // Process demonstrations (update recurrent memory)
  for (const demo of demos) {
    reasoner.updateWithDemo(demo.input.grid, demo.output.grid);
  }
  
  // Add interference if specified
  if (interferenceLevel > 0) {
    const interferenceInput = generateRandomGrid(seed + 999);
    const interferenceOutput = generateRandomGrid(seed + 998);
    reasoner.updateWithDemo(interferenceInput, interferenceOutput);
  }
  
  // Encode query
  const queryEncoded = reasoner.encodeInput(queryInput);
  
  // Run recurrent reasoning
  const { trajectory, changes } = reasoner.reason(queryEncoded, recurrentDepth, noiseLevel);
  
  // Get prediction
  const latentPredictionGrid = reasoner.decodeOutput();
  const latentAccuracy = gridAccuracy(latentPredictionGrid, groundTruthGrid);
  
  // Compute estimates
  const latentComputeEstimate = recurrentDepth * stateDim * stateDim * 2; // Rough FLOPs
  const latentMemoryEstimate = stateDim * 4; // Fixed state size in bytes
  
  return {
    groundTruth,
    tokenPrediction: { grid: tokenResult.prediction, label: 'token' },
    tokenAccuracy: tokenResult.accuracy,
    tokenStepsUsed: tokenSteps,
    tokenComputeEstimate: tokenResult.computeEstimate,
    tokenMemoryEstimate: tokenResult.memoryEstimate,
    tokenObservability: 'high',
    
    latentPrediction: { grid: latentPredictionGrid, label: 'latent' },
    latentAccuracy,
    latentStepsUsed: recurrentDepth,
    latentComputeEstimate,
    latentMemoryEstimate,
    latentObservability: 'low',
    
    stateTrajectory: trajectory,
    stateChanges: changes,
    
    config,
    timestamp: Date.now(),
    evidenceType: 'LIVE_TOY_COMPUTATION',
  };
}

export function runRecurrentDepthSweep(config: ExperimentConfig): RecurrentDepthResult[] {
  const results: RecurrentDepthResult[] = [];
  const maxDepth = config.recurrentDepth;
  
  for (let depth = 1; depth <= maxDepth; depth++) {
    const depthConfig = { ...config, recurrentDepth: depth };
    const result = runExperiment(depthConfig);
    
    results.push({
      step: depth,
      accuracy: result.latentAccuracy,
      prediction: result.latentPrediction,
      confidence: result.latentAccuracy, // Simplified
      stateChange: result.stateChanges[depth - 1] || 0,
      computeEstimate: result.latentComputeEstimate,
      stateVector: result.stateTrajectory[depth - 1] || [],
    });
  }
  
  return results;
}

// ============================================
// Default Config
// ============================================

export const DEFAULT_CONFIG: ExperimentConfig = {
  recurrentDepth: 8,
  stateDim: 64,
  stateDecay: 0.9,
  noiseLevel: 0.05,
  interferenceLevel: 0,
  taskType: 'rotation',
  numDemos: 3,
  tokenSteps: 8,
  seed: 42,
};

// ============================================
// React Store for Experiment State
// ============================================

interface ExperimentState {
  config: ExperimentConfig;
  result: ExperimentResult | null;
  recurrentDepthResults: RecurrentDepthResult[] | null;
  isRunning: boolean;
  guidedStep: number;
  setConfig: (config: Partial<ExperimentConfig>) => void;
  runExperiment: () => void;
  runDepthSweep: () => void;
  setGuidedStep: (step: number) => void;
  reset: () => void;
}

export const useExperimentStore = create<ExperimentState>()(
  persist(
    (set, get) => ({
      config: DEFAULT_CONFIG,
      result: null,
      recurrentDepthResults: null,
      isRunning: false,
      guidedStep: 0,
      
      setConfig: (newConfig) => set({ config: { ...get().config, ...newConfig } }),
      
      runExperiment: () => {
        set({ isRunning: true });
        // Use requestAnimationFrame to not block UI
        requestAnimationFrame(() => {
          const result = runExperiment(get().config);
          set({ result, isRunning: false });
        });
      },
      
      runDepthSweep: () => {
        set({ isRunning: true });
        requestAnimationFrame(() => {
          const results = runRecurrentDepthSweep(get().config);
          set({ recurrentDepthResults: results, isRunning: false });
        });
      },
      
      setGuidedStep: (step) => set({ guidedStep: step }),
      
      reset: () => set({ 
        config: DEFAULT_CONFIG, 
        result: null, 
        recurrentDepthResults: null,
        guidedStep: 0 
      }),
    }),
    { name: 'latent-reasoning-lab-experiment' }
  )
);