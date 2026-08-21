/**
 * Primary navigation for the two focused workflows of the app.
 *
 * The component deliberately contains no routing library. App.tsx owns the
 * selected tab, while this file only renders choices and reports clicks.
 */
import { Gauge, Route, type LucideIcon } from 'lucide-react';
import type { AppTranslations } from '../i18n';
import type { AppTab } from '../types';

/** Values supplied by the parent navigation state. */
interface BottomNavigationProps {
  activeTab: AppTab;
  t: AppTranslations;
  onTabChange: (tab: AppTab) => void;
}

/** Internal view-model used to render each localized navigation button. */
interface NavigationItem {
  tab: AppTab;
  label: string;
  icon: LucideIcon;
}

/** Bottom tab bar used by all primary app screens. */
export function BottomNavigation({
  activeTab,
  t,
  onTabChange
}: BottomNavigationProps) {
  const items: NavigationItem[] = [
    { tab: 'range', label: t.tabRange, icon: Route },
    { tab: 'pressure', label: t.tabPressure, icon: Gauge }
  ];

  return (
    <nav className="bottom-navigation" aria-label="App">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.tab === activeTab;

        return (
          <button
            aria-current={isActive ? 'page' : undefined}
            className={isActive ? 'bottom-nav-item is-active' : 'bottom-nav-item'}
            key={item.tab}
            onClick={() => onTabChange(item.tab)}
            type="button"
          >
            <Icon className="bottom-nav-icon" aria-hidden="true" strokeWidth={2.35} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
