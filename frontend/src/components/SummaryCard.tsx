import React from "react";

interface SummaryCardProps {
  /** The title of the summary card */
  title: string;
  /** The value displayed in the summary card */
  value: string | number;
}

/**
 * A reusable card component to display summary information.
 *
 * @param {SummaryCardProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered summary card.
 */
const SummaryCard: React.FC<SummaryCardProps> = ({ title, value }) => {
  return (
    <div className="card bg-base-100 shadow-lg p-6 flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-3xl font-bold">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
};

export default SummaryCard;
