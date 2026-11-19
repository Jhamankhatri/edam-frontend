import { createFileRoute } from '@tanstack/react-router';
import { ClipboardCheck } from 'lucide-react';
import { RequirePermission } from '@/auth/guards';
import { ModulePlaceholder } from '@/components/feedback/ModulePlaceholder';

function ApprovalsFoundation() {
  return (
    <RequirePermission>
      <ModulePlaceholder
        icon={ClipboardCheck}
        title="Approval Inbox"
        description="Foundation for assigned tasks and the 60-second approved-count poll. Task actions remain deferred to the approval module."
      />
    </RequirePermission>
  );
}

export const Route = createFileRoute('/app/approvals/')({ component: ApprovalsFoundation });
