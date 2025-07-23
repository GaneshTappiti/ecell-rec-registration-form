import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Smartphone, 
  Database, 
  Palette, 
  Code,
  Zap
} from "lucide-react";

const builders = [
  {
    name: "Framer",
    icon: Globe,
    category: "Web Design",
    description: "Interactive web designs and prototypes",
    features: ["Responsive layouts", "Animations", "CMS integration"],
    badge: "Popular",
    color: "from-blue-500 to-purple-600"
  },
  {
    name: "Builder.io",
    icon: Code,
    category: "Headless CMS",
    description: "Visual development platform",
    features: ["Drag & drop", "API integration", "Multi-platform"],
    badge: "Enterprise",
    color: "from-green-500 to-teal-600"
  },
  {
    name: "FlutterFlow",
    icon: Smartphone,
    category: "Mobile Apps",
    description: "No-code Flutter app builder",
    features: ["Native mobile", "Firebase", "Custom widgets"],
    badge: "Mobile First",
    color: "from-purple-500 to-pink-600"
  },
  {
    name: "Uizard",
    icon: Palette,
    category: "UI/UX Design",
    description: "AI-powered design tool",
    features: ["Wireframes", "Prototypes", "Design systems"],
    badge: "AI-Powered",
    color: "from-orange-500 to-red-600"
  },
  {
    name: "Adalo",
    icon: Smartphone,
    category: "No-Code Apps",
    description: "Native mobile & web apps",
    features: ["Database", "Actions", "Publishing"],
    badge: "Full-Stack",
    color: "from-cyan-500 to-blue-600"
  },
  {
    name: "Appsmith",
    icon: Database,
    category: "Internal Tools",
    description: "Low-code platform for dashboards",
    features: ["Database queries", "APIs", "Charts"],
    badge: "Business",
    color: "from-indigo-500 to-purple-600"
  }
];

export const AIBuilders = () => {
  return (
    <section className="py-24 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-card/50 backdrop-blur-sm mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Supported AI Builders</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            We Speak Every Builder's Language
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Generate prompts optimized for each platform's unique syntax, capabilities, and best practices
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {builders.map((builder, index) => {
            const Icon = builder.icon;
            return (
              <Card key={index} className="group hover:shadow-glow-primary/20 transition-all duration-300 border-primary/20 overflow-hidden">
                <CardContent className="p-6">
                  {/* Header with icon and badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${builder.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {builder.badge}
                    </Badge>
                  </div>
                  
                  {/* Content */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-1">{builder.name}</h3>
                    <p className="text-sm text-primary font-medium mb-2">{builder.category}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {builder.description}
                    </p>
                  </div>
                  
                  {/* Features */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground mb-2">Key Features:</div>
                    <div className="flex flex-wrap gap-1">
                      {builder.features.map((feature, idx) => (
                        <span 
                          key={idx}
                          className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Hover effect indicator */}
                  <div className="mt-4 pt-4 border-t border-primary/10">
                    <div className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                      Generate {builder.name}-optimized prompts →
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            More AI builders being added regularly. 
            <span className="text-primary font-medium"> Request support for your favorite tool.</span>
          </p>
        </div>
      </div>
    </section>
  );
};