import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Plus, RefreshCw } from "lucide-react"; // Import RefreshCw
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";


interface AISuggestionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHabitAdded: () => void;
}

interface SuggestedHabit {
  name: string;
  description: string;
  category: string;
  frequency: string;
}

export const AISuggestionsModal = ({ open, onOpenChange, onHabitAdded }: AISuggestionsModalProps) => {
  const [suggestions, setSuggestions] = useState<SuggestedHabit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    setSuggestions([]); // Clear old suggestions immediately before fetching new ones
    try {
      const response = await api.ai.suggestHabits();
      setSuggestions(response);
    } catch (err: any) {
      console.error("AI API Error:", err);
      setError("Failed to fetch suggestions. Ensure the backend Groq service is running and authorized.");
    } finally {
      setLoading(false);
    }
  };

  // FIX: New handler for the refresh button
  const handleRefresh = () => {
      fetchSuggestions();
  }

  useEffect(() => {
    if (open) {
      fetchSuggestions();
    }
  }, [open]);

  const handleAddHabit = async (suggestion: SuggestedHabit) => {
    // Set loading to true while the habit is being processed and added
    setLoading(true); 
    try {
      const safeFrequency = (suggestion.frequency.toLowerCase() === 'monthly' || suggestion.frequency.toLowerCase() === 'daily' || suggestion.frequency.toLowerCase() === 'weekly') ? suggestion.frequency.toLowerCase() : 'daily';

      await api.habits.create({ 
        name: suggestion.name,
        description: suggestion.description, 
        category: suggestion.category,
        frequency: safeFrequency,
        start_date: format(new Date(), 'yyyy-MM-dd') 
      });
      
      // FIX: Remove the added suggestion from the local list immediately.
      setSuggestions(prev => prev.filter(s => s.name !== suggestion.name));
      
      // Close modal and trigger global data refresh 
      onOpenChange(false); 
      onHabitAdded(); 
      
      toast({
        title: "Habit Added!",
        description: `${suggestion.name} created from AI suggestion.`,
      });
    } catch (err: any) {
       toast({
        title: "Error",
        description: err.message || "Failed to add habit.",
        variant: "destructive"
      });
    } finally {
      // Set loading back to false, which is mainly important if the modal wasn't closing
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-card">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              AI Habit Suggestions
            </DialogTitle>
            {/* FIX: Add the Refresh Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="text-primary hover:bg-primary/10"
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : (
                    <RefreshCw className="w-4 h-4 mr-1" />
                )}
                Refresh
            </Button>
          </div>
          <DialogDescription>
            Based on your current habits, here are some suggestions from Groq's LLM.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mb-2" />
              <p>Thinking of new habits...</p>
            </div>
          ) : error ? (
            <p className="text-destructive p-4 border border-destructive/50 rounded">{error}</p>
          ) : (
            suggestions.map((suggestion, index) => (
              <Card key={index} className="p-4 border-border shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{suggestion.name}</h4>
                    <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                    <div className="text-xs text-secondary-foreground mt-1">
                      {suggestion.category.toUpperCase()} • {suggestion.frequency.toUpperCase()}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAddHabit(suggestion)}
                    size="sm"
                    className="flex-shrink-0 bg-primary-light hover:bg-primary-light/90 ml-3"
                    disabled={loading}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-border">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};