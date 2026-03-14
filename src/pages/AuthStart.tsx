import { useNavigate } from "react-router-dom";
import { UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import gogazLogo from "@/assets/gogaz-logo-new.png";

const AuthStart = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="flex w-full max-w-sm flex-col items-center">
        <img src={gogazLogoLight} alt="GoGaz" className="mb-2 w-[200px] object-contain" />
        <p className="mb-12 text-sm italic text-muted-foreground">
          Nous vous simplifions la vie
        </p>

        <div className="flex w-full flex-col gap-3">
          <Button
            onClick={() => navigate("/register")}
            className="h-14 w-full rounded-2xl text-base font-semibold"
          >
            <UserPlus size={18} className="mr-2" />
            Créer un compte
          </Button>

          <Button
            onClick={() => navigate("/login")}
            variant="outline"
            className="h-14 w-full rounded-2xl border-2 text-base font-semibold border-primary text-primary"
          >
            <LogIn size={18} className="mr-2" />
            Se connecter
          </Button>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          En continuant vous acceptez nos{" "}
          <button className="font-semibold text-accent">
            Conditions d'utilisation
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthStart;
