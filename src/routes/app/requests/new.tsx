import { createFileRoute } from '@tanstack/react-router';
import { FilePlus2 } from 'lucide-react';
import { RequirePermission } from '@/auth/guards';
import { ModulePlaceholder } from '@/components/feedback/ModulePlaceholder';

function NewRequestFoundation() {
  return (
    <RequirePermission>
      <ModulePlaceholder
        icon={FilePlus2}
        title="New Request"
        description="Foundation for the validated multi-section request form and documented lookup selectors. No lookup endpoints are invented in Step 1."
      />
    </RequirePermission>
  );
}

export const Route = createFileRoute('/app/requests/new')({ component: NewRequestFoundation });
