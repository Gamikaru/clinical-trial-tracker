import React from "react";
import { MetadataField } from "../types"; // Corrected import
import MetadataFields from "./MetadataFields"; // Corrected import

interface StudyMetadataTableProps {
  /** Array of metadata fields to display */
  metadata: MetadataField[]; // Corrected type
}

/**
 * Displays a table of study metadata, grouped by their respective sections.
 *
 * @param {StudyMetadataTableProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered metadata table.
 */
const StudyMetadataTable: React.FC<StudyMetadataTableProps> = ({
  metadata,
}) => {
  // Group metadata by sections (e.g., protocolSection, resultsSection)
  const groupedMetadata = metadata.reduce(
    (groups: Record<string, MetadataField[]>, field) => {
      const section = field.name.split(".")[0]; // Assumes naming like 'protocolSection.identificationModule.nctId'
      if (!groups[section]) {
        groups[section] = [];
      }
      groups[section].push(field);
      return groups;
    },
    {}
  );

  return (
    <div className="card bg-base-100 shadow-lg p-6 col-span-1 lg:col-span-2">
      <h2 className="text-2xl font-semibold mb-4">Study Metadata</h2>
      {Array.isArray(metadata) && metadata.length > 0 ? (
        <div className="overflow-x-auto">
          {Object.keys(groupedMetadata).map((section) => (
            <div key={section} className="mb-6">
              <h3 className="text-xl font-bold mb-2 capitalize">
                {section.replace(/([A-Z])/g, " $1")}
              </h3>
              <table className="table w-full table-zebra">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th
                      className="tooltip"
                      data-tip="Detailed information about each field"
                    >
                      Description
                    </th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedMetadata[section].map((field) => (
                    <MetadataFields key={field.name} field={field} /> // Corrected component name
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ) : (
        <p>No metadata available.</p>
      )}
    </div>
  );
};

export default StudyMetadataTable;
