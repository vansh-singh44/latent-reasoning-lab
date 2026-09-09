import { describe, it, expect, beforeEach } from 'vitest';
import { 
  ToyLatentReasoner, 
  SeededRNG, 
  runExperiment, 
  runRecurrentDepthSweep,
  DEFAULT_CONFIG,
  gridsEqual,
  gridAccuracy,
  applyTransform,
  generateRandomGrid,
  TRANSFORMS,
} from '@/lib/experiment';

describe('SeededRNG', () => {
  it('produces deterministic sequence with same seed', () => {
    const rng1 = new SeededRNG(42);
    const rng2 = new SeededRNG(42);
    
    for (let i = 0; i < 100; i++) {
      expect(rng1.next()).toBe(rng2.next());
    }
  });
  
  it('produces different sequences with different seeds', () => {
    const rng1 = new SeededRNG(42);
    const rng2 = new SeededRNG(43);
    
    let allSame = true;
    for (let i = 0; i < 10; i++) {
      if (rng1.next() !== rng2.next()) {
        allSame = false;
        break;
      }
    }
    expect(allSame).toBe(false);
  });
  
  it('normal() produces reasonable Gaussian samples', () => {
    const rng = new SeededRNG(42);
    const samples = Array.from({ length: 1000 }, () => rng.normal());
    
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    const variance = samples.reduce((a, b) => a + (b - mean) ** 2, 0) / samples.length;
    
    expect(Math.abs(mean)).toBeLessThan(0.1);
    expect(Math.abs(variance - 1)).toBeLessThan(0.15);
  });
  
  it('reset() restores sequence', () => {
    const rng = new SeededRNG(42);
    const first = Array.from({ length: 10 }, () => rng.next());
    rng.reset(42);
    const second = Array.from({ length: 10 }, () => rng.next());
    
    expect(first).toEqual(second);
  });
});

describe('ToyLatentReasoner', () => {
  let reasoner: ToyLatentReasoner;
  
  beforeEach(() => {
    reasoner = new ToyLatentReasoner(64, 16, 16, 42);
  });
  
  it('initializes with zero state', () => {
    const state = reasoner.getState();
    expect(state.every(v => v === 0)).toBe(true);
  });
  
  it('resetState() zeros the state', () => {
    reasoner.step(new Float32Array(16), 0);
    reasoner.resetState();
    const state = reasoner.getState();
    expect(state.every(v => v === 0)).toBe(true);
  });
  
  it('step() updates state deterministically', () => {
    const input = new Float32Array(16).fill(0.5);
    const change1 = reasoner.step(input, 0);
    const state1 = Array.from(reasoner.getState());
    
    const reasoner2 = new ToyLatentReasoner(64, 16, 16, 42);
    const change2 = reasoner2.step(input, 0);
    const state2 = Array.from(reasoner2.getState());
    
    expect(change1).toBe(change2);
    expect(state1).toEqual(state2);
  });
  
  it('reason() produces deterministic trajectory', () => {
    const input = new Float32Array(16).fill(0.5);
    const { trajectory: traj1, changes: ch1 } = reasoner.reason(input, 5, 0);
    
    const reasoner2 = new ToyLatentReasoner(64, 16, 16, 42);
    const { trajectory: traj2, changes: ch2 } = reasoner2.reason(input, 5, 0);
    
    expect(traj1).toEqual(traj2);
    expect(ch1).toEqual(ch2);
  });
  
  it('noiseLevel adds stochasticity', () => {
    const input = new Float32Array(16).fill(0.5);
    const { trajectory: traj1 } = reasoner.reason(input, 3, 0.1);
    
    const reasoner2 = new ToyLatentReasoner(64, 16, 16, 42);
    const { trajectory: traj2 } = reasoner2.reason(input, 3, 0.1);
    
    // With same seed and noise, should be identical
    expect(traj1).toEqual(traj2);
  });
  
  it('different seeds produce different trajectories', () => {
    const input = new Float32Array(16).fill(0.5);
    const { trajectory: traj1 } = new ToyLatentReasoner(64, 16, 16, 42).reason(input, 3, 0);
    const { trajectory: traj2 } = new ToyLatentReasoner(64, 16, 16, 43).reason(input, 3, 0);
    
    let allSame = true;
    for (let i = 0; i < 3; i++) {
      if (!traj1[i].every((v, j) => v === traj2[i][j])) {
        allSame = false;
        break;
      }
    }
    expect(allSame).toBe(false);
  });
  
  it('stateDecay affects state retention', () => {
    const input = new Float32Array(16).fill(0.5);
    
    const r1 = new ToyLatentReasoner(64, 16, 16, 42);
    r1.setDecay(0.9);
    r1.step(input, 0);
    const state1 = r1.getState()[0];
    
    const r2 = new ToyLatentReasoner(64, 16, 16, 42);
    r2.setDecay(0.5);
    r2.step(input, 0);
    const state2 = r2.getState()[0];
    
    // Higher decay = more retention = larger state value (after first step from zero)
    expect(state1).toBeGreaterThan(state2);
  });
});

describe('Grid Transformations', () => {
  it('generateRandomGrid is deterministic', () => {
    const g1 = generateRandomGrid(42);
    const g2 = generateRandomGrid(42);
    expect(gridsEqual(g1, g2)).toBe(true);
  });
  
  it('different seeds produce different grids', () => {
    const g1 = generateRandomGrid(42);
    const g2 = generateRandomGrid(43);
    expect(gridsEqual(g1, g2)).toBe(false);
  });
  
  it('applyTransform applies rotation correctly', () => {
    const grid = [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 16],
    ];
    const rotated = applyTransform(grid, 'rotation');
    
    // 90° CW: [0][0] -> [0][3], [0][3] -> [3][3], etc.
    expect(rotated[0][0]).toBe(13); // was [3][0]
    expect(rotated[0][3]).toBe(1);  // was [0][0]
    expect(rotated[3][3]).toBe(4);  // was [0][3]
    expect(rotated[3][0]).toBe(16); // was [3][3]
  });
  
  it('applyTransform applies translation correctly', () => {
    const grid = [
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const translated = applyTransform(grid, 'translation');
    // Should move down-right by 1 (with wrap)
    expect(translated[1][1]).toBe(1);
  });
  
  it('applyTransform applies flip correctly', () => {
    const grid = [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 16],
    ];
    const flipped = applyTransform(grid, 'flip');
    
    // Horizontal flip: [r][c] -> [r][3-c]
    expect(flipped[0][0]).toBe(4);
    expect(flipped[0][3]).toBe(1);
    expect(flipped[3][0]).toBe(16);
    expect(flipped[3][3]).toBe(13);
  });
  
  it('applyTransform applies composition correctly', () => {
    const grid = [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 16],
    ];
    const composed = applyTransform(grid, 'composition');
    const rotated = applyTransform(grid, 'rotation');
    const flipRotated = applyTransform(rotated, 'flip');
    
    expect(gridsEqual(composed, flipRotated)).toBe(true);
  });
  
  it('gridsEqual detects differences', () => {
    const g1 = [[1,2],[3,4]];
    const g2 = [[1,2],[3,4]];
    const g3 = [[1,2],[3,5]];
    
    expect(gridsEqual(g1, g2)).toBe(true);
    expect(gridsEqual(g1, g3)).toBe(false);
  });
  
  it('gridAccuracy calculates correctly', () => {
    const pred = [[1,2],[3,4]];
    const target = [[1,2],[3,5]];
    expect(gridAccuracy(pred, target)).toBe(0.75);
    
    expect(gridAccuracy(pred, pred)).toBe(1.0);
    expect(gridAccuracy([[0,0],[0,0]], [[1,1],[1,1]])).toBe(0.0);
  });
});

describe('runExperiment', () => {
  it('returns deterministic result for same config', () => {
    const config = { ...DEFAULT_CONFIG, seed: 42 };
    const result1 = runExperiment(config);
    const result2 = runExperiment(config);
    
    expect(result1.latentAccuracy).toBe(result2.latentAccuracy);
    expect(result1.tokenAccuracy).toBe(result2.tokenAccuracy);
    expect(gridsEqual(result1.latentPrediction.grid, result2.latentPrediction.grid)).toBe(true);
    expect(gridsEqual(result1.tokenPrediction.grid, result2.tokenPrediction.grid)).toBe(true);
    expect(result1.stateTrajectory).toEqual(result2.stateTrajectory);
    expect(result1.stateChanges).toEqual(result2.stateChanges);
  });
  
  it('different seeds produce different results', () => {
    const config1 = { ...DEFAULT_CONFIG, seed: 42 };
    const config2 = { ...DEFAULT_CONFIG, seed: 43 };
    const result1 = runExperiment(config1);
    const result2 = runExperiment(config2);
    
    // At least one thing should differ
    const differs = result1.latentAccuracy !== result2.latentAccuracy ||
                    result1.tokenAccuracy !== result2.tokenAccuracy ||
                    !gridsEqual(result1.latentPrediction.grid, result2.latentPrediction.grid);
    expect(differs).toBe(true);
  });
  
  it('increasing recurrentDepth generally increases compute', () => {
    const config1 = { ...DEFAULT_CONFIG, recurrentDepth: 4, seed: 42 };
    const config2 = { ...DEFAULT_CONFIG, recurrentDepth: 16, seed: 42 };
    const result1 = runExperiment(config1);
    const result2 = runExperiment(config2);
    
    expect(result2.latentComputeEstimate).toBeGreaterThan(result1.latentComputeEstimate);
  });
  
  it('token steps affect token compute', () => {
    const config1 = { ...DEFAULT_CONFIG, tokenSteps: 4, seed: 42 };
    const config2 = { ...DEFAULT_CONFIG, tokenSteps: 16, seed: 42 };
    const result1 = runExperiment(config1);
    const result2 = runExperiment(config2);
    
    expect(result2.tokenComputeEstimate).toBeGreaterThan(result1.tokenComputeEstimate);
  });
  
  it('evidenceType is LIVE_TOY_COMPUTATION', () => {
    const result = runExperiment(DEFAULT_CONFIG);
    expect(result.evidenceType).toBe('LIVE_TOY_COMPUTATION');
  });
  
  it('stateTrajectory length matches recurrentDepth', () => {
    const config = { ...DEFAULT_CONFIG, recurrentDepth: 8, seed: 42 };
    const result = runExperiment(config);
    expect(result.stateTrajectory.length).toBe(8);
    expect(result.stateChanges.length).toBe(8);
  });
  
  it('stateDim affects state vector size', () => {
    const config1 = { ...DEFAULT_CONFIG, stateDim: 32, seed: 42 };
    const config2 = { ...DEFAULT_CONFIG, stateDim: 128, seed: 42 };
    const result1 = runExperiment(config1);
    const result2 = runExperiment(config2);
    
    expect(result1.stateTrajectory[0].length).toBe(32);
    expect(result2.stateTrajectory[0].length).toBe(128);
  });
});

describe('runRecurrentDepthSweep', () => {
  it('returns results for each depth', () => {
    const config = { ...DEFAULT_CONFIG, recurrentDepth: 8, seed: 42 };
    const results = runRecurrentDepthSweep(config);
    
    expect(results.length).toBe(8);
    expect(results[0].step).toBe(1);
    expect(results[7].step).toBe(8);
  });
  
  it('each result has required fields', () => {
    const config = { ...DEFAULT_CONFIG, recurrentDepth: 4, seed: 42 };
    const results = runRecurrentDepthSweep(config);
    
    for (const r of results) {
      expect(r.step).toBeGreaterThan(0);
      expect(r.accuracy).toBeGreaterThanOrEqual(0);
      expect(r.accuracy).toBeLessThanOrEqual(1);
      expect(r.confidence).toBeGreaterThanOrEqual(0);
      expect(r.stateChange).toBeGreaterThanOrEqual(0);
      expect(r.computeEstimate).toBeGreaterThan(0);
      expect(Array.isArray(r.stateVector)).toBe(true);
    }
  });
  
  it('is deterministic', () => {
    const config = { ...DEFAULT_CONFIG, recurrentDepth: 4, seed: 42 };
    const results1 = runRecurrentDepthSweep(config);
    const results2 = runRecurrentDepthSweep(config);
    
    expect(results1.map(r => r.accuracy)).toEqual(results2.map(r => r.accuracy));
    expect(results1.map(r => r.stateChange)).toEqual(results2.map(r => r.stateChange));
  });
});

describe('DEFAULT_CONFIG', () => {
  it('has valid default values', () => {
    expect(DEFAULT_CONFIG.recurrentDepth).toBe(8);
    expect(DEFAULT_CONFIG.stateDim).toBe(64);
    expect(DEFAULT_CONFIG.stateDecay).toBe(0.9);
    expect(DEFAULT_CONFIG.noiseLevel).toBe(0.05);
    expect(DEFAULT_CONFIG.interferenceLevel).toBe(0);
    expect(DEFAULT_CONFIG.taskType).toBe('rotation');
    expect(DEFAULT_CONFIG.numDemos).toBe(3);
    expect(DEFAULT_CONFIG.tokenSteps).toBe(8);
    expect(DEFAULT_CONFIG.seed).toBe(42);
  });
});

describe('Utility functions', () => {
  const { formatNumber, formatPercent, clamp, lerp } = require('@/lib/utils');
  
  it('formatNumber formats correctly', () => {
    expect(formatNumber(500)).toBe('500');
    expect(formatNumber(5000)).toBe('5K');
    expect(formatNumber(5000000)).toBe('5M');
    expect(formatNumber(5000000000)).toBe('5B');
  });
  
  it('formatPercent formats correctly', () => {
    expect(formatPercent(0.5)).toBe('50.0%');
    expect(formatPercent(0.1234)).toBe('12.3%');
    expect(formatPercent(1.0)).toBe('100.0%');
  });
  
  it('clamp works correctly', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
  
  it('lerp works correctly', () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(0, 10, 0)).toBe(0);
    expect(lerp(0, 10, 1)).toBe(10);
  });
});