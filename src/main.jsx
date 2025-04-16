import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./store/store.js";
import { Provider } from "react-redux";

store.dispatch({ type: "APP_READY" });

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
