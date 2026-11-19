import { createFileRoute } from '@tanstack/react-router';
import { FileText } from 'lucide-react';
import { RequirePermission } from '@/auth/guards';
import { ModulePlaceholder } from '@/components/feedback/ModulePlaceholder';

function RequestDetailFoundation() {
  const { id } = Route.useParams();
  return (
    <RequirePermission>
      <ModulePlaceholder
        icon={FileText}
        title="Request Detail"
        description={`Foundation for summary, items, timeline, and per-request documents. Route reference: ${id}.`}
      />
    </RequirePermission>
  );
}

export const Route = createFileRoute('/app/requests/$id/')({ component: RequestDetailFoundation });
