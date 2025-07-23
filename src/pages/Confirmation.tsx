import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle, Eye, Rocket, Users, MessageCircle } from "lucide-react";

interface User {
  name: string;
  rollNumber: string;
  email: string;
}

interface Submission {
  ideaTitle: string;
  oneLinerPitch: string;
  submittedAt: string;
}

export default function Confirmation() {
  const [user, setUser] = useState<User | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));

    // Check if submission exists
    const submissionData = localStorage.getItem("submission");
    if (!submissionData) {
      navigate("/dashboard");
      return;
    }
    setSubmission(JSON.parse(submissionData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("submission");
    navigate("/login");
  };

  const handleViewSubmission = () => {
    // In a real app, this would navigate to a detailed view page
    // For now, we'll show an alert with submission details
    const submissionData = localStorage.getItem("submission");
    if (submissionData) {
      const data = JSON.parse(submissionData);
      alert(`Submission Details:\n\nTitle: ${data.ideaTitle}\nPitch: ${data.oneLinerPitch}\nStage: ${data.startupStage}\nSubmitted: ${new Date(data.submittedAt).toLocaleString()}`);
    }
  };

  if (!user || !submission) {
    return <div>Loading...</div>;
  }

  const submissionDate = new Date(submission.submittedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-primary opacity-20 blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-gradient-accent opacity-15 blur-xl animate-pulse delay-1000" />
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-card/50 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">E-Cell</span>
          </div>
          
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Thanks for submitting, {user.name.split(' ')[0]}! 👋
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your startup idea has been received successfully. Our team will review your submission and get back to you soon.
          </p>
        </div>

        {/* Submission Summary */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-primary" />
                Submission Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Startup Title</h4>
                  <p className="font-medium">{submission.ideaTitle}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Submission ID</h4>
                  <p className="font-mono text-sm">{user.rollNumber}-{new Date(submission.submittedAt).getTime().toString().slice(-6)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Submitted On</h4>
                  <p className="text-sm">{submissionDate}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Status</h4>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                    Under Review
                  </Badge>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <h4 className="font-medium text-sm text-muted-foreground mb-2">One-line Pitch</h4>
                <p className="italic">"{submission.oneLinerPitch}"</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            onClick={handleViewSubmission}
            className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300"
            size="lg"
          >
            <Eye className="mr-2 w-5 h-5" />
            View My Submission
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="border-primary/30 hover:bg-primary/10"
            disabled
          >
            <Rocket className="mr-2 w-5 h-5" />
            Submit Another Idea
          </Button>
        </div>

        {/* Next Steps */}
        <div className="max-w-3xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-center">What happens next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Review Process</h3>
                  <p className="text-sm text-muted-foreground">
                    Our expert panel will review your submission within 7-10 business days
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Mentorship</h3>
                  <p className="text-sm text-muted-foreground">
                    Selected ideas will be assigned mentors for guidance and support
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
                    <Rocket className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Incubation</h3>
                  <p className="text-sm text-muted-foreground">
                    Top ideas will enter our incubation program for full development
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Links */}
        <div className="text-center mt-12 space-y-4">
          <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10">
              <MessageCircle className="mr-2 w-5 h-5" />
              Join WhatsApp Group
            </Button>
            <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10">
              <Users className="mr-2 w-5 h-5" />
              Follow E-Cell Updates
            </Button>
          </div>
          
          <div className="pt-8">
            <Button variant="ghost" onClick={handleLogout}>
              Logout from Portal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}