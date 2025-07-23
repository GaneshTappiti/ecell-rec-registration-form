'use client'

import React, { useState, useEffect } from "react";
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
import { LogOut, FileText, HelpCircle, Plus, Trash2, Shield, Phone, Mail, ExternalLink, CheckCircle, Clock, Users, Target, Lightbulb, Save, Lock, ChevronDown, ChevronUp, UserPlus, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileUpload } from "@/components/ui/file-upload";

import { ECellLogo } from "@/components/ECellLogo";

interface TeamMember {
  fullName: string;
  rollNumber: string;
  branch: string;
  year: string;
  phoneNumber: string;
}

interface SubmissionForm {
  ideaTitle: string;
  problemStatement: string;
  proposedSolution: string;
  oneLinerPitch: string;
  detailedExplanation: string;
  startupStage: string;
  phoneNumber: string;
  teamName: string;
  teamMembers: TeamMember[];
  pitchDeck?: File;
  githubLink?: string;
  driveLink?: string;
  figmaLink?: string;
  consent: boolean;
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
  const [supportingLinks, setSupportingLinks] = useState<{type: string, url: string}[]>([]);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isTeamSectionExpanded, setIsTeamSectionExpanded] = useState(true);
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<SubmissionForm>();
  const { toast } = useToast();
  const router = useRouter();

  const detailedExplanation = watch("detailedExplanation");
  const ideaTitle = watch("ideaTitle");
  const problemStatement = watch("problemStatement");
  const proposedSolution = watch("proposedSolution");
  const oneLinerPitch = watch("oneLinerPitch");
  const startupStage = watch("startupStage");
  const teamName = watch("teamName");

  // Calculate form progress
  useEffect(() => {
    const requiredFields = [ideaTitle, problemStatement, proposedSolution, oneLinerPitch, detailedExplanation, startupStage];
    const filledRequiredFields = requiredFields.filter(field => field && field.trim().length > 0).length;

    // Team information is optional, but if started, should be completed
    let teamProgress = 1; // Default to complete if no team members
    if (teamMembers.length > 0) {
      const completeMembers = teamMembers.filter(member =>
        member.fullName.trim() &&
        member.rollNumber.trim() &&
        member.branch.trim() &&
        member.year.trim() &&
        member.phoneNumber.trim().length === 10
      ).length;
      teamProgress = teamMembers.length > 0 ? completeMembers / teamMembers.length : 1;
    }

    const baseProgress = (filledRequiredFields / requiredFields.length) * 0.9; // 90% for required fields
    const teamProgressContribution = teamProgress * 0.1; // 10% for team completion
    const progressPercentage = Math.round((baseProgress + teamProgressContribution) * 100);
    setProgress(progressPercentage);
  }, [ideaTitle, problemStatement, proposedSolution, oneLinerPitch, detailedExplanation, startupStage, teamMembers]);

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

  const handleLogout = React.useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("submission");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account."
    });
    router.push("/");
  }, [router, toast]);

  const addSupportingLink = React.useCallback(() => {
    setSupportingLinks(prev => [...prev, { type: 'github', url: '' }]);
  }, []);

  const removeSupportingLink = React.useCallback((index: number) => {
    setSupportingLinks(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateSupportingLink = React.useCallback((index: number, field: 'type' | 'url', value: string) => {
    setSupportingLinks(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  }, []);

  const saveAsDraft = React.useCallback(async () => {
    const formData = watch();
    const draftData = {
      ...formData,
      supportingLinks,
      teamMembers,
      savedAt: new Date().toISOString(),
      status: "draft"
    };

    localStorage.setItem("draft", JSON.stringify(draftData));
    setIsDraftSaved(true);
    setLastSaved(new Date());

    toast({
      title: "Draft saved successfully",
      description: "Your progress has been saved. You can continue later."
    });
  }, [watch, supportingLinks, teamMembers, toast]);

  const addTeamMember = React.useCallback(() => {
    const newMember: TeamMember = {
      fullName: "",
      rollNumber: "",
      branch: "",
      year: "",
      phoneNumber: ""
    };
    setTeamMembers(prev => [...prev, newMember]);
  }, []);

  const removeTeamMember = React.useCallback((index: number) => {
    setTeamMembers(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateTeamMember = React.useCallback((index: number, field: keyof TeamMember, value: string) => {
    setTeamMembers(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  }, []);

  const validateTeamMembers = React.useCallback(() => {
    const rollNumbers = teamMembers.map(member => member.rollNumber).filter(roll => roll.trim() !== "");
    const duplicates = rollNumbers.filter((roll, index) => rollNumbers.indexOf(roll) !== index);
    return duplicates.length === 0;
  }, [teamMembers]);

  const handleViewConfirmation = React.useCallback(() => {
    router.push("/confirmation");
  }, [router]);

  const handleToggleTeamSection = React.useCallback(() => {
    setIsTeamSectionExpanded(prev => !prev);
  }, []);

  const handleSetStartupStage = React.useCallback((stage: string) => {
    setValue("startupStage", stage);
  }, [setValue]);

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

    // Validate team members if any are added
    if (teamMembers.length > 0) {
      const incompleteMembers = teamMembers.filter(member =>
        !member.fullName.trim() ||
        !member.rollNumber.trim() ||
        !member.branch.trim() ||
        !member.year.trim() ||
        member.phoneNumber.trim().length !== 10
      );

      if (incompleteMembers.length > 0) {
        toast({
          title: "Incomplete team information",
          description: "Please complete all team member details or remove incomplete entries.",
          variant: "destructive"
        });
        return;
      }

      if (!validateTeamMembers()) {
        toast({
          title: "Duplicate roll numbers",
          description: "Please ensure all team members have unique roll numbers.",
          variant: "destructive"
        });
        return;
      }
    }

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Store submission data
    localStorage.setItem("submission", JSON.stringify({
      ...data,
      teamMembers,
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

          {/* Post-Submission Success */}
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Thank You Message */}
            <Card className="text-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-2xl text-green-700 dark:text-green-300 flex items-center justify-center gap-2">
                  🎉 Submission Complete!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-green-600 dark:text-green-400 text-lg">
                  ✅ Submission received! Your idea will be reviewed by the E-Cell committee. Expect feedback within 7 days.
                </p>
                <div className="flex justify-center">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Status: Under Review
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  What happens next?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-300">1</div>
                    <div>
                      <h4 className="font-medium">Review Process</h4>
                      <p className="text-sm text-muted-foreground">Our committee will evaluate your submission within 7 days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-sm font-bold text-purple-600 dark:text-purple-300">2</div>
                    <div>
                      <h4 className="font-medium">Feedback & Mentorship</h4>
                      <p className="text-sm text-muted-foreground">Get personalized feedback and mentorship opportunities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-sm font-bold text-green-600 dark:text-green-300">3</div>
                    <div>
                      <h4 className="font-medium">Demo Day Preparation</h4>
                      <p className="text-sm text-muted-foreground">Selected ideas will be prepared for pitch presentations</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleViewConfirmation} className="flex-1 gap-2">
                <FileText className="w-4 h-4" />
                View Submission Details
              </Button>
              <Button variant="outline" onClick={handleLogout} className="flex-1 gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>

            {/* E-Cell Startup Assistance Team Monitoring Block - Post Submission */}
            <div className="mt-8 p-8 rounded-xl bg-gradient-to-br from-[#3b0764] to-[#1e1b4b] text-white shadow-xl border border-purple-600/30">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-purple-300 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    🛡️ Monitored by E-Cell Startup Assistance Team
                  </h3>
                  <p className="text-gray-200 mb-6 leading-relaxed text-lg">
                    Your submission will be personally reviewed and monitored by the Startup Assistance Lead and the E-Cell Mentorship Committee.
                  </p>

                  <div className="space-y-4 mb-6">
                    <p className="text-sm font-semibold text-purple-300">We're committed to supporting your entrepreneurial journey by:</p>
                    <ul className="list-disc list-inside text-sm text-gray-300 space-y-2 ml-4">
                      <li>Guiding you through validation & MVP stages</li>
                      <li>Providing feedback on your pitch deck</li>
                      <li>Preparing you for Demo Day and Incubator rounds</li>
                      <li>Connecting promising teams to funding and campus opportunities</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                    <p className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                      📞 Contact Information:
                    </p>
                    <div className="space-y-2 text-sm text-gray-200">
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-purple-300" />
                        <span><strong>Ganesh Tappiti</strong> — Startup Assistance Lead</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-purple-300" />
                        <a href="mailto:tappitiganesh@gmail.com" className="text-purple-300 hover:text-white hover:underline">
                          tappitiganesh@gmail.com
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <ExternalLink className="w-4 h-4 text-purple-300" />
                        <span>Raghu Engineering College (E-Cell REC)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Navigation Bar */}
        <div className="sticky top-0 z-50 flex justify-between items-center mb-8 p-4 bg-background/80 backdrop-blur-sm border-b shadow-sm rounded-lg">
          <div className="flex items-center gap-3">
            <ECellLogo size="md" className="text-primary" />
            <div>
              <h1 className="text-xl font-bold">Startup Submission Portal</h1>
              <p className="text-sm text-muted-foreground">Logged in as: <span className="font-medium">{user.name}</span> ({user.rollNumber})</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Hero Section / Welcome Header */}
        <div className="w-full p-6 mb-6 rounded-xl bg-gradient-to-br from-[#3b0764] to-[#1e1b4b] text-white shadow-xl">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            Welcome to E-Cell REC <span className="text-2xl">🚀</span>
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed mb-4">
            We're here to help you validate and grow your startup idea. Fill the form below to officially submit your idea for mentorship, feedback, and funding opportunities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>📥 Submit your idea</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Target className="w-4 h-4 text-blue-400" />
              <span>📊 Evaluation & feedback</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Users className="w-4 h-4 text-purple-400" />
              <span>🎤 Pitch to panel / demo day</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" className="gap-2">
              <FileText className="w-4 h-4" />
              Submission Guidelines
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </Button>
          </div>
        </div>



        {/* Form Progress Indicator */}
        <div className="mb-8 p-4 rounded-lg border bg-card">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                📝 Submit Your Startup Idea
              </h2>
              <p className="text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {lastSaved ? `Last saved: ${lastSaved.toLocaleTimeString()}` : "Your responses are saved automatically"}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant={isSubmitted ? "default" : "secondary"} className="text-sm">
                {isSubmitted ? "✅ Submitted" : isDraftSaved ? "💾 Draft saved" : "📝 Form not submitted"}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">Form Progress</span>
              <span className="font-bold text-primary">{progress}% Complete</span>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-3" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-white drop-shadow-sm">
                  {progress}%
                </span>
              </div>
            </div>
            {progress < 100 && (
              <p className="text-xs text-muted-foreground">
                Complete all required fields to enable submission
              </p>
            )}
          </div>
        </div>

        {/* Student Details Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🧍‍♂️ Student Details
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              This information was pulled from your registration and is read-only
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Lock className="w-3 h-3 text-muted-foreground" />
                  Full Name
                </Label>
                <Input value={user.name} disabled className="bg-muted/50 border-muted" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Lock className="w-3 h-3 text-muted-foreground" />
                  Roll Number
                </Label>
                <Input value={user.rollNumber} disabled className="bg-muted/50 border-muted" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Lock className="w-3 h-3 text-muted-foreground" />
                  Branch
                </Label>
                <Input value={user.branch} disabled className="bg-muted/50 border-muted" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Lock className="w-3 h-3 text-muted-foreground" />
                  Year
                </Label>
                <Input value={user.year} disabled className="bg-muted/50 border-muted" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Lock className="w-3 h-3 text-muted-foreground" />
                  Email ID
                </Label>
                <Input value={user.email} disabled className="bg-muted/50 border-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-primary" />
                  Phone Number *
                </Label>
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
                  className="border-primary/20 focus:border-primary"
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: "idea", label: "💡 Idea Stage", desc: "Just an idea" },
                      { value: "validated", label: "✅ Validated", desc: "Tested with users" },
                      { value: "mvp", label: "🚀 MVP Ready", desc: "Minimum viable product" },
                      { value: "launched", label: "🎯 Launched", desc: "Live in market" }
                    ].map((stage) => (
                      <Button
                        key={stage.value}
                        type="button"
                        variant={startupStage === stage.value ? "default" : "outline"}
                        className={`h-auto p-4 flex flex-col items-center gap-2 ${
                          startupStage === stage.value
                            ? "bg-primary text-primary-foreground border-primary"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => handleSetStartupStage(stage.value)}
                      >
                        <span className="font-medium text-sm">{stage.label}</span>
                        <span className="text-xs opacity-80">{stage.desc}</span>
                      </Button>
                    ))}
                  </div>
                  {errors.startupStage && (
                    <p className="text-destructive text-sm">Please select a startup stage</p>
                  )}
                </div>
              </div>

              {/* Team Information Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      👥 Team Information
                    </h3>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add details of your team members collaborating on this idea</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleTeamSection}
                    className="gap-2"
                  >
                    {isTeamSectionExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {isTeamSectionExpanded ? "Collapse" : "Expand"}
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  Add details of your team members collaborating on this idea.
                  <br />
                  <span className="text-xs">🔸 Note: You can add as many members as needed. Each member must be from Raghu Engineering College.</span>
                </p>

                {isTeamSectionExpanded && (
                  <div className="space-y-6">
                    {/* Team Name */}
                    <div className="space-y-2">
                      <Label htmlFor="teamName" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Team Name
                      </Label>
                      <Input
                        id="teamName"
                        {...register("teamName")}
                        placeholder="Enter your team name (optional)"
                        className="focus:border-primary"
                      />
                    </div>

                    {/* Team Leader (Auto-filled) */}
                    <div className="p-4 border rounded-lg bg-primary/5 border-primary/20">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                          👤
                        </div>
                        <Label className="font-medium text-primary">Team Leader (You)</Label>
                        <Badge variant="secondary" className="text-xs">Auto-filled</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Full Name</Label>
                          <Input value={user?.name || ""} disabled className="bg-muted/50 text-sm" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Roll Number</Label>
                          <Input value={user?.rollNumber || ""} disabled className="bg-muted/50 text-sm" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Branch</Label>
                          <Input value={user?.branch || ""} disabled className="bg-muted/50 text-sm" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Year</Label>
                          <Input value={user?.year || ""} disabled className="bg-muted/50 text-sm" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Phone</Label>
                          <Input value={user?.phone || ""} disabled className="bg-muted/50 text-sm" />
                        </div>
                      </div>
                    </div>

                    {/* Team Members */}
                    {teamMembers.length === 0 && (
                      <div className="text-center p-6 border-2 border-dashed border-muted rounded-lg bg-muted/20">
                        <UserPlus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">No additional team members added yet</p>
                        <p className="text-xs text-muted-foreground">Click "Add Team Member" to include your collaborators</p>
                      </div>
                    )}

                    {teamMembers.map((member, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-card">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-300">
                              {index + 2}
                            </div>
                            <Label className="font-medium">Member {index + 2}</Label>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeTeamMember(index)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Full Name *</Label>
                            <Input
                              value={member.fullName}
                              onChange={(e) => updateTeamMember(index, 'fullName', e.target.value)}
                              placeholder="Ex: Karthik Reddy"
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Roll Number *</Label>
                            <Input
                              value={member.rollNumber}
                              onChange={(e) => updateTeamMember(index, 'rollNumber', e.target.value)}
                              placeholder="Ex: 21EC041"
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Branch *</Label>
                            <select
                              value={member.branch}
                              onChange={(e) => updateTeamMember(index, 'branch', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
                            >
                              <option value="">Select Branch</option>
                              <option value="CSE">Computer Science Engineering</option>
                              <option value="ECE">Electronics & Communication</option>
                              <option value="EEE">Electrical & Electronics</option>
                              <option value="MECH">Mechanical Engineering</option>
                              <option value="CIVIL">Civil Engineering</option>
                              <option value="AI/DS">AI & Data Science</option>
                              <option value="IT">Information Technology</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Year *</Label>
                            <select
                              value={member.year}
                              onChange={(e) => updateTeamMember(index, 'year', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
                            >
                              <option value="">Select Year</option>
                              <option value="1st Year">1st Year</option>
                              <option value="2nd Year">2nd Year</option>
                              <option value="3rd Year">3rd Year</option>
                              <option value="Final Year">Final Year</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Phone Number *</Label>
                            <Input
                              value={member.phoneNumber}
                              onChange={(e) => updateTeamMember(index, 'phoneNumber', e.target.value)}
                              placeholder="10-digit mobile"
                              pattern="[0-9]{10}"
                              maxLength={10}
                              className="text-sm"
                            />
                          </div>
                        </div>

                        {/* Validation indicators */}
                        <div className="mt-2 flex items-center gap-4 text-xs">
                          {member.fullName && member.rollNumber && member.branch && member.year && member.phoneNumber.length === 10 ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Complete
                            </span>
                          ) : (
                            <span className="text-amber-600 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Incomplete
                            </span>
                          )}
                          {teamMembers.filter(m => m.rollNumber === member.rollNumber && m.rollNumber.trim() !== "").length > 1 && (
                            <span className="text-destructive flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Duplicate roll number
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Add Team Member Button */}
                    <div className="flex justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addTeamMember}
                        className="gap-2 hover:bg-primary/10"
                      >
                        <Plus className="w-4 h-4" />
                        Add Team Member
                      </Button>
                    </div>

                    {/* Team Summary */}
                    {teamMembers.length > 0 && (
                      <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Team Summary
                        </h4>
                        <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          <p>Total team size: <span className="font-medium">{teamMembers.length + 1} members</span> (including you)</p>
                          {teamMembers.length > 5 && (
                            <p className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Large team size - consider if all members are essential
                            </p>
                          )}
                          {!validateTeamMembers() && (
                            <p className="text-destructive flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Duplicate roll numbers detected
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Uploads Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  📁 Uploads Section
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label>📄 Pitch Deck</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Upload your pitch deck presentation</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="p-4 border-2 border-dashed border-primary/20 rounded-lg bg-primary/5">
                    <FileUpload
                      onFileSelect={(file) => setValue("pitchDeck", file)}
                      accept=".pdf,.ppt,.pptx"
                      maxSize={10 * 1024 * 1024} // 10MB
                      className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors"
                    />
                    <div className="mt-2 text-xs text-muted-foreground">
                      <p>📋 Allowed formats: PDF, PPT, PPTX</p>
                      <p>📏 Maximum file size: 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label>🔗 Supporting Links</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Paste your GitHub, Drive, Figma, or Notion link here. Optional: show icons beside each.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSupportingLink}
                      className="gap-2 hover:bg-primary/10"
                    >
                      <Plus className="w-4 h-4" />
                      Add Link
                    </Button>
                  </div>

                  {supportingLinks.length === 0 && (
                    <div className="text-center p-6 border-2 border-dashed border-muted rounded-lg bg-muted/20">
                      <p className="text-sm text-muted-foreground mb-2">No supporting links added yet</p>
                      <p className="text-xs text-muted-foreground">Add links to your GitHub repositories, Google Drive files, Figma designs, or other relevant resources</p>
                    </div>
                  )}

                  {supportingLinks.map((link, index) => (
                    <div key={index} className="flex gap-3 items-end p-4 border rounded-lg bg-card">
                      <div className="flex-1 space-y-2">
                        <Label className="text-sm font-medium">Link Type</Label>
                        <select
                          value={link.type}
                          onChange={(e) => updateSupportingLink(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-input bg-background rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                          <option value="github">🐙 GitHub</option>
                          <option value="drive">📁 Google Drive</option>
                          <option value="figma">🎨 Figma</option>
                          <option value="notion">📝 Notion</option>
                          <option value="other">🔗 Other</option>
                        </select>
                      </div>
                      <div className="flex-[2] space-y-2">
                        <Label className="text-sm font-medium">URL</Label>
                        <Input
                          value={link.url}
                          onChange={(e) => updateSupportingLink(index, 'url', e.target.value)}
                          placeholder={
                            link.type === 'github' ? 'https://github.com/username/repository' :
                            link.type === 'drive' ? 'https://drive.google.com/...' :
                            link.type === 'figma' ? 'https://figma.com/...' :
                            link.type === 'notion' ? 'https://notion.so/...' :
                            'https://...'
                          }
                          className="focus:border-primary"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeSupportingLink(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consent / Final Check */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    className="mt-1"
                    {...register("consent", { required: "You must agree to the terms" })}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="consent" className="text-sm font-medium cursor-pointer">
                      ✅ I confirm that this submission is my original work and abides by E-Cell REC's terms.
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      By submitting, you agree to our{" "}
                      <Button variant="link" className="p-0 h-auto text-xs underline">
                        Submission Guidelines
                      </Button>
                    </p>
                  </div>
                </div>
                {errors.consent && (
                  <p className="text-destructive text-sm">{errors.consent.message}</p>
                )}
              </div>

              {/* Submission Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={saveAsDraft}
                  className="flex-1 gap-2"
                  disabled={isSubmitting}
                >
                  <Save className="w-4 h-4" />
                  Save as Draft
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || wordCount < 200 || !startupStage || progress < 100}
                  className="flex-1 bg-gradient-primary hover:shadow-glow-primary transition-all duration-300"
                  size="lg"
                >
                  🚀 {isSubmitting ? "Submitting..." : "Submit My Startup Idea"}
                </Button>
              </div>

              {(wordCount < 200 || !startupStage || progress < 100) && !isSubmitting && (
                <p className="text-sm text-muted-foreground text-center">
                  Complete all required fields to submit your idea
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* E-Cell Startup Assistance Team Monitoring Block - Footer */}
        <div className="mt-12 p-8 rounded-xl bg-gradient-to-br from-[#3b0764] to-[#1e1b4b] text-white shadow-xl border border-purple-600/30">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-purple-300 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                🛡️ Monitored by E-Cell Startup Assistance Team
              </h3>
              <p className="text-gray-200 mb-6 leading-relaxed text-lg">
                Your submission will be personally reviewed and monitored by the Startup Assistance Lead and the E-Cell Mentorship Committee.
              </p>

              <div className="space-y-4 mb-6">
                <p className="text-sm font-semibold text-purple-300">We're committed to supporting your entrepreneurial journey by:</p>
                <ul className="list-disc list-inside text-sm text-gray-300 space-y-2 ml-4">
                  <li>Guiding you through validation & MVP stages</li>
                  <li>Providing feedback on your pitch deck</li>
                  <li>Preparing you for Demo Day and Incubator rounds</li>
                  <li>Connecting promising teams to funding and campus opportunities</li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                <p className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                  📞 Contact Information:
                </p>
                <div className="space-y-2 text-sm text-gray-200">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-purple-300" />
                    <span><strong>Ganesh Tappiti</strong> — Startup Assistance Lead</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-purple-300" />
                    <a href="mailto:tappitiganesh@gmail.com" className="text-purple-300 hover:text-white hover:underline">
                      tappitiganesh@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-4 h-4 text-purple-300" />
                    <span>Raghu Engineering College (E-Cell REC)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
