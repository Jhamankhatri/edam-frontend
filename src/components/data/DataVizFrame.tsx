import { BarChart3 } from 'lucide-react';
import { Surface } from '@/components/ui/surface';
import { SectionLabel } from '@/components/ui/register';

const horizontalTicks = [0, 1, 2, 3, 4];
const verticalTicks = [0, 1, 2, 3];

/**
 * Reporting plate for future modules: a ruled ledger with an explicit empty
 * state. Axis ticks carry no labels and no values, because no business data,
 * dates, series, exports or fictional activity exist in this foundation.
 */
export function DataVizFrame() {
  return (
    <Surface variant="flat" padding="md" className="overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <SectionLabel index="01">Reporting foundation</SectionLabel>
          <h2 className="mt-3 font-display text-xl font-semibold tracking-display">
            A ledger, awaiting its first entry.
          </h2>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line-accent bg-surface-subtle text-primary">
          <BarChart3 aria-hidden="true" className="h-5 w-5" />
        </span>
      </div>

      <div
        role="img"
        aria-label="Empty reporting plate. No business data, dates or values are displayed until the reporting module is implemented."
        className="reporting-plate mt-5 rounded-lg p-4"
      >
        <div aria-hidden="true" className="relative h-40">
          <div className="absolute inset-y-0 left-0 border-l border-chart-grid-strong" />
          <div className="absolute inset-x-0 bottom-0 border-t border-chart-grid-strong" />
          <div className="absolute inset-x-0 bottom-0 flex justify-between">
            {horizontalTicks.map((tick) => (
              <span key={tick} className="h-2 w-px bg-chart-grid-strong" />
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 flex flex-col justify-between py-2">
            {verticalTicks.map((tick) => (
              <span key={tick} className="h-px w-2 bg-chart-grid-strong" />
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="preview-stamp rounded-md px-4 py-2">No live data</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 font-numeric text-2xs uppercase tracking-micro text-on-brand-quiet">
          <span>Reporting module · deferred</span>
          <span>—</span>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Grid, axis and series treatments are governed by the shared chart tokens. Future reports bind
        only to documented backend responses; no values are fabricated here.
      </p>
    </Surface>
  );
}
