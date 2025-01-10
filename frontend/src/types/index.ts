// src/types/index.ts

/**
 * Represents a metadata field with its name, description, and type.
 */
export interface MetadataField {
    name: string;
    description: string;
    type: string;
  }

  /**
   * Represents the largest study with its ID and size in bytes.
   */
  export interface LargestStudy {
    id: string;
    sizeBytes: number;
  }