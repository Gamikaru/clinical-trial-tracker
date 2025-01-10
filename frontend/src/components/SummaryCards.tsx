import React from "react";
import SummaryCard from "./SummaryCard";

interface SummaryCardsProps {
  /** Total number of studies */
  totalStudies?: number;
  /** Average size of studies in bytes */
  averageSizeBytes?: number;
}

/**
 * Displays summary cards for total studies and average size.
 *
 * @param {SummaryCardsProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered summary cards.
 */
const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalStudies = 0,
  averageSizeBytes = 0,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <SummaryCard title="Total Studies" value={totalStudies} />
      <SummaryCard title="Average Size" value={`${averageSizeBytes.toLocaleString()} Bytes`} />
    </div>
  );
};

export default SummaryCards;