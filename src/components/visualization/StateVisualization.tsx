'use client';

import { cn, getHeatmapColor, VIRIDIS_COLORS } from '@/lib/utils';

interface StateHeatmapProps {
  state: number[];
  width?: number;
  height?: number;
  cellSize?: number;
  className?: string;
  title?: string;
  showColorbar?: boolean;
  label?: string;
}

export function StateHeatmap({
  state,
  width = 16,
  height = 4,
  cellSize = 8,
  className,
  title,
  showColorbar = true,
  label = 'Activation',
}: StateHeatmapProps) {
  if (state.length === 0) {
    return (
      <div className={cn('text-center py-8 text-lab-textMuted', className)}>
        No state data
      </div>
    );
  }
  
  const actualWidth = Math.min(width, state.length);
  const actualHeight = Math.ceil(state.length / actualWidth);
  const containerWidth = actualWidth * cellSize;
  const containerHeight = actualHeight * cellSize;
  
  const maxVal = Math.max(...state.map(Math.abs), 1);
  const minVal = Math.min(...state);
  
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      {title && (
        <div className="text-xs font-mono text-lab-textMuted uppercase tracking-wider">
          {title}
        </div>
      )}
      <div className="relative">
        <svg width={containerWidth} height={containerHeight}>
          {state.slice(0, actualWidth * actualHeight).map((val, idx) => {
            const r = Math.floor(idx / actualWidth);
            const c = idx % actualWidth;
            
            // Normalize to 0-1 for color mapping
            const normalized = maxVal > 0 ? (val - minVal) / (maxVal - minVal || 1) : 0;
            const fill = getHeatmapColor(normalized, VIRIDIS_COLORS);
            
            return (
              <rect
                key={idx}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize}
                height={cellSize}
                fill={fill}
                stroke="#1a2234"
                strokeWidth={0.5}
              />
            );
          })}
        </svg>
      </div>
      
      {showColorbar && (
        <div className="flex items-center gap-2 text-[10px] text-lab-textMuted font-mono">
          <span>{minVal.toFixed(2)}</span>
          <div 
            className="h-1.5 rounded" 
            style={{ 
              width: 80, 
              background: `linear-gradient(90deg, ${VIRIDIS_COLORS.join(', ')})` 
            }} 
          />
          <span>{maxVal.toFixed(2)}</span>
          <span className="ml-2">{label}</span>
        </div>
      )}
    </div>
  );
}

interface StateTrajectoryProps {
  trajectory: number[][];
  width?: number;
  height?: number;
  cellSize?: number;
  className?: string;
  title?: string;
  maxSteps?: number;
}

export function StateTrajectory({
  trajectory,
  width = 32,
  height,
  cellSize = 4,
  className,
  title,
  maxSteps = 32,
}: StateTrajectoryProps) {
  if (trajectory.length === 0) {
    return (
      <div className={cn('text-center py-8 text-lab-textMuted', className)}>
        No trajectory data
      </div>
    );
  }
  
  const steps = Math.min(trajectory.length, maxSteps);
  const stateDim = trajectory[0]?.length || 0;
  const actualHeight = height || stateDim;
  const actualWidth = Math.min(width, steps);
  
  const containerWidth = actualWidth * cellSize;
  const containerHeight = actualHeight * cellSize;
  
  // Find global min/max for consistent coloring
  let globalMin = Infinity;
  let globalMax = -Infinity;
  for (let s = 0; s < steps; s++) {
    for (let d = 0; d < stateDim; d++) {
      const val = trajectory[s][d];
      globalMin = Math.min(globalMin, val);
      globalMax = Math.max(globalMax, val);
    }
  }
  if (globalMin === Infinity) globalMin = 0;
  if (globalMax === -Infinity) globalMax = 1;
  
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      {title && (
        <div className="text-xs font-mono text-lab-textMuted uppercase tracking-wider">
          {title}
        </div>
      )}
      <div className="relative">
        <svg width={containerWidth} height={containerHeight}>
          {/* Y-axis labels */}
          <text 
            x={-4} 
            y={containerHeight / 2} 
            textAnchor="end" 
            dominantBaseline="middle"
            fontSize={8}
            fill="#8b9ab8"
            fontFamily="IBM Plex Mono, monospace"
            transform={`rotate(-90, -4, ${containerHeight / 2})`}
          >
            State Dimension
          </text>
          
          {/* X-axis labels */}
          <text 
            x={containerWidth / 2} 
            y={containerHeight + 14} 
            textAnchor="middle"
            fontSize={8}
            fill="#8b9ab8"
            fontFamily="IBM Plex Mono, monospace"
          >
            Recurrent Step
          </text>
          
          {Array.from({ length: actualHeight }, (_, d) => (
            <text
              key={`dim-${d}`}
              x={-4}
              y={d * cellSize + cellSize / 2 + 3}
              textAnchor="end"
              fontSize={6}
              fill="#8b9ab8"
              fontFamily="IBM Plex Mono, monospace"
            >
              {d * Math.ceil(stateDim / actualHeight)}
            </text>
          ))}
          
          {Array.from({ length: Math.min(steps, 8) }, (_, s) => (
            <text
              key={`step-${s}`}
              x={s * (actualWidth / 7) * cellSize + cellSize / 2}
              y={containerHeight + 24}
              textAnchor="middle"
              fontSize={6}
              fill="#8b9ab8"
              fontFamily="IBM Plex Mono, monospace"
            >
              {Math.round(s * (steps - 1) / 7)}
            </text>
          ))}
          
          {/* Heatmap cells */}
          {Array.from({ length: steps }, (_, s) => {
            const step = Math.floor(s * (trajectory.length - 1) / (steps - 1 || 1));
            const stateVec = trajectory[step];
            return Array.from({ length: actualHeight }, (_, d) => {
              const dim = Math.floor(d * stateDim / actualHeight);
              const val = stateVec[dim] || 0;
              const normalized = globalMax > globalMin 
                ? (val - globalMin) / (globalMax - globalMin) 
                : 0.5;
              const fill = getHeatmapColor(normalized, VIRIDIS_COLORS);
              
              return (
                <rect
                  key={`${s}-${d}`}
                  x={s * cellSize}
                  y={d * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill={fill}
                />
              );
            });
          })}
        </svg>
      </div>
    </div>
  );
}

interface StateChangeChartProps {
  changes: number[];
  className?: string;
  title?: string;
  maxPoints?: number;
  yLabel?: string;
}

export function StateChangeChart({
  changes,
  className,
  title,
  maxPoints = 32,
  yLabel = 'State Change Magnitude',
}: StateChangeChartProps) {
  if (changes.length === 0) {
    return (
      <div className={cn('text-center py-8 text-lab-textMuted', className)}>
        No change data
      </div>
    );
  }
  
  const points = Math.min(changes.length, maxPoints);
  const width = 280;
  const height = 120;
  const padding = { top: 20, right: 10, bottom: 30, left: 40 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  
  const maxVal = Math.max(...changes.slice(0, points), 1);
  const minVal = Math.min(...changes.slice(0, points), 0);
  
  const xScale = (i: number) => padding.left + (i / (points - 1 || 1)) * innerWidth;
  const yScale = (val: number) => padding.top + innerHeight - ((val - minVal) / (maxVal - minVal || 1)) * innerHeight;
  
  const pathData = changes.slice(0, points).map((val, i) => {
    const x = xScale(i);
    const y = yScale(val);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      {title && (
        <div className="text-xs font-mono text-lab-textMuted uppercase tracking-wider w-full text-center">
          {title}
        </div>
      )}
      <svg width={width} height={height} className="bg-lab-bg rounded-lg">
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
        
        {/* Y label */}
        <text
          x={8}
          y={height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={8}
          fill="#8b9ab8"
          fontFamily="IBM Plex Mono, monospace"
          transform={`rotate(-90, 8, ${height / 2})`}
        >
          {yLabel}
        </text>
        
        {/* X label */}
        <text
          x={width / 2}
          y={height - 4}
          textAnchor="middle"
          fontSize={8}
          fill="#8b9ab8"
          fontFamily="IBM Plex Mono, monospace"
        >
          Recurrent Step
        </text>
        
        {/* Grid lines */}
        {Array.from({ length: 4 }, (_, i) => {
          const y = padding.top + (i / 3) * innerHeight;
          return (
            <line
              key={i}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="#1a2234"
              strokeWidth={0.5}
              strokeDasharray="2,2"
            />
          );
        })}
        
        {/* Y axis ticks */}
        {Array.from({ length: 4 }, (_, i) => {
          const val = minVal + (i / 3) * (maxVal - minVal);
          const y = padding.top + (i / 3) * innerHeight;
          return (
            <>
              <line
                key={`tick-${i}`}
                x1={padding.left - 4}
                y1={y}
                x2={padding.left}
                y2={y}
                stroke="#2a3548"
                strokeWidth={1}
              />
              <text
                key={`tick-label-${i}`}
                x={padding.left - 6}
                y={y + 3}
                textAnchor="end"
                fontSize={7}
                fill="#8b9ab8"
                fontFamily="IBM Plex Mono, monospace"
              >
                {val.toFixed(2)}
              </text>
            </>
          );
        })}
        
        {/* Area under curve */}
        <path
          d={pathData + ` L ${xScale(points - 1)} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`}
          fill="url(#gradient)"
          opacity={0.3}
        />
        
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke="#00d4aa"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Points */}
        {changes.slice(0, points).map((val, i) => (
          <circle
            key={i}
            cx={xScale(i)}
            cy={yScale(val)}
            r={3}
            fill="#00d4aa"
            stroke="#0a0f1a"
            strokeWidth={2}
          />
        ))}
        
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00d4aa" />
            <stop offset="100%" stopColor="#00d4aa" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

interface StateVectorBarsProps {
  state: number[];
  className?: string;
  title?: string;
  maxBars?: number;
  color?: string;
}

export function StateVectorBars({
  state,
  className,
  title,
  maxBars = 64,
  color = '#00d4aa',
}: StateVectorBarsProps) {
  if (state.length === 0) return null;
  
  const displayState = state.slice(0, maxBars);
  const maxVal = Math.max(...displayState.map(Math.abs), 1);
  
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {title && (
        <div className="text-xs font-mono text-lab-textMuted uppercase tracking-wider">
          {title}
        </div>
      )}
      <div className="flex items-end gap-0.5 h-24 overflow-x-auto pb-2" role="img" aria-label="State vector activations">
        {displayState.map((val, i) => {
          const height = Math.max(2, (Math.abs(val) / maxVal) * 80);
          return (
            <div
              key={i}
              className="flex-1 min-w-[2px] transition-all duration-100"
              style={{
                height: `${height}%`,
                background: `linear-gradient(to top, ${color}, ${color}80)`,
                borderRadius: '1px 1px 0 0',
                opacity: val > 0 ? 1 : 0.3,
              }}
              title={`Dim ${i}: ${val.toFixed(3)}`}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-[9px] text-lab-textMuted font-mono">
        <span>0</span>
        <span>{maxBars}</span>
        <span>Dim</span>
      </div>
    </div>
  );
}