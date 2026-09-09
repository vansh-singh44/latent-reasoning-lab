'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface SliderProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  marks?: { value: number; label: string }[];
  unit?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ label, value, onChange, min, max, step = 1, marks, unit, className, disabled, id, ...props }, ref) => {
    const sliderId = id || `slider-${Math.random().toString(36).substring(7)}`;
    const percentage = ((value - min) / (max - min)) * 100;
    
    return (
      <div className={cn('w-full', className)}>
        {label && (
          <div className="flex items-center justify-between mb-2">
            <label htmlFor={sliderId} className="text-sm font-mono text-lab-textMuted">
              {label}
            </label>
            <span className="text-sm font-mono text-lab-accent tabular-nums">
              {value}{unit ? ` ${unit}` : ''}
            </span>
          </div>
        )}
        
        <div className="relative">
          <input
            ref={ref}
            type="range"
            id={sliderId}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            disabled={disabled}
            className="slider-input"
            aria-label={label}
            {...props}
          />
          
          {/* Track highlight */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 left-0 h-2 rounded-full bg-lab-accent/30 pointer-events-none"
            style={{ width: `${percentage}%` }}
            aria-hidden="true"
          />
          
          {/* Marks */}
          {marks && marks.length > 0 && (
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pt-6 pointer-events-none">
              {marks.map((mark) => {
                const markPercentage = ((mark.value - min) / (max - min)) * 100;
                return (
                  <div key={mark.value} className="flex flex-col items-center" style={{ left: `${markPercentage}%` }}>
                    <div className="w-0.5 h-2 bg-lab-border" />
                    <span className="text-[10px] text-lab-textMuted font-mono mt-1">{mark.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';

interface ToggleProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
  description?: string;
}

export function Toggle({ label, value, onChange, disabled, className, description }: ToggleProps) {
  return (
    <label className={cn('flex items-center gap-3 cursor-pointer', className)}>
      <div className="relative">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className={cn(
          'w-11 h-6 rounded-full transition-colors duration-150',
          'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-lab-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-lab-bg',
          'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
          value ? 'bg-lab-accent' : 'bg-lab-border'
        )}>
          <div className={cn(
            'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-lab-bg shadow-lg transition-transform duration-150',
            'peer-disabled:cursor-not-allowed',
            value ? 'translate-x-5' : 'translate-x-0'
          )} />
        </div>
      </div>
      <div className="flex flex-col">
        <span className={cn('text-sm font-medium', disabled ? 'text-lab-textMuted' : 'text-lab-text')}>
          {label}
        </span>
        {description && (
          <span className="text-xs text-lab-textMuted font-mono">{description}</span>
        )}
      </div>
    </label>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  className?: string;
  error?: string;
}

export function Select({ label, options, className, error, id, ...props }: SelectProps) {
  const selectId = id || `select-${Math.random().toString(36).substring(7)}`;
  
  return (
    <div className={cn('w-full', className)}>
      <label htmlFor={selectId} className="block text-sm font-mono text-lab-textMuted mb-1">
        {label}
      </label>
      <select
        id={selectId}
        className={cn('input-field', error && 'border-lab-danger')}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-lab-danger mt-1">{error}</p>}
    </div>
  );
}

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  className?: string;
  error?: string;
  id?: string;
}

export function NumberInput({ label, value, onChange, min, max, step = 1, unit, className, error, id, ...props }: NumberInputProps) {
  const inputId = id || `number-${Math.random().toString(36).substring(7)}`;
  
  return (
    <div className={cn('w-full', className)}>
      <label htmlFor={inputId} className="block text-sm font-mono text-lab-textMuted mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          id={inputId}
          value={value}
          onChange={(e) => {
            const val = e.target.value === '' ? 0 : Number(e.target.value);
            onChange(Math.max(min ?? -Infinity, Math.max(max ?? Infinity, val)));
          }}
          min={min}
          max={max}
          step={step}
          className={cn('input-field pr-12', error && 'border-lab-danger')}
          {...props}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-lab-textMuted font-mono">
            {unit}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-lab-danger mt-1">{error}</p>}
    </div>
  );
}

interface RadioGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; description?: string }[];
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function RadioGroup({ label, value, onChange, options, className, orientation = 'vertical' }: RadioGroupProps) {
  return (
    <fieldset className={cn('w-full', className)}>
      <legend className="text-sm font-mono text-lab-textMuted mb-2">{label}</legend>
      <div className={cn('flex gap-4', orientation === 'horizontal' ? 'flex-wrap' : 'flex-col')}>
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              value={opt.value}
              checked={value === opt.value}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only peer"
            />
            <div className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150',
              'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-lab-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-lab-bg',
              value === opt.value ? 'border-lab-accent' : 'border-lab-border',
              'peer-checked:border-lab-accent'
            )}>
              <div className={cn(
                'w-2.5 h-2.5 rounded-full transition-all duration-150',
                value === opt.value ? 'bg-lab-accent scale-100' : 'bg-transparent scale-0'
              )} />
            </div>
            <div>
              <span className="text-sm font-medium text-lab-text">{opt.label}</span>
              {opt.description && (
                <span className="block text-xs text-lab-textMuted font-mono">{opt.description}</span>
              )}
            </div>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

interface ButtonGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; icon?: React.ReactNode }[];
  className?: string;
}

export function ButtonGroup({ value, onChange, options, className }: ButtonGroupProps) {
  return (
    <div className={cn('flex gap-2 flex-wrap', className)} role="group" aria-label="Options">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-accent focus-visible:ring-offset-2 focus-visible:ring-offset-lab-bg',
            value === opt.value
              ? 'bg-lab-accent text-lab-bg'
              : 'bg-lab-panelHover text-lab-textMuted hover:text-lab-text hover:bg-lab-panel border border-lab-border'
          )}
        >
          {opt.icon && <span className="inline-flex items-center gap-1">{opt.icon}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  );
}