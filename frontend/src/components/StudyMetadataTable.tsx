/**
 * src/components/StudyMetadataTable.tsx
 *
 * Displays a table of study metadata, grouped by their respective sections,
 * with improved styling and slight fade-in effect.
 */

import { motion } from "framer-motion";
import React from "react";
import { MetadataField } from "../types";
import MetadataFields from "./MetadataFields";

interface StudyMetadataTableProps {
  /** Array of metadata fields to display */
  metadata: MetadataField[];
}

const StudyMetadataTable: React.FC<StudyMetadataTableProps> = ({
  metadata,
}) => {
  // Group metadata by sections (e.g., protocolSection, resultsSection)
  const groupedMetadata = metadata.reduce(
    (groups: Record<string, MetadataField[]>, field) => {
      const section = field.name.split(".")[0];
      if (!groups[section]) {
        groups[section] = [];
      }
      groups[section].push(field);
      return groups;
    },
    {}
  );

  return (
    <motion.div
      className="card col-span-1 lg:col-span-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
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
                    <MetadataFields key={field.name} field={field} />
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ) : (
        <p>No metadata available.</p>
      )}
    </motion.div>
  );
};

export default StudyMetadataTable;
