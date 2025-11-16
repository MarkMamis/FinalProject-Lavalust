import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ConfirmationAlertProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'default' | 'warning';
  /** When true, show a single full-width action button (Confirm) and hide the cancel button */
  singleAction?: boolean;
}

export function ConfirmationAlert({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  singleAction = false,
}: ConfirmationAlertProps) {
  if (!open) return null;

  const getIconColor = () => {
    switch (variant) {
      case 'destructive':
        return 'text-destructive';
      case 'warning':
        return 'text-warning';
      default:
        return 'text-primary';
    }
  };

  const getButtonColor = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-destructive hover:bg-destructive/90';
      case 'warning':
        return 'bg-warning hover:bg-warning/90';
      default:
        return 'bg-primary hover:bg-primary/90';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md border-2 border-primary/20 bg-card shadow-lg">
        <div className="flex flex-col items-center justify-center space-y-4 p-6">
          {/* Icon */}
          <div className={`flex h-16 w-16 items-center justify-center rounded-full ${variant === 'destructive' ? 'bg-destructive/10' : variant === 'warning' ? 'bg-warning/10' : 'bg-primary/10'}`}>
            {variant === 'destructive' ? (
              <AlertCircle className={`h-8 w-8 ${getIconColor()}`} />
            ) : (
              <CheckCircle className={`h-8 w-8 ${getIconColor()}`} />
            )}
          </div>

          {/* Content */}
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {/* Buttons */}
          {singleAction ? (
            <div className="flex w-full pt-4">
              <Button
                onClick={onConfirm}
                className={`w-full text-white ${getButtonColor()}`}
              >
                {confirmText}
              </Button>
            </div>
          ) : (
            <div className="flex w-full gap-3 pt-4">
              <Button
                onClick={onCancel}
                variant="outline"
                className="flex-1"
              >
                {cancelText}
              </Button>
              <Button
                onClick={onConfirm}
                className={`flex-1 text-white ${getButtonColor()}`}
              >
                {confirmText}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
