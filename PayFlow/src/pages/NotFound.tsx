import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center space-y-6 p-8">
          {/* Icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>

          {/* 404 Text */}
          <div className="space-y-2 text-center">
            <h1 className="text-6xl font-bold text-primary">404</h1>
            <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
          </div>

          {/* Description */}
          <p className="text-center text-muted-foreground">
            Sorry! We couldn't find the page you're looking for.
            <br />
            <span className="text-sm font-mono text-primary/70 mt-2 block break-all">
              {location.pathname}
            </span>
          </p>

          {/* Buttons */}
          <div className="flex w-full flex-col gap-3 pt-2">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button 
              onClick={() => navigate("/")}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </div>

          {/* Footer */}
          <p className="text-xs text-muted-foreground">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
