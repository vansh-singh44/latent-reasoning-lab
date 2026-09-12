'use client';

import { useCallback } from 'react';
import { Download, FileText, Download as DownloadIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createExportData, exportToJSON, exportToCSV } from '@/lib/export';
import { useExperimentStore } from '@/lib/experiment';

interface ExportButtonsProps {
  className?: string;
}

export function ExportButtons({ className }: ExportButtonsProps) {
  const { config, result, recurrentDepthResults } = useExperimentStore();

  const handleExportJSON = useCallback(() => {
    if (!result) return;
    const data = createExportData(config, result, recurrentDepthResults || []);
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
  }, [config, result, recurrentDepthResults]);

  const handleExportCSV = useCallback(() => {
    if (!result) return;
    const rows: string[][] = [
      ['Metric', 'Token Reasoning', 'Latent Reasoning'],
      ['Accuracy', (result.tokenAccuracy || 0).toFixed(4), (result.latentAccuracy || 0).toFixed(4)],
      ['Steps', (result.tokenStepsUsed || 0).toString(), (result.latentStepsUsed || 0).toString()],
      ['Compute (FLOPs)', (result.tokenComputeEstimate || 0).toString(), (result.latentComputeEstimate || 0).toString()],
      ['Memory (bytes)', (result.tokenMemoryEstimate || 0).toString(), (result.latentMemoryEstimate || 0).toString()],
      ['Recurrent Depth', config.recurrentDepth.toString(), config.recurrentDepth.toString()],
      ['State Dimension', config.stateDim.toString(), config.stateDim.toString()],
      ['State Decay', config.stateDecay.toString(), config.stateDecay.toString()],
      ['Noise Level', config.noiseLevel.toString(), config.noiseLevel.toString()],
      ['Interference Level', config.interferenceLevel.toString(), config.interferenceLevel.toString()],
      ['Task Type', config.taskType, config.taskType],
      ['Demonstrations', config.numDemos.toString(), config.numDemos.toString()],
      ['Token Steps', config.tokenSteps.toString(), config.tokenSteps.toString()],
      ['Seed', config.seed.toString(), config.seed.toString()],
    ];

    // Add recurrent depth results if available
    // Note: would need access to recurrentDepthResults from store

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
  }, [config, result]);

  if (!result) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className="text-xs text-lab-textMuted">Run experiment to enable export</span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        onClick={handleExportJSON}
        className="btn-secondary flex items-center gap-2 px-3 py-2 text-sm"
        aria-label="Export experiment data as JSON"
      >
        <FileText className="w-4 h-4" aria-hidden="true" />
        <span>JSON</span>
      </button>
      <button
        onClick={handleExportCSV}
        className="btn-secondary flex items-center gap-2 px-3 py-2 text-sm"
        aria-label="Export experiment data as CSV"
      >
        <Download className="w-4 h-4" aria-hidden="true" />
        <span>CSV</span>
      </button>
    </div>
  );
}