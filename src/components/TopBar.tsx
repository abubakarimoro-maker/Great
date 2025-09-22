import * as React from "react";
import DisclaimerModal from "@/components/DisclaimerModal";

const TopBar: React.FC = () => {
  return (
    <header className="w-full sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-semibold">Lotto Predictor</h1>
        <div className="flex items-center gap-2">
          <DisclaimerModal />
        </div>
      </div>
    </header>
  );
};

export default TopBar;