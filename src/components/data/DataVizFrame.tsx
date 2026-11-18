import { BarChart3 } from 'lucide-react';
import { Surface } from '@/components/ui/surface';

/**
 * Chart/data-presentation foundation for future reporting modules. It renders
 * an explicit empty state: axis guides, legend tokens and accessible copy only.
 * No business metrics, series values, exports or controls are simulated.
 */
export function DataVizFrame() {
  return (
    <Surface variant="raised" padding="md" className="overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="micro-label text-muted-foreground">Reporting foundation</p>
          <h2 className="mt-1 font-display text-lg font-semibold">Data presentation, ready for live data</h2>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-status-info-surface text-info">
          <BarChart3 aria-hidden="true" className="h-5 w-5" />
        </span>
      </div>

      <div
        role="img"
        aria-label="Empty chart frame. No business data is displayed until the reporting module is implemented."
        className="mt-5 rounded-xl border border-line-soft bg-surface-subtle p-4"
      >
        <div aria-hidden="true" className="relative h-32">
          <div className="absolute inset-0 flex flex-col justify-between">
            <span className="border-t border-chart-grid" />
            <span className="border-t border-chart-grid" />
            <span className="border-t border-chart-grid" />
            <span className="border-t border-chart-grid" />
            <span className="border-t border-chart-axis" />
          </div>
          <div className="absolute inset-y-0 left-0 border-l border-chart-axis" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground">
              Awaiting live module data
            </span>
          </div>
        </div>
        <div aria-hidden="true" className="mt-3 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-2xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-chart-1" /> Series 1
          </span>
          <span className="flex items-center gap-1.5 text-2xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-chart-2" /> Series 2
          </span>
          <span className="flex items-center gap-1.5 text-2xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-chart-3" /> Series 3
          </span>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Series colours, grid lines and axis treatments are governed by the shared chart tokens. Future
        reports bind to documented backend responses; no values are fabricated here.
      </p>
    </Surface>
  );
}
