import type { LucideIcon } from 'lucide-react';
import { DataVizFrame } from '@/components/data/DataVizFrame';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { EditorialPanel, RegisterRow, SectionLabel } from '@/components/ui/register';
import { Surface } from '@/components/ui/surface';

interface ModulePlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const foundationRows = [
  {
    index: '01',
    title: 'Route and permission guard',
    description: 'Every route is protected by the centralized permission catalogue before module content renders.',
  },
  {
    index: '02',
    title: 'API layer ready',
    description: 'Session cookies, CSRF, response envelopes, error normalization and typed service functions are in place.',
  },
  {
    index: '03',
    title: 'Implementation intentionally deferred',
    description: 'No business data or actions are simulated. The module starts only after this foundation is reviewed.',
  },
] as const;

export function ModulePlaceholder({ icon: Icon, title, description }: ModulePlaceholderProps) {
  return (
    <section className="space-y-6 sm:space-y-8" aria-labelledby="module-heading">
      <PageHeader
        id="module-heading"
        eyebrow="EDAM / Workspace register"
        title={title}
        description={description}
        status={<Badge variant="preview">Development preview</Badge>}
        meta={<span className="font-numeric text-2xs uppercase tracking-micro text-muted-foreground">Foundation / 01</span>}
      />

      <EditorialPanel
        eyebrow="Workspace statement"
        title="A governed workspace, ready for what comes next."
        description="No business metrics, transactions or institutional activity are displayed here. This foundation makes every future module consistent, permission-aware and contract-faithful."
        aside={
          <div className="flex items-center gap-4 lg:justify-end">
            <span className="flex h-14 w-14 items-center justify-center rounded-lg border border-line-accent text-on-brand">
              <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.6} />
            </span>
            <span className="font-display text-5xl font-semibold tracking-display text-accent-warm">01</span>
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-5">
        <Surface variant="flat" padding="md" className="lg:col-span-3">
          <SectionLabel index="02">Foundation register</SectionLabel>
          <div className="mt-2">
            {foundationRows.map((row) => (
              <RegisterRow
                key={row.index}
                index={row.index}
                title={row.title}
                description={row.description}
              />
            ))}
          </div>
        </Surface>
        <div className="lg:col-span-2">
          <DataVizFrame />
        </div>
      </div>

      <div>
        <div className="ledger-rule" />
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <p className="shrink-0 font-numeric text-2xs uppercase tracking-micro text-muted-foreground">
            Contract authority · backend remains authoritative
          </p>
          <p className="max-w-xl text-xs leading-relaxed text-muted-foreground">
            Any future screen in this module will call only documented endpoints and use the exact
            response envelope and permission codes from the handover contract. No values or writes
            are simulated in this foundation.
          </p>
        </div>
      </div>
    </section>
  );
}
