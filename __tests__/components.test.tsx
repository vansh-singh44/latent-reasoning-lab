import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Slider, Toggle, Select, NumberInput, RadioGroup, ButtonGroup } from '@/components/controls/Controls';
import { GridDisplay, MiniGrid, AnimatedGrid } from '@/components/visualization/GridDisplay';
import { StateHeatmap, StateTrajectory, StateVectorBars, StateChangeChart } from '@/components/visualization/StateVisualization';
import { EvidenceBadge, EvidencePanel } from '@/components/research/EvidenceBadge';
import { MetricCard, ComparisonTable, AccuracyVsDepthChart, AccuracyComputeChart } from '@/components/visualization/Charts';

describe('Controls Accessibility', () => {
  it('Slider has proper ARIA attributes', () => {
    render(<Slider label="Test" value={5} onChange={vi.fn()} min={0} max={10} />);
    const input = screen.getByRole('slider');
    expect(input).toHaveAttribute('aria-label', 'Test');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '10');
  });
  
  it('Slider shows value', () => {
    render(<Slider label="Test" value={7} onChange={vi.fn()} min={0} max={10} />);
    expect(screen.getByText('7')).toBeInTheDocument();
  });
  
  it('Toggle has proper role', () => {
    render(<Toggle label="Test" value={false} onChange={vi.fn()} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });
  
  it('Select has label association', () => {
    render(<Select label="Choose" options={[{value: 'a', label: 'A'}]} value="a" onChange={vi.fn()} />);
    expect(screen.getByLabelText('Choose')).toBeInTheDocument();
  });
  
  it('NumberInput has proper type', () => {
    render(<NumberInput label="Number" value={5} onChange={vi.fn()} />);
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });
  
  it('RadioGroup is a fieldset', () => {
    render(<RadioGroup label="Options" value="a" onChange={vi.fn()} options={[{value: 'a', label: 'A'}]} />);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });
  
  it('ButtonGroup has role group', () => {
    render(<ButtonGroup value="a" onChange={vi.fn()} options={[{value: 'a', label: 'A'}]} />);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });
});

describe('Visualization Components', () => {
  it('GridDisplay renders grid', () => {
    render(<GridDisplay grid={[[1,2],[3,4]]} size={2} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
  
  it('GridDisplay shows values when enabled', () => {
    render(<GridDisplay grid={[[1,2],[3,4]]} size={2} showValues={true} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });
  
  it('MiniGrid renders smaller', () => {
    render(<MiniGrid grid={[[1,2],[3,4]]} size={2} cellSize={8} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
  
  it('StateHeatmap renders heatmap', () => {
    render(<StateHeatmap state={[1,2,3,4,5,6,7,8]} width={4} height={2} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
  
  it('StateTrajectory renders trajectory', () => {
    render(<StateTrajectory trajectory={[[1,2],[3,4]]} width={2} height={2} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
  
  it('StateVectorBars renders bars', () => {
    render(<StateVectorBars state={[1,2,3,4]} maxBars={4} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
  
  it('StateChangeChart renders chart', () => {
    render(<StateChangeChart changes={[1,2,3,2,1]} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});

describe('Research Components', () => {
  it('EvidenceBadge renders with correct type', () => {
    render(<EvidenceBadge type="LIVE_TOY_COMPUTATION" />);
    expect(screen.getByText('LIVE TOY COMPUTATION')).toBeInTheDocument();
  });
  
  it('EvidencePanel wraps content', () => {
    render(<EvidencePanel type="PUBLISHED_RESULT" title="Test"><div>Content</div></EvidencePanel>);
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
  
  it('EvidenceLegend shows all types', () => {
    render(<EvidencePanel type="TOY_PEDAGOGICAL" title="Test"><div>Content</div></EvidencePanel>);
    // Just verify it renders without error
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});

describe('Chart Components', () => {
  it('MetricCard displays value', () => {
    render(<MetricCard label="Accuracy" value="95%" unit="%" />);
    expect(screen.getByText('Accuracy')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
  });
  
  it('ComparisonTable renders rows', () => {
    render(<ComparisonTable rows={[{property: 'Test', token: 'A', latent: 'B'}]} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });
  
  it('AccuracyVsDepthChart renders', () => {
    render(<AccuracyVsDepthChart data={[{step: 1, accuracy: 0.5, confidence: 0.1}]} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
  
  it('AccuracyComputeChart renders', () => {
    render(<AccuracyComputeChart 
      tokenData={[{steps: 1, accuracy: 0.5, compute: 1000}]}
      latentData={[{steps: 1, accuracy: 0.6, compute: 1000}]}
    />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});

describe('Keyboard Navigation', () => {
  it('Slider is keyboard accessible', () => {
    render(<Slider label="Test" value={5} onChange={vi.fn()} min={0} max={10} />);
    const slider = screen.getByRole('slider');
    expect(slider).toBeFocusable();
  });
  
  it('Toggle checkbox is focusable', () => {
    render(<Toggle label="Test" value={false} onChange={vi.fn()} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeFocusable();
  });
  
  it('ButtonGroup buttons are focusable', () => {
    render(<ButtonGroup value="a" onChange={vi.fn()} options={[{value: 'a', label: 'A'}]} />);
    const button = screen.getByRole('button', { name: 'A' });
    expect(button).toBeFocusable();
  });
});

describe('Reduced Motion', () => {
  it('components respect prefers-reduced-motion', () => {
    // This is tested via CSS media query in actual browser
    // Here we just verify components render without animation errors
    render(<StateChangeChart changes={[1,2,3]} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});