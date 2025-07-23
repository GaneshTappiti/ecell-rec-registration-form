import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  Download, 
  Copy, 
  Wand2,
  CheckCircle,
  ArrowRight,
  FileText,
  Settings
} from "lucide-react";

const mockGeneratedPrompts = {
  recommendation: {
    tool: "FlutterFlow",
    reason: "Best for mobile-first apps with Firebase backend integration",
    confidence: 95
  },
  screens: [
    {
      name: "Home Screen",
      description: "Main dashboard with navigation",
      prompt: "Create a mobile home screen with:\n- App bar with title 'BookExchange'\n- Search bar with placeholder 'Find books...'\n- Category grid: Textbooks, Fiction, Academic, Other\n- Featured books carousel\n- Bottom navigation: Home, Search, Upload, Profile"
    },
    {
      name: "Book Details",
      description: "Individual book information",
      prompt: "Design a book detail screen with:\n- Book cover image (large)\n- Title, author, condition, price\n- Description text area\n- 'Contact Seller' button (primary)\n- 'Add to Wishlist' button (secondary)\n- Back navigation arrow"
    }
  ],
  exportFormat: "FlutterFlow JSON + Setup Guide"
};

export const PromptGenerator = () => {
  const [idea, setIdea] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!idea.trim()) {
      toast({
        title: "Please describe your app idea",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setGeneratedPrompts(mockGeneratedPrompts);
      setIsGenerating(false);
      toast({
        title: "Prompts generated successfully!",
        description: "Your AI builder prompts are ready"
      });
    }, 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "Prompt copied successfully"
    });
  };

  return (
    <section className="py-24 px-6" id="generator">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-card/50 backdrop-blur-sm mb-6">
            <Wand2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Try PromptForge AI</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Transform Your Idea Right Now
          </h2>
          <p className="text-xl text-muted-foreground">
            Describe your startup idea and watch it become production-ready prompts
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Describe Your App Idea
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., A mobile app for college students to exchange textbooks. Users can post books they want to sell, browse by category, chat with sellers, and rate transactions..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="min-h-32 resize-none"
            />
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-primary hover:shadow-glow-primary transition-all duration-300"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Settings className="w-5 h-5 mr-2 animate-spin" />
                  Generating Your Prompts...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate AI Builder Prompts
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {generatedPrompts && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Tool Recommendation */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Recommended AI Builder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-primary">
                      {generatedPrompts.recommendation.tool}
                    </h3>
                    <p className="text-muted-foreground">
                      {generatedPrompts.recommendation.reason}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                    {generatedPrompts.recommendation.confidence}% Match
                  </Badge>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    FlutterFlow is perfect for your mobile-first book exchange app. It offers native mobile development with Firebase integration for real-time chat and user management.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Generated Prompts */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Generated Prompts ({generatedPrompts.screens.length} screens)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedPrompts.screens.map((screen, index) => (
                  <div key={index} className="border border-primary/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{screen.name}</h4>
                        <p className="text-sm text-muted-foreground">{screen.description}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard(screen.prompt)}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-secondary/50 rounded-md p-3">
                      <pre className="text-sm whitespace-pre-wrap text-muted-foreground">
                        {screen.prompt}
                      </pre>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary" />
                  Export & Deploy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="p-6 h-auto flex-col items-start"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Download className="w-4 h-4" />
                      <span className="font-medium">Download Complete Package</span>
                    </div>
                    <p className="text-sm text-muted-foreground text-left">
                      Get all prompts as JSON + setup guide
                    </p>
                  </Button>
                  <Button 
                    className="p-6 h-auto flex-col items-start bg-gradient-primary"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowRight className="w-4 h-4" />
                      <span className="font-medium">Open in FlutterFlow</span>
                    </div>
                    <p className="text-sm text-primary-foreground/80 text-left">
                      Direct integration (coming soon)
                    </p>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};