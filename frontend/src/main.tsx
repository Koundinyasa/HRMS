import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { Provider } from "react-redux";
import { store } from "./app/store";
import ThemeProvider from "../src/features/admin/components/ThemeProvider";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>
);