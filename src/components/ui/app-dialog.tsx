import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface AppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function AppDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
}: AppDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-center">{description}</DialogDescription>
          )}
        </DialogHeader>

        {/* Whatever component you pass in renders here */}
        {children}
      </DialogContent>
    </Dialog>
  );
}