import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import AppLoader from "./AppLoader";
import "./index.css";
import { store } from "./redux/store";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Provider store={store}>
      <AppLoader />
    </Provider>
  </StrictMode>,
);
