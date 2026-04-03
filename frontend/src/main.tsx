import { Provider as ChakraProvider } from "@/shared/ui/chakra/provider";
import { Toaster } from "@/shared/ui/chakra/toaster"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./app/router/app-router";
import { AppInitializer } from "./components/auth/AppInitializer";

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
      <ChakraProvider>     
        <AppInitializer>
          <RouterProvider router={appRouter} />
        </AppInitializer>
        <Toaster /> 
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);