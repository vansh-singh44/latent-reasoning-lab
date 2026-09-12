export interface ExperimentExportData {
  timestamp: string;
  config: {
    recurrentDepth: number;
    stateDim: number;
    stateDecay: number;
    noiseLevel: number;
    interferenceLevel: number;
    taskType: string;
    numDemos: number;
    tokenSteps: number;
    seed: number;
  };
  result: {
    groundTruth: number[][];
    tokenPrediction: number[][];
    tokenAccuracy: number;
    tokenStepsUsed: number;
    tokenComputeEstimate: number;
    tokenMemoryEstimate: number;
    latentPrediction: number[][];
    latentAccuracy: number;
    latentStepsUsed: number;
    latentComputeEstimate: number;
    latentMemoryEstimate: number;
    stateTrajectory: number[][];
    stateChanges: number[];
    evidenceType: string;
  };
  recurrentDepthResults?: Array<{
    step: number;
    accuracy: number;
    confidence: number;
    stateChange: number;
    computeEstimate: number;
  }>;
  metadata: {
    exportedAt: string;
    version: string;
    url: string;
  };
}

export function exportToJSON(data: ExperimentExportData): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `latent-reasoning-experiment-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToCSV(data: ExperimentExportData): void {
  const rows: string[][] = [
    ['Metric', 'Token Reasoning', 'Latent Reasoning'],
    ['Accuracy', data.result.tokenAccuracy.toFixed(4), data.result.latentAccuracy.toFixed(4)],
    ['Steps', data.result.tokenStepsUsed.toString(), data.result.latentStepsUsed.toString()],
    ['Compute (FLOPs)', data.result.tokenComputeEstimate.toString(), data.result.latentComputeEstimate.toString()],
    ['Memory (bytes)', data.result.tokenMemoryEstimate.toString(), data.result.latentMemoryEstimate.toString()],
    ['Recurrent Depth', data.config.recurrentDepth.toString(), data.config.recurrentDepth.toString()],
    ['State Dimension', data.config.stateDim.toString(), data.config.stateDim.toString()],
    ['State Decay', data.config.stateDecay.toString(), data.config.stateDecay.toString()],
    ['Noise Level', data.config.noiseLevel.toString(), data.config.noiseLevel.toString()],
    ['Interference Level', data.config.interferenceLevel.toString(), data.config.interferenceLevel.toString()],
    ['Task Type', data.config.taskType, data.config.taskType],
    ['Demonstrations', data.config.numDemos.toString(), data.config.numDemos.toString()],
    ['Token Steps', data.config.tokenSteps.toString(), data.config.tokenSteps.toString()],
    ['Seed', data.config.seed.toString(), data.config.seed.toString()],
  ];

  if (data.recurrentDepthResults && data.recurrentDepthResults.length > 0) {
    rows.push([]);
    rows.push(['Recurrent Depth', 'Accuracy', 'Confidence', 'State Change', 'Compute Estimate']);
    data.recurrentDepthResults.forEach(r => {
      rows.push([r.step.toString(), r.accuracy.toFixed(4), r.confidence.toFixed(4), r.stateChange.toFixed(4), r.computeEstimate.toString()]);
    });
  }

  const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `latent-reasoning-experiment-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Create export data from experiment store
export function createExportData(
  config: any,
  result: any,
  recurrentDepthResults: any[]
): ExperimentExportData {
  return {
    timestamp: new Date().toISOString(),
    config: {
      recurrentDepth: config.recurrentDepth,
      stateDim: config.stateDim,
      stateDecay: config.stateDecay,
      noiseLevel: config.noiseLevel,
      interferenceLevel: config.interferenceLevel,
      taskType: config.taskType,
      numDemos: config.numDemos,
      tokenSteps: config.tokenSteps,
      seed: config.seed,
    },
    result: {
      groundTruth: result.groundTruth?.grid || [],
      tokenPrediction: result.tokenPrediction?.grid || [],
      tokenAccuracy: result.tokenAccuracy || 0,
      tokenStepsUsed: result.tokenStepsUsed || 0,
      tokenComputeEstimate: result.tokenComputeEstimate || 0,
      tokenMemoryEstimate: result.tokenMemoryEstimate || 0,
      latentPrediction: result.latentPrediction?.grid || [],
      latentAccuracy: result.latentAccuracy || 0,
      latentStepsUsed: result.latentStepsUsed || 0,
      latentComputeEstimate: result.latentComputeEstimate || 0,
      latentMemoryEstimate: result.latentMemoryEstimate || 0,
      stateTrajectory: result.stateTrajectory || [],
      stateChanges: result.stateChanges || [],
      evidenceType: result.evidenceType || 'LIVE_TOY_COMPUTATION',
    },
    recurrentDepthResults: recurrentDepthResults?.map(r => ({
      step: r.step,
      accuracy: r.accuracy,
      confidence: r.confidence,
      stateChange: r.stateChange,
      computeEstimate: r.computeEstimate,
    })) || [],
    metadata: {
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      url: window.location.href,
    },
  };
}