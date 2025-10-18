import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Leaf, LogOut, Plus, Menu } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onOpenAddHabit?: () => void;
}

export const Header = ({ onOpenAddHabit }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-card border-b border-border shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-medium">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Habit Hero</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {user && onOpenAddHabit && (
              <Button
                onClick={onOpenAddHabit}
                className="bg-gradient-primary hover:opacity-90 shadow-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Habit
              </Button>
            )}
            {user && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleLogout}
                className="border-border hover:bg-secondary"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="border-border"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-3">
              {user && onOpenAddHabit && (
                <Button
                  onClick={() => {
                    onOpenAddHabit();
                    setMobileMenuOpen(false);
                  }}
                  className="bg-gradient-primary hover:opacity-90 shadow-medium w-full justify-start"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Habit
                </Button>
              )}
              {user && (
                <Button
                  variant="outline"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="border-border hover:bg-secondary w-full justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
