import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const DisclaimerModal: React.FC = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open disclaimer">
          <Info className="h-5 w-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Lotto Predictor Disclaimer</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              This app provides number suggestions for entertainment purposes only.
              Lottery outcomes are inherently random and unpredictable.
            </p>
            <p>
              Do not rely on these suggestions for financial decisions. We do not guarantee any outcomes.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction aria-label="Close disclaimer">I Understand</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DisclaimerModal;