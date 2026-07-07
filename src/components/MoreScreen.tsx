import {
  Bike,
  ChevronRight,
  FileText,
  Info,
  MessageCircle,
  Ruler,
  Settings,
  ShieldCheck,
  UserRound,
  Wrench,
  type LucideIcon
} from 'lucide-react';
import type { AppTranslations } from '../i18n';
import type { CalculatorSettings } from '../types';

interface MoreScreenProps {
  settings: CalculatorSettings;
  t: AppTranslations;
  onOpenSettings: () => void;
}

interface MoreItem {
  label: string;
  icon: LucideIcon;
  value?: string;
  onClick?: () => void;
}

/** Secondary app area for data management and informational entries. */
export function MoreScreen({ settings, t, onOpenSettings }: MoreScreenProps) {
  const items: MoreItem[] = [
    { label: t.manageBikeDataLabel, icon: Bike, onClick: onOpenSettings },
    { label: t.profilesLabel, icon: UserRound },
    { label: t.maintenanceLabel, icon: Wrench },
    {
      label: t.unitsLabel,
      icon: Ruler,
      value: settings.pressureUnit === 'bar' ? t.barLabel : t.psiLabel,
      onClick: onOpenSettings
    },
    { label: t.appSettingsLabel, icon: Settings, onClick: onOpenSettings },
    { label: t.aboutAppLabel, icon: Info },
    { label: t.feedbackLabel, icon: MessageCircle },
    { label: t.privacyLabel, icon: ShieldCheck },
    { label: t.legalNoticeLabel, icon: FileText }
  ];

  return (
    <main className="tab-screen">
      <header className="mobile-screen-header centered">
        <h1>{t.moreTitle}</h1>
      </header>

      <section className="more-list" aria-label={t.moreListAriaLabel}>
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button
              className="card more-list-item"
              key={item.label}
              onClick={item.onClick}
              type="button"
            >
              <span className="more-item-label">
                <Icon className="row-icon" aria-hidden="true" strokeWidth={2.25} />
                {item.label}
              </span>
              <span className="more-item-trailing">
                {item.value ? <span>{item.value}</span> : null}
                <ChevronRight className="chevron-icon" aria-hidden="true" strokeWidth={2.3} />
              </span>
            </button>
          );
        })}
      </section>
    </main>
  );
}
