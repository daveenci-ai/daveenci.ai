
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import NotFound from "./pages/NotFound";
import CrowleyCapital from "./pages/CrowleyCapital";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Admin from "./pages/Admin";
import { AdminAuthProvider } from "./context/AdminAuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AdminAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <Routes>
                <Route path="/" element={<CrowleyCapital />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/articles/:id" element={<ArticleDetail />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AdminAuthProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};

export default App;
