/**
 * src/types/index.ts
 *
 * Type definitions shared across the application.
 */

import { ChartData } from "chart.js";

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

/**
 * ChartJS data shape for bar charts (Status).
 */
export interface StatusData extends ChartData<"bar", number[], string> {}

/**
 * ChartJS data shape for pie charts (Conditions).
 */
export interface ConditionData extends ChartData<"pie", number[], string> {}

/**
 * ChartJS data shape for line charts (Trends).
 */
export interface TrendData extends ChartData<"line", number[], string> {}
