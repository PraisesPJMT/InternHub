import { createBrowserRouter } from "react-router";

import Home from "./pages/Home";

export const interhubApp = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
]);
