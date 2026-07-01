import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { GLOBAL_CSS } from "./utils/theme.js";
import { BrandProvider } from "./contexts/BrandContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";

const styleTag = document.createElement("style");
styleTag.innerHTML = GLOBAL_CSS;
document.head.appendChild(styleTag);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <BrandProvider>
        <AuthProvider>
          <App />
          <Toaster position="top-center" />
        </AuthProvider>
      </BrandProvider>
    </BrowserRouter>
  </React.StrictMode>
);
