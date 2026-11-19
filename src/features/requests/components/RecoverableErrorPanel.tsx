import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ApiError, normalizeUnknownError } from '@/api/errors';
import { humanizeField } from '../format';
import { recoverableErrorState, type RecoveryAction } from '../recoverable-errors';

interface RecoverableErrorPanelProps {
  error: unknown;
  onStartNewKey?: () => void;
  onRetrySameKey?: () => void;
  onReconcile?: () => void;
  onReload?: () => void;
}

const ACTION_LABELS: Readonly<Record<RecoveryAction, string>> = {
  'new-key': 'Start a new submission',
  'same-key': 'Retry safely',
  reconcile: 'Refresh register',
  reload: 'Reload latest record',
  validate: 'Correct the highlighted fields',
  none: 'Dismiss',
};

export function RecoverableErrorPanel({
  error,
  onStartNewKey,
  onRetrySameKey,
  onReconcile,
  onReload,
}: RecoverableErrorPanelProps) {
  const state = recoverableErrorState(error);
  const apiError = normalizeUnknownError(error);
  const fieldErrors = apiError instanceof ApiError ? apiError.fieldErrors ?? [] : [];
  const onAction = (): void => {
    switch (state.action) {
      case 'new-key': onStartNewKey?.(); break;
      case 'same-key': onRetrySameKey?.(); break;
      case 'reconcile': onReconcile?.(); break;
      case 'reload': onReload?.(); break;
      case 'validate':
      case 'none': break;
    }
  };
  const showButton = state.action !== 'validate' && state.action !== 'none';

  return (
    <Alert variant={state.action === 'validate' ? 'warning' : 'destructive'}>
      <div className="min-w-0">
        <AlertTitle>{state.title}</AlertTitle>
        <AlertDescription>{state.message}</AlertDescription>
        {fieldErrors.length > 0 && (
          <ul className="mt-3 space-y-1 text-xs leading-relaxed">
            {fieldErrors.map((detail) => (
              <li key={`${detail.field}-${detail.message}`}>
                <span className="font-numeric font-semibold">{humanizeField(detail.field)}:</span>{' '}
                {detail.message}
              </li>
            ))}
          </ul>
        )}
        {state.correlationId && (
          <AlertDescription className="mt-2 font-numeric text-xs">
            Support reference: {state.correlationId}
          </AlertDescription>
        )}
        {showButton && (
          <Button variant="outline" className="mt-4" onClick={onAction}>
            {ACTION_LABELS[state.action]}
          </Button>
        )}
      </div>
    </Alert>
  );
}
