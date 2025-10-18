import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthPage } from "@/components/auth/AuthPage";
import Index from "./pages/Index";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
