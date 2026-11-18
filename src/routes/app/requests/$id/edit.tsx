import { createFileRoute } from '@tanstack/react-router';
import { PenLine } from 'lucide-react';
import { RequirePermission } from '@/auth/guards';
import { ModulePlaceholder } from '@/components/feedback/ModulePlaceholder';

function EditRequestFoundation() {
  return (
    <RequirePermission>
      <ModulePlaceholder
        icon={PenLine}
        title="Edit Request"
        description="Foundation for the guarded edit workflow, server field errors, and concurrency handling. No optimistic state changes are introduced yet."
        endpointGroup="REQ-003 / REQ-004 · request:edit"
      />
    </RequirePermission>
  );
}

export const Route = createFileRoute('/app/requests/$id/edit')({ component: EditRequestFoundation });
