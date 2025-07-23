import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, LogOut, Upload, FileText, Github, Link as LinkIcon, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SubmissionForm {
  ideaTitle: string;
  problemStatement: string;
  proposedSolution: string;
  oneLinerPitch: string;
  detailedExplanation: string;
  startupStage: string;
  phoneNumber: string;
  pitchDeck: FileList;
  githubLink?: string;
  driveLink?: string;
  figmaLink?: string;
}

interface User {
  name: string;
  rollNumber: string;
  email: string;
  branch: string;
  year: string;
  phone: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<SubmissionForm>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const detailedExplanation = watch("detailedExplanation");
  const watchedFields = watch();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));

    // Check if already submitted
    const submissionData = localStorage.getItem("submission");
    if (submissionData) {
      setIsSubmitted(true);
    }
  }, [navigate]);

  useEffect(() => {
    if (detailedExplanation) {
      setWordCount(detailedExplanation.split(/\s+/).filter(word => word.length > 0).length);
    }
  }, [detailedExplanation]);

  useEffect(() => {
    // Calculate progress based on filled fields
    const requiredFields = ['ideaTitle', 'problemStatement', 'proposedSolution', 'oneLinerPitch', 'detailedExplanation', 'startupStage'];
    const filledFields = requiredFields.filter(field => watchedFields[field as keyof SubmissionForm]);
    setProgress((filledFields.length / requiredFields.length) * 100);
  }, [watchedFields]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("submission");
    navigate("/login");
  };

  const onSubmit = async (data: SubmissionForm) => {
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Store submission
    const submissionData = {
      ...data,
      submittedAt: new Date().toISOString(),
      userId: user?.rollNumber
    };
    localStorage.setItem("submission", JSON.stringify(submissionData));
    
    toast({
      title: "Startup Idea Submitted Successfully! 🚀",
      description: "Your idea has been received. We'll get back to you soon."
    });
    
    navigate("/confirmation");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-primary opacity-20 blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-gradient-accent opacity-15 blur-xl animate-pulse delay-1000" />
        
        <div className="container mx-auto px-6 py-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Submission Already Completed! ✅</h1>
            <p className="text-muted-foreground mb-8">You have already submitted your startup idea.</p>
            <div className="space-x-4">
              <Button onClick={() => navigate("/confirmation")}>View Submission</Button>
              <Button variant="outline" onClick={handleLogout}>Logout</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const startupStages = [
    "Idea - Just an initial concept",
    "Validated - Market research completed", 
    "MVP - Minimum viable product ready",
    "Launched - Product is live"
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-primary opacity-20 blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-gradient-accent opacity-15 blur-xl animate-pulse delay-1000" />
        
        <div className="container mx-auto px-6 py-8 relative z-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-card/50 backdrop-blur-sm mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">E-Cell</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                📝 Submit Your Startup Idea
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Logged in as: <strong>{user.name}</strong> ({user.rollNumber})</span>
                <Badge variant="outline" className="border-green-500/50 text-green-400">
                  Form not submitted
                </Badge>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          {/* Progress Bar */}
          <Card className="mb-8 bg-card/50 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Form Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Student Details Section */}
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🧍‍♂️ Student Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input value={user.name} disabled className="bg-muted/50" />
                  </div>
                  <div>
                    <Label>Roll Number</Label>
                    <Input value={user.rollNumber} disabled className="bg-muted/50" />
                  </div>
                  <div>
                    <Label>Branch</Label>
                    <Input value={user.branch} disabled className="bg-muted/50" />
                  </div>
                  <div>
                    <Label>Year</Label>
                    <Input value={user.year} disabled className="bg-muted/50" />
                  </div>
                  <div>
                    <Label>Email ID</Label>
                    <Input value={user.email} disabled className="bg-muted/50" />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input 
                      {...register("phoneNumber", { required: "Phone number is required" })}
                      defaultValue={user.phone}
                      className="bg-background/50"
                    />
                    {errors.phoneNumber && (
                      <p className="text-destructive text-sm mt-1">{errors.phoneNumber.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Startup Idea Section */}
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🚀 Startup Idea Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Idea Title */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="ideaTitle">Idea Title</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Give your startup idea a catchy, memorable name</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="ideaTitle"
                    maxLength={80}
                    {...register("ideaTitle", { required: "Idea title is required" })}
                    className="bg-background/50"
                    placeholder="e.g., EcoRide - Sustainable Urban Transport"
                  />
                  {errors.ideaTitle && (
                    <p className="text-destructive text-sm">{errors.ideaTitle.message}</p>
                  )}
                </div>

                {/* Problem Statement */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="problemStatement">Problem Statement</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clearly define the pain point your startup addresses</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Textarea
                    id="problemStatement"
                    {...register("problemStatement", { required: "Problem statement is required" })}
                    className="bg-background/50"
                    placeholder="Describe the specific problem you're solving..."
                    rows={3}
                  />
                  {errors.problemStatement && (
                    <p className="text-destructive text-sm">{errors.problemStatement.message}</p>
                  )}
                </div>

                {/* Proposed Solution */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="proposedSolution">Proposed Solution</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Explain how your solution addresses the problem</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Textarea
                    id="proposedSolution"
                    {...register("proposedSolution", { required: "Proposed solution is required" })}
                    className="bg-background/50"
                    placeholder="Describe your solution approach..."
                    rows={3}
                  />
                  {errors.proposedSolution && (
                    <p className="text-destructive text-sm">{errors.proposedSolution.message}</p>
                  )}
                </div>

                {/* One-liner Pitch */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="oneLinerPitch">One-liner Pitch</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>E.g., 'Uber for Ambulances' or 'Notion for Personal Goals'</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="oneLinerPitch"
                    maxLength={140}
                    {...register("oneLinerPitch", { required: "One-liner pitch is required" })}
                    className="bg-background/50"
                    placeholder="Describe your startup in one line..."
                  />
                  {errors.oneLinerPitch && (
                    <p className="text-destructive text-sm">{errors.oneLinerPitch.message}</p>
                  )}
                </div>

                {/* Detailed Explanation */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="detailedExplanation">Detailed Explanation</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Describe the flow, your users, how it works, and uniqueness</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {wordCount} words (min. 200)
                    </span>
                  </div>
                  <Textarea
                    id="detailedExplanation"
                    {...register("detailedExplanation", { 
                      required: "Detailed explanation is required",
                      validate: (value) => {
                        const words = value.split(/\s+/).filter(word => word.length > 0);
                        return words.length >= 200 || "Minimum 200 words required";
                      }
                    })}
                    className="bg-background/50"
                    placeholder="Provide a comprehensive explanation of your startup idea..."
                    rows={6}
                  />
                  {errors.detailedExplanation && (
                    <p className="text-destructive text-sm">{errors.detailedExplanation.message}</p>
                  )}
                </div>

                {/* Startup Stage */}
                <div className="space-y-2">
                  <Label htmlFor="startupStage">Startup Stage</Label>
                  <select
                    {...register("startupStage", { required: "Startup stage is required" })}
                    className="w-full p-3 rounded-md border border-input bg-background/50 text-foreground"
                  >
                    <option value="">Select your startup stage</option>
                    {startupStages.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                  {errors.startupStage && (
                    <p className="text-destructive text-sm">{errors.startupStage.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Uploads Section */}
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📁 Supporting Documents & Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pitch Deck */}
                <div className="space-y-2">
                  <Label htmlFor="pitchDeck" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Pitch Deck (PDF, PPT, PPTX - Max 10MB)
                  </Label>
                  <Input
                    id="pitchDeck"
                    type="file"
                    accept=".pdf,.ppt,.pptx"
                    {...register("pitchDeck")}
                    className="bg-background/50"
                  />
                </div>

                {/* Supporting Links */}
                <div className="space-y-4">
                  <h4 className="font-medium">Supporting Links (Optional)</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="githubLink" className="flex items-center gap-2">
                      <Github className="w-4 h-4" />
                      GitHub Repository
                    </Label>
                    <Input
                      id="githubLink"
                      type="url"
                      {...register("githubLink")}
                      className="bg-background/50"
                      placeholder="https://github.com/yourusername/project"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="driveLink" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Google Drive Link
                    </Label>
                    <Input
                      id="driveLink"
                      type="url"
                      {...register("driveLink")}
                      className="bg-background/50"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="figmaLink" className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Figma/Design Link
                    </Label>
                    <Input
                      id="figmaLink"
                      type="url"
                      {...register("figmaLink")}
                      className="bg-background/50"
                      placeholder="https://figma.com/..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="text-center">
              <Button
                type="submit"
                disabled={isSubmitting || progress < 100}
                className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 px-12 py-4 text-lg"
                size="lg"
              >
                {isSubmitting ? "Submitting..." : "🚀 Submit My Startup Idea"}
              </Button>
              {progress < 100 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Please fill all required fields to submit
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </TooltipProvider>
  );
}