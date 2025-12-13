import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import MainRouter from "./routes";
import { queryClient } from "./lib/query-client";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MainRouter />
        <Toaster position="top-right" richColors closeButton />
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
