import { createFileRoute } from '@tanstack/react-router';
import { Gavel } from 'lucide-react';
import { RequirePermission } from '@/auth/guards';
import { ModulePlaceholder } from '@/components/feedback/ModulePlaceholder';

function ApprovalCaseFoundation() {
  const { taskId } = Route.useParams();
  return (
    <RequirePermission>
      <ModulePlaceholder
        icon={Gavel}
        title="Approval Case"
        description={`Foundation for the server-authoritative case file and availableActions UI. Route reference: ${taskId}.`}
        endpointGroup="APL-003 / APL-004…008"
      />
    </RequirePermission>
  );
}

export const Route = createFileRoute('/app/approvals/tasks/$taskId')({ component: ApprovalCaseFoundation });
