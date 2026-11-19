import { createFileRoute } from '@tanstack/react-router';
import { Bell } from 'lucide-react';
import { RequirePermission } from '@/auth/guards';
import { ModulePlaceholder } from '@/components/feedback/ModulePlaceholder';

function NotificationsFoundation() {
  return (
    <RequirePermission>
      <ModulePlaceholder
        icon={Bell}
        title="Notifications"
        description="Foundation for the notification inbox and unread badge. The shell already polls the documented unread-count endpoint only when authorized."
      />
    </RequirePermission>
  );
}

export const Route = createFileRoute('/app/notifications/')({ component: NotificationsFoundation });
