import { ArrowUpRight, Layers3, type LucideIcon } from 'lucide-react';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ModulePlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  endpointGroup: string;
}

export function ModulePlaceholder({ icon: Icon, title, description, endpointGroup }: ModulePlaceholderProps) {
  return (
    <section className="space-y-5" aria-labelledby="module-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 id="module-heading" className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            <StatusBadge label="Foundation ready" variant="info" />
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        <Badge variant="outline" className="w-fit">{endpointGroup}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="rounded-2xl">
          <CardHeader>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-info">
              <Icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <CardTitle className="mt-3 text-base">Route and permission guard</CardTitle>
            <CardDescription>
              This route is protected by the centralized permission catalogue before any module content renders.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-success">
              <Layers3 aria-hidden="true" className="h-5 w-5" />
            </span>
            <CardTitle className="mt-3 text-base">API layer ready</CardTitle>
            <CardDescription>
              Session cookies, CSRF, envelopes, error normalization, and typed service functions are in place.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="rounded-2xl md:col-span-2 xl:col-span-1">
          <CardHeader>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-warning">
              <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
            </span>
            <CardTitle className="mt-3 text-base">Implementation intentionally deferred</CardTitle>
            <CardDescription>
              No business data or actions are simulated. The complete module starts only after this foundation is reviewed.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      <CardContent className="rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
        The backend remains authoritative. Any future screen in this module will call only the documented
        endpoints and will use the exact response envelope and permission codes from the handover contract.
      </CardContent>
    </section>
  );
}
