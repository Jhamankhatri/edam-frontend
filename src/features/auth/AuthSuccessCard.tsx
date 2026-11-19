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
        <span className="feedback-icon text-success">
          <CheckCircle2 aria-hidden="true" className="h-6 w-6" />
        </span>
        <div>
          <p className="auth-eyebrow"><CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />Verified</p>
          <CardTitle className="auth-title">{title}</CardTitle>
          <CardDescription className="auth-description">{message}</CardDescription>
        </div>
      </CardHeader>
      {detail && (
        <CardContent className="px-6 pb-0 sm:px-7">
          <div className="border-l-2 border-l-line-accent bg-surface-subtle px-3 py-2 font-numeric text-xs text-muted-foreground">{detail}</div>
        </CardContent>
      )}
      <CardContent className="p-6 sm:p-7">
        <div className="ledger-rule mb-6" />
        <Button className="w-full" size="lg" onClick={onAction}>{actionLabel}</Button>
      </CardContent>
    </Card>
  );
}
