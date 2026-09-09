'use client';

import { cn, formatNumber, formatPercent } from '@/lib/utils';

interface AccuracyComputeChartProps {
  tokenData: { steps: number; accuracy: number; compute: number }[];
  latentData: { steps: number; accuracy: number; compute: number }[];
  className?: string;
  title?: string;
  showLegend?: boolean;
}

export function AccuracyComputeChart({
  tokenData,
  latentData,
  className,
  title,
  showLegend = true,
}: AccuracyComputeChartProps) {
  const allData = [...tokenData, ...latentData];
  if (allData.length === 0) return null;
  
  const width = 380;
  const height = 220;
  const padding = { top: 20, right: showLegend ? 120 : 20, bottom: 40, left: 50 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  
  const maxAcc = Math.max(...allData.map(d => d.accuracy), 0.1);
  const minAcc = Math.min(...allData.map(d => d.accuracy), 0);
  const maxCompute = Math.max(...allData.map(d => d.compute), 1);
  
  const xScale = (compute: number) => padding.left + (Math.log10(compute) / Math.log10(maxCompute)) * innerWidth;
  const yScale = (acc: number) => padding.top + innerHeight - ((acc - minAcc) / (maxAcc - minAcc || 1)) * innerHeight;
  
  const createPath = (data: { steps: number; accuracy: number; compute: number }[], color: string) => {
    if (data.length < 2) return '';
    const sorted = [...data].sort((a, b) => a.compute - b.compute);
    return sorted.map((d, i) => {
      const x = xScale(d.compute);
      const y = yScale(d.accuracy);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };
  
  const tokenPath = createPath(tokenData, '#60a5fa');
  const latentPath = createPath(latentData, '#00d4aa');
  
  // Generate x-axis ticks (log scale)
  const xTicks = [1e3, 1e4, 1e5, 1e6, 1e7, 1e8].filter(t => t <= maxCompute);
  // Generate y-axis ticks
  const yTicks = Array.from({ length: 5 }, (_, i) => minAcc + (i / 4) * (maxAcc - minAcc));
  
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      {title && (
        <div className="text-xs font-mono text-lab-textMuted uppercase tracking-wider text-center w-full">
          {title}
        </div>
      )}
      <div className="relative" style={{ width, height }}>
        <svg width={width} height={height}>
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1a2234" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect
            x={padding.left}
            y={padding.top}
            width={innerWidth}
            height={innerHeight}
            fill="url(#grid)"
          />
          
          {/* Y axis */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke="#2a3548"
            strokeWidth={1}
          />
          
          {/* X axis */}
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="#2a3548"
            strokeWidth={1}
          />
          
          {/* Y axis ticks and labels */}
          {yTicks.map((val, i) => (
            <g key={`y-${i}`}>
              <line
                x1={padding.left - 4}
                y1={yScale(val)}
                x2={padding.left}
                y2={yScale(val)}
                stroke="#2a3548"
                strokeWidth={1}
              />
              <text
                x={padding.left - 8}
                y={yScale(val) + 3}
                textAnchor="end"
                fontSize={9}
                fill="#8b9ab8"
                fontFamily="IBM Plex Mono, monospace"
              >
                {formatPercent(val, 0)}
              </text>
            </g>
          ))}
          
          {/* X axis ticks and labels (log scale) */}
          {xTicks.map((val, i) => {
            const x = xScale(val);
            return (
              <g key={`x-${i}`}>
                <line
                  x1={x}
                  y1={height - padding.bottom}
                  x2={x}
                  y2={height - padding.bottom + 4}
                  stroke="#2a3548"
                  strokeWidth={1}
                />
                <text
                  x={x}
                  y={height - padding.bottom + 16}
                  textAnchor="middle"
                  fontSize={9}
                  fill="#8b9ab8"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {formatNumber(val, 0)}
                </text>
              </g>
            );
          })}
          
          {/* Axis labels */}
          <text
            x={15}
            y={height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={9}
            fill="#8b9ab8"
            fontFamily="IBM Plex Mono, monospace"
            transform={`rotate(-90, 15, ${height / 2})`}
          >
            Accuracy
          </text>
          
          <text
            x={width / 2}
            y={height - 6}
            textAnchor="middle"
            fontSize={9}
            fill="#8b9ab8"
            fontFamily="IBM Plex Mono, monospace"
          >
            Compute (FLOPs, log scale)
          </text>
          
          {/* Token path */}
          {tokenPath && (
            <path
              d={tokenPath}
              fill="none"
              stroke="#60a5fa"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="6,4"
            />
          )}
          
          {/* Latent path */}
          {latentPath && (
            <path
              d={latentPath}
              fill="none"
              stroke="#00d4aa"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          
          {/* Token points */}
          {tokenData.map((d, i) => (
            <circle
              key={`token-${i}`}
              cx={xScale(d.compute)}
              cy={yScale(d.accuracy)}
              r={4}
              fill="#60a5fa"
              stroke="#0a0f1a"
              strokeWidth={2}
            />
          ))}
          
          {/* Latent points */}
          {latentData.map((d, i) => (
            <circle
              key={`latent-${i}`}
              cx={xScale(d.compute)}
              cy={yScale(d.accuracy)}
              r={4}
              fill="#00d4aa"
              stroke="#0a0f1a"
              strokeWidth={2}
            />
          ))}
        </svg>
        
        {/* Legend */}
        {showLegend && (
          <div className="absolute top-4 right-0 flex flex-col gap-2">
            <div className="flex items-center gap-2 px-2 py-1 bg-lab-panel/90 backdrop-blur rounded-lg border border-lab-border">
              <div className="w-6 h-1 bg-lab-info border-t-[2px] border-dashed" style={{ borderColor: '#60a5fa' }} />
              <span className="text-xs text-lab-text font-mono">Token Reasoning</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 bg-lab-panel/90 backdrop-blur rounded-lg border border-lab-border">
              <div className="w-6 h-1 bg-lab-accent" />
              <span className="text-xs text-lab-text font-mono">Latent Reasoning</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface AccuracyVsDepthChartProps {
  data: { step: number; accuracy: number; confidence: number }[];
  className?: string;
  title?: string;
  baseline?: number;
}

export function AccuracyVsDepthChart({
  data,
  className,
  title,
  baseline,
}: AccuracyVsDepthChartProps) {
  if (data.length === 0) return null;
  
  const width = 380;
  const height = 220;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  
  const maxStep = Math.max(...data.map(d => d.step), 1);
  const maxAcc = Math.max(...data.map(d => d.accuracy), baseline || 0, 0.1);
  const minAcc = Math.min(...data.map(d => d.accuracy), baseline || 1, 0);
  
  const xScale = (step: number) => padding.left + (step / maxStep) * innerWidth;
  const yScale = (acc: number) => padding.top + innerHeight - ((acc - minAcc) / (maxAcc - minAcc || 1)) * innerHeight;
  
  const pathData = data.map((d, i) => {
    const x = xScale(d.step);
    const y = yScale(d.accuracy);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  
  // Confidence band
  const confidencePath = [
    ...data.map((d, i) => {
      const x = xScale(d.step);
      const y = yScale(Math.min(maxAcc, d.accuracy + d.confidence * 0.1));
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }),
    ...data.slice().reverse().map((d, i) => {
      const x = xScale(d.step);
      const y = yScale(Math.max(minAcc, d.accuracy - d.confidence * 0.1));
      return `${i === 0 ? 'L' : 'L'} ${x} ${y}`;
    }),
    'Z'
  ].join(' ');
  
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      {title && (
        <div className="text-xs font-mono text-lab-textMuted uppercase tracking-wider text-center w-full">
          {title}
        </div>
      )}
      <svg width={width} height={height}>
        {/* Grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1a2234" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect x={padding.left} y={padding.top} width={innerWidth} height={innerHeight} fill="url(#grid)" />
        
        {/* Baseline */}
        {baseline !== undefined && baseline > 0 && (
          <line
            x1={padding.left}
            y1={yScale(baseline)}
            x2={width - padding.right}
            y2={yScale(baseline)}
            stroke="#ffb84d"
            strokeWidth={1}
            strokeDasharray="4,4"
            opacity={0.7}
          />
        )}
        
        {/* Axes */}
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="#2a3548" strokeWidth={1} />
        <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#2a3548" strokeWidth={1} />
        
        {/* Y ticks */}
        {Array.from({ length: 5 }, (_, i) => {
          const val = minAcc + (i / 4) * (maxAcc - minAcc);
          return (
            <g key={`y-${i}`}>
              <line x1={padding.left - 4} y1={yScale(val)} x2={padding.left} y2={yScale(val)} stroke="#2a3548" />
              <text x={padding.left - 8} y={yScale(val) + 3} textAnchor="end" fontSize={9} fill="#8b9ab8" fontFamily="IBM Plex Mono, monospace">
                {formatPercent(val, 0)}
              </text>
            </g>
          );
        })}
        
        {/* X ticks */}
        {Array.from({ length: Math.min(8, maxStep + 1) }, (_, i) => {
          const step = Math.round(i * maxStep / 7);
          const x = xScale(step);
          return (
            <g key={`x-${i}`}>
              <line x1={x} y1={height - padding.bottom} x2={x} y2={height - padding.bottom + 4} stroke="#2a3548" />
              <text x={x} y={height - padding.bottom + 16} textAnchor="middle" fontSize={9} fill="#8b9ab8" fontFamily="IBM Plex Mono, monospace">
                {step}
              </text>
            </g>
          );
        })}
        
        {/* Axis labels */}
        <text x={15} y={height / 2} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill="#8b9ab8" fontFamily="IBM Plex Mono, monospace" transform={`rotate(-90, 15, ${height / 2})`}>
          Accuracy
        </text>
        <text x={width / 2} y={height - 6} textAnchor="middle" fontSize={9} fill="#8b9ab8" fontFamily="IBM Plex Mono, monospace">
          Recurrent Depth (Steps)
        </text>
        
        {/* Confidence band */}
        <path d={confidencePath} fill="#00d4aa" opacity={0.15} />
        
        {/* Main line */}
        <path d={pathData} fill="none" stroke="#00d4aa" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Points */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={xScale(d.step)}
            cy={yScale(d.accuracy)}
            r={4}
            fill="#00d4aa"
            stroke="#0a0f1a"
            strokeWidth={2}
          />
        ))}
        
        {/* Baseline label */}
        {baseline !== undefined && baseline > 0 && (
          <text
            x={width - padding.right - 4}
            y={yScale(baseline) - 4}
            textAnchor="end"
            fontSize={8}
            fill="#ffb84d"
            fontFamily="IBM Plex Mono, monospace"
          >
            Baseline (r=1)
          </text>
        )}
      </svg>
    </div>
  );
}

interface ComparisonTableProps {
  rows: { property: string; token: string; latent: string }[];
  className?: string;
}

export function ComparisonTable({ rows, className }: ComparisonTableProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm font-mono" role="table">
        <thead>
          <tr className="border-b border-lab-border">
            <th className="text-left py-2 px-3 font-medium text-lab-textMuted uppercase tracking-wider">Property</th>
            <th className="text-left py-2 px-3 font-medium text-lab-textMuted uppercase tracking-wider text-lab-info">Token Reasoning</th>
            <th className="text-left py-2 px-3 font-medium text-lab-textMuted uppercase tracking-wider text-lab-accent">Latent Recurrence</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={cn('border-b border-lab-border/50', i % 2 === 0 && 'bg-lab-panel/30')}>
              <td className="py-2 px-3 text-lab-textMuted">{row.property}</td>
              <td className="py-2 px-3 text-lab-info">{row.token}</td>
              <td className="py-2 px-3 text-lab-accent">{row.latent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  evidenceBadge?: string;
}

export function MetricCard({ 
  label, 
  value, 
  unit, 
  trend, 
  trendValue, 
  className, 
  evidenceBadge 
}: MetricCardProps) {
  return (
    <div className={cn('card flex flex-col gap-1', className)}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-mono text-lab-textMuted uppercase tracking-wider">{label}</span>
        {evidenceBadge && (
          <span className={cn('evidence-badge', `badge-${evidenceBadge.toLowerCase().replace('_', '-')}`)}>
            {evidenceBadge}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-mono font-medium text-lab-text">{value}</span>
        {unit && <span className="text-sm text-lab-textMuted">{unit}</span>}
      </div>
      {(trend || trendValue) && (
        <div className={cn('flex items-center gap-1 text-xs font-mono', trend === 'up' ? 'text-lab-accent' : trend === 'down' ? 'text-lab-danger' : 'text-lab-textMuted')}>
          {trend === 'up' && '▲'}
          {trend === 'down' && '▼'}
          {trendValue}
        </div>
      )}
    </div>
  );
}