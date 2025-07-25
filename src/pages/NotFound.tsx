import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, Home } from "lucide-react";
import { LitButton } from "../components/LitButton";
import { LitCard } from "../components/LitCard";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto">
        <LitCard className="text-center space-y-6 border-white">
          <AlertTriangle className="w-20 h-20 text-white mx-auto" />
          
          <div className="space-y-2">
            <h1 className="text-6xl font-extrabold text-white">
              404
            </h1>
            <h2 className="text-2xl font-bold text-white">
              Page Not Found
            </h2>
            <p className="text-white">
              The page you're looking for doesn't exist in the Strills universe.
            </p>
          </div>

          <LitButton
            variant="primary"
            size="lg"
            glow
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 mx-auto text-white"
          >
            <Home className="w-5 h-5 text-white" />
            <span>Return to Home</span>
          </LitButton>
        </LitCard>
      </div>
    </div>
  );
};

export default NotFound;
