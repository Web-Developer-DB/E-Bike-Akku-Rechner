import type { LucideIcon } from 'lucide-react';
import type { Option } from '../types';

/**
 * Props for a generic numeric slider card.
 *
 * TValue keeps the slider strongly typed, so terrain and assistance levels stay
 * limited to their allowed values.
 */
interface SliderCardProps<TValue extends number> {
  icon: LucideIcon;
  title: string;
  value: TValue;
  options: Option<TValue>[];
  onChange: (value: TValue) => void;
}

/**
 * Reusable slider card used for terrain and assistance.
 *
 * It shows the selected label in large text, renders a native range input for
 * accessibility, and displays all possible labels below the slider.
 */
export function SliderCard<TValue extends number>({
  icon,
  title,
  value,
  options,
  onChange
}: SliderCardProps<TValue>) {
  /** Finds the text label that belongs to the current numeric slider value. */
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  /** React components must start with an uppercase variable name. */
  const Icon = icon;

  return (
    <section className="card slider-card" aria-labelledby={`${title}-title`}>
      <div className="card-heading">
        <span className="icon-badge" aria-hidden="true">
          <Icon className="ui-icon" strokeWidth={2.35} />
        </span>
        <h2 id={`${title}-title`}>{title}</h2>
      </div>
      <p className="slider-current">{selectedOption.label}</p>
      {/* Native range inputs emit strings, so onChange converts back to TValue. */}
      <input
        aria-label={title}
        className="slider-input"
        max={options.length}
        min={1}
        onChange={(event) => onChange(Number(event.target.value) as TValue)}
        step={1}
        type="range"
        value={value}
      />
      <div className="slider-labels" aria-hidden="true">
        {options.map((option) => (
          <span
            className={option.value === value ? 'is-active' : undefined}
            key={option.value}
          >
            {option.label}
          </span>
        ))}
      </div>
    </section>
  );
}
