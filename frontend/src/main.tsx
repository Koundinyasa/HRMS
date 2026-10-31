import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { Provider } from "react-redux";
import { store } from "./app/store";
import ThemeProvider from "../src/features/admin/components/ThemeProvider";
import ChunkErrorBoundary, {
  reloadOnceForNewVersion,
} from "./shared/components/ChunkErrorBoundary";

// Vite raises this when a page file (or its stylesheet) cannot be downloaded,
// usually because a new release replaced the old files.
window.addEventListener("vite:preloadError", (event) => {
  if (reloadOnceForNewVersion()) event.preventDefault();
});

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <Provider store={store}>
    <ThemeProvider>
      <ChunkErrorBoundary>
        <App />
      </ChunkErrorBoundary>
    </ThemeProvider>
  </Provider>
);