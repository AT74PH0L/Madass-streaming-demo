import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  
  interface ConfirmDeleteUserProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userName: string;
    onConfirm: () => void;
  }
  
  export function ConfirmDeleteUser({
    open,
    onOpenChange,
    userName,
    onConfirm,
  }: ConfirmDeleteUserProps) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user "
              <span className="font-semibold">{userName}</span>".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-black">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  