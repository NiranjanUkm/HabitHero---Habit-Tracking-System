import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-medium">
              <span className="text-primary-foreground font-bold">H</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Habit Hero</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
