import { BatteryMedium, CircleEllipsis, Gauge, Route, type LucideIcon } from 'lucide-react';
import type { AppTranslations } from '../i18n';
import type { AppTab } from '../types';

interface BottomNavigationProps {
  activeTab: AppTab;
  t: AppTranslations;
  onTabChange: (tab: AppTab) => void;
}

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
    { tab: 'pressure', label: t.tabPressure, icon: Gauge },
    { tab: 'battery', label: t.tabBattery, icon: BatteryMedium },
    { tab: 'more', label: t.tabMore, icon: CircleEllipsis }
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
