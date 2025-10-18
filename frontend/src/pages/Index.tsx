import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/auth');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Welcome to Habit Hero</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Build better habits, one day at a time
          </p>
          <div className="text-sm text-muted-foreground">
            Dashboard coming soon...
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
