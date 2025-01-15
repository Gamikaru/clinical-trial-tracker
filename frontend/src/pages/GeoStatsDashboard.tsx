import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import useGeoStats from "../hooks/useGeoStats";

const GeoStatsDashboard: React.FC = () => {
    const [condition] = useState("cancer");
    const [latitude] = useState(39.0035707);
    const [longitude] = useState(-77.1013313);
    const [radius] = useState("50mi");

    const { data, loading, error } = useGeoStats(condition, latitude, longitude, radius);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-6 text-center">Geographic Statistics</h2>
            {loading && (
                <div className="flex justify-center items-center">
                    <ClipLoader size={50} color={"#123abc"} loading={loading} />
                </div>
            )}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            {data && (
                <div className="bg-white shadow-md rounded-lg p-6">
                    <p className="text-xl mb-4">Total Studies: <span className="font-semibold">{data.totalStudies}</span></p>
                    <div className="flex flex-wrap justify-center">
                        {Object.entries(data.countryCounts).map(([country, count]) => {
                            const size = Math.max(20, Math.log(count) * 10);
                            return (
                                <div key={country} className="m-2 flex flex-col items-center">
                                    <div
                                        className="rounded-full bg-blue-500"
                                        style={{ width: `${size}px`, height: `${size}px` }}
                                    ></div>
                                    <span className="text-sm mt-1">{country}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeoStatsDashboard;