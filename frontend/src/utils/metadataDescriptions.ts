export const metadataDescriptions: Record<
  string,
  { label: string; description: string }
> = {
  protocolSection: {
    label: "Protocol Section",
    description: "Contains detailed information about the study's protocol.",
  },
  resultsSection: {
    label: "Results Section",
    description: "Includes results posted for the study.",
  },
  annotationSection: {
    label: "Annotation Section",
    description: "Internally generated annotations related to the study.",
  },
  documentSection: {
    label: "Document Section",
    description: "Documents and related materials for the study.",
  },
  derivedSection: {
    label: "Derived Section",
    description: "Derived data and analyses from the study.",
  },
  hasResults: {
    label: "Has Results",
    description:
      "Indicates if the study has posted results on the public site.",
  },
  // Add more mappings as needed
};
