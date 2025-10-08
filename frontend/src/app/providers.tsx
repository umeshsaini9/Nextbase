"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { makeStore } from "@/store/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  // One QueryClient per browser session/tab
  const [queryClient] = useState(() => new QueryClient());
  // Create a Redux store instance
  const store = makeStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        {children}
        {process.env.NODE_ENV === "development" ? (
          <ReactQueryDevtools initialIsOpen={false} />
        ) : null}
      </Provider>
    </QueryClientProvider>
  );
}
