'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Upload, FileText, Github, Link as LinkIcon, HelpCircle, Plus, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileUpload } from "@/components/ui/file-upload";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ECellLogo } from "@/components/ECellLogo";

interface SubmissionForm {
  ideaTitle: string;
  problemStatement: string;
  proposedSolution: string;
  oneLinerPitch: string;
  detailedExplanation: string;
  startupStage: string;
  phoneNumber: string;
  pitchDeck?: File;
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

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pitchDeckFile, setPitchDeckFile] = useState<File | null>(null);
  const [supportingLinks, setSupportingLinks] = useState<{type: string, url: string}[]>([]);
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<SubmissionForm>();
  const { toast } = useToast();
  const router = useRouter();

  const detailedExplanation = watch("detailedExplanation");
  const ideaTitle = watch("ideaTitle");
  const problemStatement = watch("problemStatement");
  const proposedSolution = watch("proposedSolution");
  const oneLinerPitch = watch("oneLinerPitch");
  const startupStage = watch("startupStage");

  // Calculate form progress
  useEffect(() => {
    const fields = [ideaTitle, problemStatement, proposedSolution, oneLinerPitch, detailedExplanation, startupStage];
    const filledFields = fields.filter(field => field && field.trim().length > 0).length;
    const progressPercentage = Math.round((filledFields / fields.length) * 100);
    setProgress(progressPercentage);
  }, [ideaTitle, problemStatement, proposedSolution, oneLinerPitch, detailedExplanation, startupStage]);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));

    // Check if already submitted
    const submissionData = localStorage.getItem("submission");
    if (submissionData) {
      setIsSubmitted(true);
    }
  }, [router]);

  useEffect(() => {
    if (detailedExplanation) {
      const words = detailedExplanation.trim().split(/\s+/).length;
      setWordCount(words);
    } else {
      setWordCount(0);
    }
  }, [detailedExplanation]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("submission");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account."
    });
    router.push("/");
  };

  const addSupportingLink = () => {
    setSupportingLinks([...supportingLinks, { type: 'github', url: '' }]);
  };

  const removeSupportingLink = (index: number) => {
    setSupportingLinks(supportingLinks.filter((_, i) => i !== index));
  };

  const updateSupportingLink = (index: number, field: 'type' | 'url', value: string) => {
    const updated = [...supportingLinks];
    updated[index][field] = value;
    setSupportingLinks(updated);
  };

  const onSubmit = async (data: SubmissionForm) => {
    if (wordCount < 200) {
      toast({
        title: "Detailed explanation too short",
        description: "Please provide at least 200 words in the detailed explanation.",
        variant: "destructive"
      });
      return;
    }

    if (!data.startupStage) {
      toast({
        title: "Startup stage required",
        description: "Please select your startup stage.",
        variant: "destructive"
      });
      return;
    }

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Store submission data
    localStorage.setItem("submission", JSON.stringify({
      ...data,
      submittedAt: new Date().toISOString(),
      status: "submitted"
    }));
    
    setIsSubmitted(true);
    
    toast({
      title: "Submission Successful! 🎉",
      description: "Your startup idea has been submitted successfully."
    });
    
    router.push("/confirmation");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <ECellLogo size="md" className="text-primary" />
              <div>
                <h1 className="text-xl font-bold">Startup Portal</h1>
                <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          {/* Submission Status */}
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-green-600">Submission Complete! 🎉</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Your startup idea has been successfully submitted and is under review.
              </p>
              <Badge variant="secondary" className="mb-4">Status: Under Review</Badge>
              <div className="space-y-2">
                <Button onClick={() => router.push("/confirmation")} className="w-full">
                  View Submission Details
                </Button>
                <Button variant="outline" onClick={handleLogout} className="w-full">
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <ECellLogo size="md" className="text-primary" />
            <div>
              <h1 className="text-xl font-bold">Startup Submission Portal</h1>
              <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Status and Progress */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">📝 Submit Your Startup Idea</h2>
              <p className="text-muted-foreground">Logged in as: <span className="font-medium">{user.name}</span> ({user.rollNumber})</p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {isSubmitted ? "Submitted" : "Form not submitted"}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Form Progress</span>
              <span className="font-medium">{progress}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Student Details Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">🧍‍♂️ Student Details</CardTitle>
            <p className="text-sm text-muted-foreground">Your information from registration</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={user.name} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Roll Number</Label>
                <Input value={user.rollNumber} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Branch</Label>
                <Input value={user.branch} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input value={user.year} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Email ID</Label>
                <Input value={user.email} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Please enter a valid 10-digit phone number"
                    }
                  })}
                  defaultValue={user.phone}
                  placeholder="Update your phone number"
                />
                {errors.phoneNumber && (
                  <p className="text-destructive text-sm">{errors.phoneNumber.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Startup Idea Submission Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚀 <span>Startup Idea Section</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">Tell us about your innovative startup idea</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Startup Idea Fields */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="ideaTitle">Idea Title *</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Keep it concise and catchy (max 80 characters)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="ideaTitle"
                    {...register("ideaTitle", {
                      required: "Idea title is required",
                      maxLength: {
                        value: 80,
                        message: "Title must be 80 characters or less"
                      }
                    })}
                    placeholder="Enter your startup idea title"
                    maxLength={80}
                  />
                  {errors.ideaTitle && (
                    <p className="text-destructive text-sm">{errors.ideaTitle.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="problemStatement">Problem Statement *</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clearly define the problem your startup addresses</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Textarea
                    id="problemStatement"
                    {...register("problemStatement", { required: "Problem statement is required" })}
                    placeholder="What specific problem does your startup solve? Be clear and focused."
                    rows={3}
                  />
                  {errors.problemStatement && (
                    <p className="text-destructive text-sm">{errors.problemStatement.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="proposedSolution">Proposed Solution *</Label>
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
                    placeholder="How does your startup solve the problem? What makes it unique?"
                    rows={3}
                  />
                  {errors.proposedSolution && (
                    <p className="text-destructive text-sm">{errors.proposedSolution.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="oneLinerPitch">One-liner Pitch *</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Summarize your startup in one compelling sentence (max 140 chars)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="oneLinerPitch"
                    {...register("oneLinerPitch", {
                      required: "One-liner pitch is required",
                      maxLength: {
                        value: 140,
                        message: "Pitch must be 140 characters or less"
                      }
                    })}
                    placeholder="Describe your startup in one compelling sentence"
                    maxLength={140}
                  />
                  <p className="text-xs text-muted-foreground">
                    {watch("oneLinerPitch")?.length || 0}/140 characters
                  </p>
                  {errors.oneLinerPitch && (
                    <p className="text-destructive text-sm">{errors.oneLinerPitch.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="detailedExplanation">Detailed Explanation *</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Minimum 200 words required. Include business model, target market, competitive advantage, etc.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Textarea
                    id="detailedExplanation"
                    {...register("detailedExplanation", { required: "Detailed explanation is required" })}
                    placeholder="Provide a comprehensive explanation of your startup idea, business model, target market, competitive advantage, revenue model, and implementation plan."
                    rows={8}
                  />
                  <div className="flex justify-between items-center text-sm">
                    <span className={wordCount < 200 ? "text-destructive" : "text-green-600"}>
                      {wordCount} words {wordCount < 200 && `(${200 - wordCount} more needed)`}
                    </span>
                    <Progress value={Math.min((wordCount / 200) * 100, 100)} className="w-32" />
                  </div>
                  {errors.detailedExplanation && (
                    <p className="text-destructive text-sm">{errors.detailedExplanation.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label>Startup Stage *</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select the current stage of your startup development</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <RadioGroup
                    onValueChange={(value) => setValue("startupStage", value)}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="idea" id="idea" />
                      <Label htmlFor="idea">Idea</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="validated" id="validated" />
                      <Label htmlFor="validated">Validated</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mvp" id="mvp" />
                      <Label htmlFor="mvp">MVP</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="launched" id="launched" />
                      <Label htmlFor="launched">Launched</Label>
                    </div>
                  </RadioGroup>
                  {errors.startupStage && (
                    <p className="text-destructive text-sm">Please select a startup stage</p>
                  )}
                </div>
              </div>

              {/* Uploads Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">📁 Uploads Section</h3>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label>Pitch Deck</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Upload your pitch deck (PDF, PPT, PPTX - max 10MB)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <FileUpload
                    onFileSelect={(file) => {
                      setPitchDeckFile(file);
                      setValue("pitchDeck", file);
                    }}
                    accept=".pdf,.ppt,.pptx"
                    maxSize={10 * 1024 * 1024} // 10MB
                    className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors"
                  />
                  {pitchDeckFile && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <FileText className="w-4 h-4" />
                      <span>{pitchDeckFile.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label>Supporting Links</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add links to GitHub, Drive, Figma, or other relevant resources</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSupportingLink}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Link
                    </Button>
                  </div>

                  {supportingLinks.map((link, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1 space-y-2">
                        <Label>Link Type</Label>
                        <select
                          value={link.type}
                          onChange={(e) => updateSupportingLink(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-input bg-background rounded-md"
                        >
                          <option value="github">GitHub</option>
                          <option value="drive">Google Drive</option>
                          <option value="figma">Figma</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="flex-[2] space-y-2">
                        <Label>URL</Label>
                        <Input
                          value={link.url}
                          onChange={(e) => updateSupportingLink(index, 'url', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeSupportingLink(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || wordCount < 200 || !startupStage || progress < 100}
                className="w-full bg-gradient-primary hover:shadow-glow-primary transition-all duration-300"
                size="lg"
              >
                🚀 {isSubmitting ? "Submitting..." : "Submit My Startup Idea"}
              </Button>

              {(wordCount < 200 || !startupStage || progress < 100) && !isSubmitting && (
                <p className="text-sm text-muted-foreground text-center">
                  Complete all required fields to submit your idea
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
