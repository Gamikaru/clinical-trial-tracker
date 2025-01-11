// import React from "react";
// import { MetadataField } from "../types";
// import { metadataDescriptions } from "../utils/metadataDescriptions"; // Corrected import

// interface MetadataFieldProps {
//   /** The metadata field to display */
//   field: MetadataField;
// }

// /**
//  * Renders a single row of metadata in the table.
//  *
//  * @param {MetadataFieldProps} props - The properties for the component.
//  * @returns {JSX.Element} The rendered metadata row.
//  */
// const MetadataFields: React.FC<MetadataFieldProps> = ({ field }) => {
//   const mapped = metadataDescriptions[field.name];
//   return (
//     <tr>
//       <td>{mapped ? mapped.label : field.name}</td>
//       <td>
//         {field.description && field.description !== "N/A"
//           ? field.description
//           : mapped
//           ? mapped.description
//           : "No description available."}
//       </td>
//       <td>{field.type || "N/A"}</td>
//     </tr>
//   );
// };

// export default MetadataFields;
