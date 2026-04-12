import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { loadPWA } from "./pwa";

loadPWA();

createRoot(document.getElementById("root")!).render(<App />);
