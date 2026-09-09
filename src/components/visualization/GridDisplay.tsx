'use client';

import { cn, getHeatmapColor, VIRIDIS_COLORS } from '@/lib/utils';

interface GridDisplayProps {
  grid: number[][];
  size?: number;
  cellSize?: number;
  showValues?: boolean;
  colorScheme?: 'viridis' | 'plasma' | 'categorical';
  maxValue?: number;
  className?: string;
  'aria-label'?: string;
  title?: string;
  highlightDiff?: number[][]; // Grid to diff against
}

const CATEGORICAL_COLORS = [
  '#0a0f1a', // 0 - dark bg
  '#00d4aa', // 1 - teal
  '#60a5fa', // 2 - blue
  '#ffb84d', // 3 - amber
  '#ff6b6b', // 4 - red
  '#a78bfa', // 5 - purple
  '#34d399', // 6 - green
  '#f472b6', // 7 - pink
  '#fb923c', // 8 - orange
  '#fff',    // 9 - white
];

export function GridDisplay({
  grid,
  size = 4,
  cellSize = 32,
  showValues = true,
  colorScheme = 'categorical',
  maxValue = 9,
  className,
  'aria-label': ariaLabel,
  title,
  highlightDiff,
}: GridDisplayProps) {
  const colors = colorScheme === 'viridis' ? VIRIDIS_COLORS : 
                 colorScheme === 'plasma' ? 
                   ['#0d0887', '#46039f', '#7201a8', '#9c179e', '#bd3786', '#d8576b', '#ed7953', '#fb9f3a', '#fdca26', '#f0f921'] 
                   : CATEGORICAL_COLORS;
  
  const containerSize = size * cellSize;
  
  return (
    <div className={cn('inline-flex flex-col items-center gap-2', className)}>
      {title && (
        <div className="text-xs font-mono text-lab-textMuted uppercase tracking-wider">
          {title}
        </div>
      )}
      <div 
        className="relative"
        role="img"
        aria-label={ariaLabel || `${size}x${size} grid`}
        style={{ width: containerSize, height: containerSize }}
      >
        <svg 
          width={containerSize} 
          height={containerSize}
          style={{ display: 'block' }}
        >
          {grid.map((row, r) =>
            row.map((val, c) => {
              const isDiff = highlightDiff && highlightDiff[r]?.[c] !== val;
              const diffVal = highlightDiff ? highlightDiff[r]?.[c] : null;
              
              let fill: string;
              if (colorScheme === 'categorical') {
                fill = colors[val] || colors[0];
              } else {
                fill = getHeatmapColor(val / maxValue, colors);
              }
              
              return (
                <g key={`${r}-${c}`}>
                  <rect
                    x={c * cellSize}
                    y={r * cellSize}
                    width={cellSize}
                    height={cellSize}
                    fill={fill}
                    stroke="#2a3548"
                    strokeWidth={0.5}
                    rx={2}
                    ry={2}
                    style={isDiff ? { filter: 'drop-shadow(0 0 4px #ff6b6b)' } : {}}
                  />
                  {isDiff && diffVal !== null && diffVal !== undefined && (
                    <rect
                      x={c * cellSize + 2}
                      y={r * cellSize + 2}
                      width={cellSize - 4}
                      height={cellSize - 4}
                      fill="none"
                      stroke="#ff6b6b"
                      strokeWidth={2}
                      strokeDasharray="4,2"
                      rx={2}
                      ry={2}
                    />
                  )}
                  {showValues && val !== 0 && (
                    <text
                      x={c * cellSize + cellSize / 2}
                      y={r * cellSize + cellSize / 2 + 4}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={cellSize * 0.5}
                      fontFamily="IBM Plex Mono, monospace"
                      fontWeight={600}
                      fill={val > maxValue / 2 ? '#0a0f1a' : '#fff'}
                      pointerEvents="none"
                    >
                      {val}
                    </text>
                  )}
                </g>
              );
            })
          )}
        </svg>
      </div>
    </div>
  );
}

// Animated grid for showing transformations
interface AnimatedGridProps {
  fromGrid: number[][];
  toGrid: number[][];
  progress: number; // 0-1
  size?: number;
  cellSize?: number;
  className?: string;
}

export function AnimatedGrid({ 
  fromGrid, 
  toGrid, 
  progress, 
  size = 4, 
  cellSize = 32,
  className 
}: AnimatedGridProps) {
  const containerSize = size * cellSize;
  const CATEGORICAL_COLORS = [
    '#0a0f1a', '#00d4aa', '#60a5fa', '#ffb84d', '#ff6b6b',
    '#a78bfa', '#34d399', '#f472b6', '#fb923c', '#fff',
  ];
  
  return (
    <div className={cn('relative', className)} style={{ width: containerSize, height: containerSize }}>
      <svg width={containerSize} height={containerSize}>
        {fromGrid.map((row, r) =>
          row.map((fromVal, c) => {
            const toVal = toGrid[r]?.[c] ?? fromVal;
            const isChanging = fromVal !== toVal;
            
            // Interpolate color for changing cells
            let fill: string;
            if (isChanging && progress < 1) {
              // Pulse between colors during transition
              const pulse = Math.sin(progress * Math.PI * 4) * 0.5 + 0.5;
              const fromColor = CATEGORICAL_COLORS[fromVal];
              const toColor = CATEGORICAL_COLORS[toVal];
              // Simple approach: show from color fading out, to color fading in
              fill = progress < 0.5 ? fromColor : toColor;
            } else {
              fill = CATEGORICAL_COLORS[toVal];
            }
            
            return (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize}
                height={cellSize}
                fill={fill}
                stroke="#2a3548"
                strokeWidth={0.5}
                rx={2}
                ry={2}
                style={{
                  transition: 'fill 0.15s ease-out',
                  opacity: isChanging && progress < 0.5 ? 0.7 : 1,
                }}
              />
            );
          })
        )}
      </svg>
    </div>
  );
}

// Mini grid for inline display
export function MiniGrid({ 
  grid, 
  size = 4, 
  cellSize = 12,
  className,
  title,
}: GridDisplayProps) {
  return (
    <GridDisplay
      grid={grid}
      size={size}
      cellSize={cellSize}
      showValues={false}
      className={className}
      title={title}
    />
  );
}