import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"
import { ECellLogo } from "@/components/ECellLogo"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      {/* Background elements */}
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-primary opacity-20 blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-gradient-accent opacity-15 blur-xl animate-pulse delay-1000" />
      
      <div className="text-center relative z-10 max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-card/50 backdrop-blur-sm mb-6">
          <ECellLogo size="sm" className="text-primary" />
          <span className="text-xs font-medium">E-Cell</span>
        </div>

        {/* 404 */}
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        
        {/* Message */}
        <h2 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
          Page Not Found
        </h2>
        
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full bg-gradient-primary hover:shadow-glow-primary transition-all duration-300">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}
