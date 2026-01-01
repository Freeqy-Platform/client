import { QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import MainRouter from "./routes";
import { queryClient } from "./lib/query-client";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./components/theme/ThemeProvider";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <MainRouter />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
