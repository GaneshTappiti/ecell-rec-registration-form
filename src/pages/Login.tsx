import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Eye, EyeOff, LogIn } from "lucide-react";

interface LoginForm {
  emailOrRoll: string;
  password: string;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store user session (in real app, this would be handled by authentication service)
    localStorage.setItem("user", JSON.stringify({
      name: "Ganesh Kumar",
      rollNumber: "21CS101",
      email: "ganesh@raghuenggcollege.in",
      branch: "Computer Science Engineering",
      year: "3rd Year",
      phone: "9876543210"
    }));
    
    toast({
      title: "Login Successful! 🎉",
      description: "Welcome back to the startup portal."
    });
    
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Background elements */}
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-primary opacity-20 blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-gradient-accent opacity-15 blur-xl animate-pulse delay-1000" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-card/50 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">E-Cell</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-lg text-muted-foreground">
            Login to access your startup submission portal
          </p>
        </div>

        {/* Login Form */}
        <div className="max-w-md mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <LogIn className="w-5 h-5 text-primary" />
                Login to Your Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email or Roll Number */}
                <div className="space-y-2">
                  <Label htmlFor="emailOrRoll">Email ID or Roll Number</Label>
                  <Input
                    id="emailOrRoll"
                    {...register("emailOrRoll", { required: "Email or roll number is required" })}
                    autoFocus
                    className="bg-background/50"
                    placeholder="Enter your email or roll number"
                  />
                  {errors.emailOrRoll && (
                    <p className="text-destructive text-sm">{errors.emailOrRoll.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password", { required: "Password is required" })}
                      className="bg-background/50 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-destructive text-sm">{errors.password.message}</p>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-primary hover:shadow-glow-primary transition-all duration-300"
                  size="lg"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>

                {/* Register Link */}
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary hover:underline">
                      Register here
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}