// src/pages/GeoStatsDashboard.tsx
import { scaleLinear } from "d3-scale";
import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { ClipLoader } from "react-spinners";
import ReactTooltip from "react-tooltip";
import useGeoStats from "../hooks/useGeoStats";

const GeoStatsDashboard: React.FC = () => {
    const [condition] = useState("cancer");
    const [latitude] = useState(39.0035707);
    const [longitude] = useState(-77.1013313);
    const [radius] = useState("50mi");

    const { data, loading, error } = useGeoStats(condition, latitude, longitude, radius);

    const colorScale = scaleLinear<string>()
        .domain([0, Math.max(...Object.values(data?.countryCounts || {}))])
        .range(["#ffedea", "#ff5233"]);

    const geoUrl =
        "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

    const [tooltipContent, setTooltipContent] = useState("");

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-6 text-center">Geographic Statistics</h2>
            {loading && (
                <div className="flex justify-center items-center">
                    <ClipLoader size={50} color={"#123abc"} loading={loading} />
                </div>
            )}
            {error && (
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                >
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            {data && (
                <div className="bg-white shadow-md rounded-lg p-6">
                    <p className="text-xl mb-4">
                        Total Studies: <span className="font-semibold">{data.totalStudies}</span>
                    </p>
                    <h3 className="text-lg font-semibold mb-2">Studies by Country:</h3>
                    <ComposableMap data-tip="" projectionConfig={{ scale: 200 }}>
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => {
                                    const country = geo.properties.NAME || geo.properties.NAME_LONG;
                                    const count = data.countryCounts[country] || 0;
                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={colorScale(count)}
                                            onMouseEnter={() => {
                                                setTooltipContent(`${country}: ${count}`);
                                            }}
                                            onMouseLeave={() => {
                                                setTooltipContent("");
                                            }}
                                            style={{
                                                default: {
                                                    outline: "none",
                                                },
                                                hover: {
                                                    fill: "#F53",
                                                    outline: "none",
                                                },
                                                pressed: {
                                                    outline: "none",
                                                },
                                            }}
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    </ComposableMap>
                    <ReactTooltip>{tooltipContent}</ReactTooltip>
                </div>
            )}
        </div>
    );
};

export default GeoStatsDashboard;