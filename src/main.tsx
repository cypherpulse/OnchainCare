import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// Minor update: Added comment for clarity
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
