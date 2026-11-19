import { ArrowUpRight, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { AmbientCanvas } from '@/components/brand/AmbientCanvas';
import { BrandMark } from '@/components/brand/BrandMark';
import { RegisterRow, SectionLabel } from '@/components/ui/register';
import { useBranding } from '@/hooks/useBranding';

interface PublicLayoutProps {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}

const principles = [
  {
    index: '01',
    title: 'Session integrity',
    description: 'Server-side sessions and CSRF protection on every write.',
  },
  {
    index: '02',
    title: 'Permission authority',
    description: 'Navigation follows effective backend permissions, never local guesses.',
  },
  {
    index: '03',
    title: 'Contract fidelity',
    description: 'Only documented endpoints, envelopes and status codes are used.',
  },
] as const;

export function PublicLayout({ children, eyebrow, title, description }: PublicLayoutProps) {
  const branding = useBranding();

  return (
    <main className="auth-canvas min-h-screen w-full max-w-full overflow-x-hidden lg:grid lg:grid-cols-auth">
      <aside
        data-audit="brand-panel"
        className="auth-brand-panel relative hidden min-h-screen overflow-hidden px-10 py-10 lg:flex lg:flex-col lg:justify-between xl:px-14"
      >
        <AmbientCanvas />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <BrandMark />
          <span className="mt-1 font-numeric text-2xs uppercase tracking-eyebrow-wide text-on-brand-quiet">
            Institutional edition
          </span>
        </div>

        <div className="relative z-10 max-w-xl py-10">
          <p className="eyebrow-wide flex items-center gap-2 text-accent-warm">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
            {eyebrow}
          </p>
          <h1 className="mt-6 max-w-lg font-display text-4xl font-semibold leading-tight tracking-display text-on-brand-strong xl:text-6xl">
            {title}
          </h1>
          <div className="mt-7 w-16"><div className="ledger-rule" /></div>
          <p className="mt-6 max-w-md text-base leading-relaxed text-on-brand-muted">{description}</p>

          <div className="mt-10 max-w-md">
            <SectionLabel tone="onBrand" index="EDAM /" className="mb-2">
              Operating principles
            </SectionLabel>
            {principles.map((principle) => (
              <RegisterRow
                key={principle.index}
                index={principle.index}
                title={principle.title}
                description={principle.description}
                tone="onBrand"
              />
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="ledger-rule" />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-on-brand-quiet">
            <span>© {new Date().getFullYear()} {branding.organizationName}</span>
            {branding.supportEmail && (
              <a
                className="inline-flex min-h-10 items-center gap-1 font-numeric text-2xs uppercase tracking-micro transition-colors hover:text-on-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                href={`mailto:${branding.supportEmail}`}
              >
                Support <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </aside>

      <section className="relative flex min-h-screen w-full max-w-full items-center justify-center px-4 py-6 sm:px-8 lg:px-10 xl:px-16">
        <div className="w-full max-w-lg">
          <div className="mb-7 flex items-center justify-between lg:hidden">
            <BrandMark className="text-brand-ink" compact />
            <span className="micro-label text-muted-foreground">{branding.appName}</span>
          </div>
          <div className="mb-6 lg:hidden">
            <p className="auth-eyebrow">{eyebrow}</p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-display">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
          {children}
          <div className="mt-6">
            <div className="ledger-rule" />
            <p className="mt-3 text-center font-numeric text-2xs uppercase tracking-micro text-muted-foreground">
              Authorized use only · governed by institution policy
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
