/**
 * src/components/SummaryCards.tsx
 *
 * Container for multiple summary cards.
 */

import React from "react";
import SummaryCard from "./SummaryCard";

interface SummaryCardsProps {
  totalStudies?: number;
  averageSizeBytes?: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalStudies = 0,
  averageSizeBytes = 0,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <SummaryCard title="Total Studies" value={totalStudies} />
      <SummaryCard
        title="Average Size"
        value={`${averageSizeBytes.toLocaleString()} Bytes`}
      />
    </div>
  );
};

export default SummaryCards;
