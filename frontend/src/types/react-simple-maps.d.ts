declare module "react-simple-maps" {
    import * as React from "react";

    export interface ComposableMapProps {
        projection?: string;
        projectionConfig?: {
            scale?: number;
            center?: [number, number];
            [key: string]: any;
        };
        "data-tip"?: string;
        [key: string]: any;
    }

    export const ComposableMap: React.FC<ComposableMapProps>;

    export interface GeographiesProps {
        geography: string;
        children: (geographies: { geographies: any[] }) => React.ReactNode;
        [key: string]: any;
    }

    export const Geographies: React.FC<GeographiesProps>;

    export interface GeographyProps {
        geography: any;
        fill?: string;
        onMouseEnter?: (
            geo: any,
            evt: React.MouseEvent<SVGPathElement, MouseEvent>
        ) => void;
        onMouseMove?: (
            evt: React.MouseEvent<SVGPathElement, MouseEvent>
        ) => void;
        onMouseLeave?: () => void;
        style?: {
            default: React.CSSProperties;
            hover: React.CSSProperties;
            pressed: React.CSSProperties;
        };
        [key: string]: any;
    }

    export const Geography: React.FC<GeographyProps>;

    export interface MarkerProps {
        coordinates: [number, number];
        name?: string;
        [key: string]: any;
    }

    export const Marker: React.FC<MarkerProps>;
}