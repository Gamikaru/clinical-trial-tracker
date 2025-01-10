/**
 * index.tsx
 *
 * Entry point for the React application.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/App.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found");
} else {
  const root = ReactDOM.createRoot(rootElement as HTMLElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
