import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Building2, 
  Layout, 
  GitBranch, 
  Package, 
  Download,
  ArrowRight
} from "lucide-react";

const stages = [
  {
    icon: Brain,
    title: "Idea Intake & Tool Match",
    description: "Describe your app idea in plain English. Our AI analyzes your concept and recommends the perfect AI builder tool.",
    example: "\"Your idea fits best with FlutterFlow for mobile + Firebase backend.\""
  },
  {
    icon: Building2,
    title: "App Skeleton Generator",
    description: "Break down your idea into screens, features, and user journeys tailored to your chosen builder's capabilities.",
    example: "6 screens identified: Home, Search, Details, Upload, Profile, Chat"
  },
  {
    icon: Layout,
    title: "UI Prompt Generator",
    description: "Generate detailed, screen-by-screen UI prompts with elements, layouts, and interactions in your tool's syntax.",
    example: "Complete Framer prompts with responsive layouts and component specifications"
  },
  {
    icon: GitBranch,
    title: "Flow & Logic Mapper",
    description: "Map navigation flows, conditional logic, and data dependencies with tool-specific implementations.",
    example: "Authentication flows, form validation, and database connections"
  },
  {
    icon: Package,
    title: "Prompt Pack Builder",
    description: "Combine everything into organized, copy-paste ready prompt packages formatted for your AI builder.",
    example: "Master prompt + individual screen prompts + setup checklist"
  },
  {
    icon: Download,
    title: "Export & Deploy Ready",
    description: "Download as Markdown, JSON, or direct integration with supported AI builders for instant deployment.",
    example: "One-click export to Framer, Builder.io, or local files"
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Six intelligent stages that transform your startup idea into production-ready AI builder prompts
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <Card key={index} className="relative group hover:shadow-glow-primary/20 transition-all duration-300 border-primary/20">
                <CardContent className="p-6">
                  {/* Stage number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3">{stage.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {stage.description}
                  </p>
                  
                  {/* Example */}
                  <div className="bg-secondary/50 rounded-lg p-3 border border-primary/10">
                    <div className="text-xs text-primary font-medium mb-1">Example Output:</div>
                    <div className="text-sm text-muted-foreground italic">
                      {stage.example}
                    </div>
                  </div>
                  
                  {/* Arrow for flow (except last item) */}
                  {index < stages.length - 1 && (
                    <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-primary/30" />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};