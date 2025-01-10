/**
 * src/types/index.ts
 *
 * Type definitions shared across the application.
 */

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

/**
 * Defines advanced search parameters for queries such as condition, location, sponsor, etc.
 */
export interface AdvancedSearchParams {
    location?: {
        latitude?: number;
        longitude?: number;
        radius?: string;
    };
    condition?: string;
    sponsor?: string;
    status?: string[];
}
