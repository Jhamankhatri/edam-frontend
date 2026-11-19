import { createFileRoute } from '@tanstack/react-router';
import { Files } from 'lucide-react';
import { RequirePermission } from '@/auth/guards';
import { ModulePlaceholder } from '@/components/feedback/ModulePlaceholder';

function MyRequestsFoundation() {
  return (
    <RequirePermission>
      <ModulePlaceholder
        icon={Files}
        title="My Requests"
        description="Foundation for the requester's own list, filtering, and scoped actions. Future data comes only from the documented request endpoint."
      />
    </RequirePermission>
  );
}

export const Route = createFileRoute('/app/requests/mine')({ component: MyRequestsFoundation });
