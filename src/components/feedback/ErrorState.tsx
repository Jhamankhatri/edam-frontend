import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
  offline?: boolean;
  correlationId?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
  offline = false,
  correlationId,
}: ErrorStateProps) {
  return (
    <Alert variant={offline ? 'warning' : 'destructive'} className="max-w-xl">
      <div>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
        {correlationId && (
          <AlertDescription className="mt-2 font-mono text-xs">Support reference: {correlationId}</AlertDescription>
        )}
        {onRetry && (
          <Button variant="outline" className="mt-4" onClick={onRetry}>
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
            Try again
          </Button>
        )}
      </div>
    </Alert>
  );
}
