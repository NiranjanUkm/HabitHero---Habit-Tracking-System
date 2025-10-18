import { Header } from "@/components/layout/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Welcome to Habit Hero</h2>
          <p className="text-muted-foreground text-lg">
            Build better habits, one day at a time
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
