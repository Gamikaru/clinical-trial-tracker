// src/types/react-simple-maps.d.ts
declare module "react-simple-maps" {
    import * as React from "react";

    export interface ComposableMapProps {
        [key: string]: any;
    }

    export const ComposableMap: React.FC<ComposableMapProps>;
    export const Geographies: React.FC<GeographiesProps>;
    export const Geography: React.FC<GeographyProps>;

    export interface GeographiesProps {
        geography: string;
        children: (geographies: { geographies: any[] }) => React.ReactNode;
    }

    export interface GeographyProps {
        geography: any;
        fill?: string;
        onMouseEnter?: () => void;
        onMouseLeave?: () => void;
        style?: {
            default: React.CSSProperties;
            hover: React.CSSProperties;
            pressed: React.CSSProperties;
        };
        [key: string]: any;
    }
}