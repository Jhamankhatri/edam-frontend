import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthSuccessCardProps {
  title: string;
  message: string;
  detail?: string;
  actionLabel: string;
  onAction: () => void;
}

export function AuthSuccessCard({ title, message, detail, actionLabel, onAction }: AuthSuccessCardProps) {
  return (
    <Card className="elevated-card">
      <CardHeader className="gap-4 p-6 sm:p-7">
        <span className="feedback-icon bg-status-success-surface text-success">
          <CheckCircle2 aria-hidden="true" className="h-6 w-6" />
        </span>
        <div>
          <CardTitle className="font-display text-2xl">{title}</CardTitle>
          <CardDescription className="mt-2 leading-relaxed">{message}</CardDescription>
        </div>
      </CardHeader>
      {detail && (
        <CardContent className="px-6 pb-0 sm:px-7">
          <div className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">{detail}</div>
        </CardContent>
      )}
      <CardContent className="p-6 sm:p-7">
        <Button className="w-full" onClick={onAction}>{actionLabel}</Button>
      </CardContent>
    </Card>
  );
}
