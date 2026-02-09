import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// React Router
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// React Router
import { RouterProvider } from "react-router";
import { interhubApp } from "./App";

// Redux
import { Provider } from "react-redux";
import { store } from "./store/store";

// Sonner
import { Toaster } from "sonner";

import "./index.css";

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={interhubApp} />
        <Toaster position="top-right" richColors closeButton />
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
);
