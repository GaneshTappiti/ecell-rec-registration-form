'use client'

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Rocket, CheckCircle, AlertCircle } from "lucide-react";
import { ECellLogo } from "@/components/ECellLogo";

interface RegisterForm {
  fullName: string;
  email: string;
  rollNumber: string;
  branch: string;
  year: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailValidation, setEmailValidation] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [rollValidation, setRollValidation] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<RegisterForm>();
  const { toast } = useToast();
  const router = useRouter();

  const password = watch("password");
  const email = watch("email");
  const rollNumber = watch("rollNumber");

  // Real-time email validation
  useEffect(() => {
    if (email) {
      const emailRegex = /^[^\s@]+@raghuenggcollege\.in$/;
      if (emailRegex.test(email)) {
        // Simulate checking if email is already registered
        setTimeout(() => {
          setEmailValidation('valid');
        }, 500);
      } else {
        setEmailValidation('invalid');
      }
    } else {
      setEmailValidation('idle');
    }
  }, [email]);

  // Real-time roll number validation
  useEffect(() => {
    if (rollNumber) {
      const rollRegex = /^[0-9]{2}[A-Z]{2}[0-9]{3}$/;
      if (rollRegex.test(rollNumber)) {
        // Simulate checking if roll number is already registered
        setTimeout(() => {
          setRollValidation('valid');
        }, 500);
      } else {
        setRollValidation('invalid');
      }
    } else {
      setRollValidation('idle');
    }
  }, [rollNumber]);

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Password Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    // Simulate registration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Registration Successful! 🎉",
      description: "Your account has been created successfully."
    });
    
    router.push("/login");
  };

  const branches = [
    "Computer Science Engineering",
    "Electronics & Communication Engineering", 
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Information Technology"
  ];

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-primary opacity-20 blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-gradient-accent opacity-15 blur-xl animate-pulse delay-1000" />
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-card/50 backdrop-blur-sm mb-4">
            <ECellLogo size="sm" className="text-primary" />
            <span className="text-xs font-medium">E-Cell</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Startup Submission Portal
          </h1>
          <p className="text-sm text-muted-foreground">
            Create Your Account to Submit Your Startup Idea
          </p>
        </div>

        {/* Registration Form */}
        <div className="max-w-xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-center flex items-center justify-center gap-2 text-lg">
                <Rocket className="w-4 h-4 text-primary" />
                Register Your Account
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      {...register("fullName", { required: "Full name is required" })}
                      autoFocus
                      className="bg-background/50"
                    />
                    {errors.fullName && (
                      <p className="text-destructive text-sm">{errors.fullName.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email ID</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@raghuenggcollege\.in$/,
                            message: "Email must end with @raghuenggcollege.in"
                          }
                        })}
                        className="bg-background/50 pr-10"
                        placeholder="yourname@raghuenggcollege.in"
                      />
                      {emailValidation === 'valid' && (
                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                      )}
                      {emailValidation === 'invalid' && (
                        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-destructive" />
                      )}
                    </div>
                    {errors.email && (
                      <p className="text-destructive text-sm">{errors.email.message}</p>
                    )}
                    {emailValidation === 'valid' && !errors.email && (
                      <p className="text-green-500 text-sm">✓ Email is available</p>
                    )}
                  </div>

                  {/* Roll Number */}
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <div className="relative">
                      <Input
                        id="rollNumber"
                        {...register("rollNumber", {
                          required: "Roll number is required",
                          pattern: {
                            value: /^[0-9]{2}[A-Z]{2}[0-9]{3}$/,
                            message: "Format: 21CS101 (2 digits + 2 letters + 3 digits)"
                          }
                        })}
                        className="bg-background/50 pr-10"
                        placeholder="21CS101"
                        style={{ textTransform: 'uppercase' }}
                      />
                      {rollValidation === 'valid' && (
                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                      )}
                      {rollValidation === 'invalid' && (
                        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-destructive" />
                      )}
                    </div>
                    {errors.rollNumber && (
                      <p className="text-destructive text-sm">{errors.rollNumber.message}</p>
                    )}
                    {rollValidation === 'valid' && !errors.rollNumber && (
                      <p className="text-green-500 text-sm">✓ Roll number is available</p>
                    )}
                  </div>

                  {/* Branch */}
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Select onValueChange={(value) => setValue("branch", value)}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Select your branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch} value={branch}>
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.branch && (
                      <p className="text-destructive text-sm">Branch is required</p>
                    )}
                  </div>

                  {/* Year */}
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select onValueChange={(value) => setValue("year", value)}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Select your year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.year && (
                      <p className="text-destructive text-sm">Year is required</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      {...register("phoneNumber", { 
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Please enter a valid 10-digit phone number"
                        }
                      })}
                      className="bg-background/50"
                    />
                    {errors.phoneNumber && (
                      <p className="text-destructive text-sm">{errors.phoneNumber.message}</p>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password", { 
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters"
                        }
                      })}
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

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword", { required: "Please confirm your password" })}
                      className="bg-background/50 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-primary hover:shadow-glow-primary transition-all duration-300"
                  size="default"
                >
                  {isSubmitting ? "Creating Account..." : "Register"}
                </Button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Already registered?{" "}
                    <Link href="/login" className="text-primary hover:underline">
                      Login here
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
