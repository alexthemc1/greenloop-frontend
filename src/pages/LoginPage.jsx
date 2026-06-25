import { useState } from "react";
import { Link } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";
import LoginForm from "../components/auth/LoginForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="flex h-dvh relative">

      <div className="block md:block lg:hidden absolute inset-0 z-0">
        <img src="/login-background.jpg" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-white/80" />
      </div>

      <div className="flex flex-col justify-center w-full lg:w-1/2 px-6 md:px-16 relative z-10">

        <div className="absolute top-5 left-6">
          <Link to="/">
            <img src="/logo.svg" alt="logo" className="h-10" />
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="text-green-600 hover:underline text-sm">
            Retour à l'accueil
          </Link>

          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>

        <div className="absolute bottom-5 left-6 text-sm text-gray-600">
          {isLogin ? (
            <>
              Vous n’avez pas de compte ?{" "}
              <button onClick={() => setIsLogin(false)} className="text-green-600 hover:underline">
                S’inscrire
              </button>
            </>
          ) : (
            <>
              Vous avez déjà un compte ?{" "}
              <button onClick={() => setIsLogin(true)} className="text-green-600 hover:underline">
                Se connecter
              </button>
            </>
          )}
        </div>

      </div>

      <div className="hidden lg:block lg:w-1/2">
        <img src="/login-background.jpg" className="w-full h-full object-cover" />
      </div>

    </div>
  );
}