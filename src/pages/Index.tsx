import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { AIBuilders } from "@/components/AIBuilders";
import { PromptGenerator } from "@/components/PromptGenerator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <HowItWorks />
      <AIBuilders />
      <PromptGenerator />
    </div>
  );
};

export default Index;
