import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import App from "./App.jsx";
import { GLOBAL_CSS } from "./utils/theme.js";
import { BrandProvider } from "./contexts/BrandContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { captureUtmParams } from "./utils/utm.js";

const styleTag = document.createElement("style");
styleTag.innerHTML = GLOBAL_CSS;
document.head.appendChild(styleTag);

captureUtmParams();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <BrandProvider>
        <AuthProvider>
          <App />
          <Toaster position="top-center" />
          <Analytics />
        </AuthProvider>
      </BrandProvider>
    </BrowserRouter>
  </React.StrictMode>
);
