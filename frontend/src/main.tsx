import { Provider as ChackraProvider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./router/routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1, 
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChackraProvider>     
        <RouterProvider router={appRouter} />
        <Toaster /> 
      </ChackraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);