import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient and image */}
      <div className="absolute inset-0 bg-gradient-secondary">
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-background/80" />
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-primary opacity-20 blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-gradient-accent opacity-15 blur-xl animate-pulse delay-1000" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-card/50 backdrop-blur-sm mb-8">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Turn Ideas into Production-Ready Prompts</span>
        </div>
        
        {/* Main heading */}
        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
          PromptForge AI
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto leading-relaxed">
          From startup idea to launch-ready prompts in minutes
        </p>
        
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Get the perfect AI builder recommendation + detailed prompts for Framer, Builder.io, Uizard, and more — all from a single idea description.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button 
            size="lg" 
            className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 group px-8 py-4 text-lg"
          >
            Start Building
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-4 text-lg border-primary/30 hover:bg-primary/10"
          >
            <Zap className="mr-2 w-5 h-5" />
            See How It Works
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">6</div>
            <div className="text-muted-foreground">Supported AI Builders</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">5min</div>
            <div className="text-muted-foreground">Average Generation Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">100%</div>
            <div className="text-muted-foreground">Tool-Specific Prompts</div>
          </div>
        </div>
      </div>
    </section>
  );
};