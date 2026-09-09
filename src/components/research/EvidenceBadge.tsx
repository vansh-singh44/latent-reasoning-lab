'use client';

import { cn } from '@/lib/utils';

type EvidenceType = 
  | 'LIVE_TOY_COMPUTATION'
  | 'PRECOMPUTED_PUBLISHED_RESULT'
  | 'PUBLISHED_RESULT'
  | 'REPORTED_BY_AUTHORS'
  | 'INDEPENDENTLY_EVALUATED'
  | 'TOY_PEDAGOGICAL'
  | 'ILLUSTRATIVE_DIAGRAM';

const EVIDENCE_CONFIG: Record<EvidenceType, { label: string; description: string; color: string; bgColor: string; borderColor: string }> = {
  LIVE_TOY_COMPUTATION: {
    label: 'LIVE TOY COMPUTATION',
    description: 'Computed in real-time in your browser from a toy model',
    color: '#00d4aa',
    bgColor: '#052e26',
    borderColor: '#00d4aa',
  },
  PRECOMPUTED_PUBLISHED_RESULT: {
    label: 'PRECOMPUTED RESULT',
    description: 'Precomputed from toy model runs and saved as fixture',
    color: '#60a5fa',
    bgColor: '#1a2a4a',
    borderColor: '#60a5fa',
  },
  PUBLISHED_RESULT: {
    label: 'PUBLISHED RESULT',
    description: 'Directly reported in the cited research paper',
    color: '#ffb84d',
    bgColor: '#3d2a0a',
    borderColor: '#ffb84d',
  },
  REPORTED_BY_AUTHORS: {
    label: 'REPORTED BY AUTHORS',
    description: 'Claim made by paper authors; not independently verified',
    color: '#ffb84d',
    bgColor: '#3d2a0a',
    borderColor: '#ffb84d',
  },
  INDEPENDENTLY_EVALUATED: {
    label: 'INDEPENDENTLY EVALUATED',
    description: 'Verified by third-party reproduction',
    color: '#34d399',
    bgColor: '#0a3d2a',
    borderColor: '#34d399',
  },
  TOY_PEDAGOGICAL: {
    label: 'TOY / PEDAGOGICAL',
    description: 'Simplified simulation for teaching; not a research model',
    color: '#8b9ab8',
    bgColor: '#1a2234',
    borderColor: '#2a3548',
  },
  ILLUSTRATIVE_DIAGRAM: {
    label: 'ILLUSTRATIVE DIAGRAM',
    description: 'Conceptual visualization; not a computational result',
    color: '#a78bfa',
    bgColor: '#2a1a4a',
    borderColor: '#a78bfa',
  },
};

interface EvidenceBadgeProps {
  type: EvidenceType;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  citation?: string;
  className?: string;
}

export function EvidenceBadge({ type, size = 'md', showTooltip = true, citation, className }: EvidenceBadgeProps) {
  const config = EVIDENCE_CONFIG[type];
  const badgeId = `evidence-${Math.random().toString(36).substring(7)}`;
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };
  
  return (
    <span 
      id={badgeId}
      className={cn(
        'inline-flex items-center gap-1.5 font-mono font-medium rounded-md border',
        'transition-all duration-150',
        sizeStyles[size],
        className
      )}
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
      }}
      role="img"
      aria-label={`${config.label}: ${config.description}`}
    >
      <span className="relative flex items-center">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }} />
        {type === 'LIVE_TOY_COMPUTATION' && (
          <span className="ml-1 w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: config.color }} />
        )}
        <span className="ml-1">{config.label}</span>
      </span>
      
      {showTooltip && (
        <>
          <style jsx>{`
            .tooltip { 
              position: absolute; 
              bottom: 100%; 
              left: 50%; 
              transform: translateX(-50%); 
              margin-bottom: 8px; 
              padding: 8px 12px; 
              background: #111827; 
              border: 1px solid #2a3548; 
              border-radius: 6px; 
              font-size: 11px; 
              white-space: nowrap; 
              z-index: 50; 
              opacity: 0; 
              visibility: hidden; 
              transition: opacity 0.15s, visibility 0.15s; 
              box-shadow: 0 4px 24px rgba(0,0,0,0.4);
            }
            .tooltip::after { 
              content: ''; 
              position: absolute; 
              top: 100%; 
              left: 50%; 
              transform: translateX(-50%); 
              border: 6px solid transparent; 
              border-top-color: #2a3548; 
            }
            .badge-wrapper:hover .tooltip { opacity: 1; visibility: visible; }
          `}</style>
        </>
      )}
      
      {citation && (
        <span className="ml-1 px-1.5 py-0.5 text-[9px] font-mono rounded" style={{ 
          backgroundColor: config.bgColor, 
          borderColor: config.borderColor 
        }}>
          {citation}
        </span>
      )}
    </span>
  );
}

interface EvidencePanelProps {
  type: EvidenceType;
  title: string;
  children: React.ReactNode;
  citation?: string;
  className?: string;
}

export function EvidencePanel({ type, title, children, citation, className }: EvidencePanelProps) {
  const config = EVIDENCE_CONFIG[type];
  
  return (
    <div 
      className={cn('card relative overflow-hidden', className)}
      style={{ borderColor: config.borderColor }}
    >
      <div 
        className="absolute top-0 right-0"
        style={{ 
          background: `linear-gradient(135deg, ${config.color}20, ${config.color}00)`,
        }}
      >
        <EvidenceBadge type={type} size="sm" citation={citation} />
      </div>
      <div className="relative z-10">
        <h3 className="font-display text-lg font-semibold text-lab-text mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}

export function EvidenceLegend({ className }: { className?: string }) {
  return (
    <div className={cn('card p-4', className)}>
      <h4 className="font-display text-sm font-semibold text-lab-text mb-3">Evidence Types</h4>
      <div className="flex flex-wrap gap-2">
        {Object.entries(EVIDENCE_CONFIG).map(([key, config]) => (
          <EvidenceBadge key={key} type={key as EvidenceType} size="sm" />
        ))}
      </div>
    </div>
  );
}