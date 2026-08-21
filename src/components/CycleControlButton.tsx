/**
 * Reusable tap-to-cycle control used for terrain and motor assistance.
 *
 * A cycle button is preferable to a tiny slider on a phone: the current value
 * is always visible, and each tap advances through a finite localized list.
 */
import { RotateCw, type LucideIcon } from 'lucide-react';
import type { Option } from '../types';

/**
 * Props for one large tappable cycle control.
 *
 * The control is used for short option lists where repeated taps are quick and
 * reliable on a phone-sized screen.
 */
/** Generic props keep the control type-safe for both supported option lists. */
interface CycleControlButtonProps<TValue extends number> {
  icon: LucideIcon;
  title: string;
  value: TValue;
  options: Option<TValue>[];
  hint: string;
  onChange: (value: TValue) => void;
}

/**
 * Large button that cycles through a fixed list of options.
 *
 * Example: tapping the terrain button changes Flat -> Slightly hilly -> Hilly.
 * The selected text is printed directly on the button so users immediately see
 * that the button is interactive and stateful.
 */
export function CycleControlButton<TValue extends number>({
  icon,
  title,
  value,
  options,
  hint,
  onChange
}: CycleControlButtonProps<TValue>) {
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );
  const selectedOption = options[selectedIndex] ?? options[0];
  const nextOption = options[(selectedIndex + 1) % options.length] ?? selectedOption;
  const Icon = icon;

  return (
    <button
      aria-label={`${title}: ${selectedOption.label}. ${hint}`}
      className="cycle-control-button"
      onClick={() => onChange(nextOption.value)}
      type="button"
    >
      <span className="cycle-control-icon" aria-hidden="true">
        <Icon className="ui-icon" strokeWidth={2.35} />
      </span>
      <span className="cycle-control-copy">
        <span className="cycle-control-title">{title}</span>
        <strong className="cycle-control-value" key={selectedOption.value}>
          {selectedOption.label}
        </strong>
        <span className="cycle-control-hint">{hint}</span>
      </span>
      <span className="cycle-level-indicator" aria-hidden="true">
        {options.map((option) => (
          <span
            className={option.value === value ? 'is-active' : undefined}
            key={option.value}
          />
        ))}
      </span>
      <RotateCw className="cycle-control-action" aria-hidden="true" strokeWidth={2.4} />
    </button>
  );
}
