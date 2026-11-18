import { ArrowUpRight, Layers3, type LucideIcon } from 'lucide-react';
import { DataVizFrame } from '@/components/data/DataVizFrame';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { Surface } from '@/components/ui/surface';

interface ModulePlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  endpointGroup: string;
}

export function ModulePlaceholder({ icon: Icon, title, description, endpointGroup }: ModulePlaceholderProps) {
  return (
    <section className="space-y-5 sm:space-y-6" aria-labelledby="module-heading">
      <PageHeader
        id="module-heading"
        eyebrow="EDAM workspace"
        title={title}
        description={description}
        status={<StatusBadge label="Foundation ready" variant="info" />}
        meta={<Badge variant="outline" className="font-numeric">{endpointGroup}</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Surface padding="md">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-status-info-surface text-info">
            <Icon aria-hidden="true" className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-base font-semibold">Route and permission guard</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This route is protected by the centralized permission catalogue before any module content renders.
          </p>
        </Surface>
        <Surface padding="md">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-status-success-surface text-success">
            <Layers3 aria-hidden="true" className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-base font-semibold">API layer ready</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Session cookies, CSRF, envelopes, error normalization, and typed service functions are in place.
          </p>
        </Surface>
        <Surface padding="md" className="md:col-span-2 xl:col-span-1">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-status-warning-surface text-warning">
            <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-base font-semibold">Implementation intentionally deferred</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            No business data or actions are simulated. The complete module starts only after this foundation is reviewed.
          </p>
        </Surface>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <DataVizFrame />
        </div>
        <Surface variant="quiet" padding="md" className="lg:col-span-2">
          <p className="micro-label text-primary">Contract authority</p>
          <h2 className="mt-2 font-display text-lg font-semibold">Backend remains authoritative</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Any future screen in this module will call only the documented endpoints and will use the
            exact response envelope and permission codes from the handover contract. No values or
            writes are simulated in this foundation.
          </p>
        </Surface>
      </div>
    </section>
  );
}
