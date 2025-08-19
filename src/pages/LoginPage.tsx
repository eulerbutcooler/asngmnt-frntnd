import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import AuthForm from "../components/AuthForm";
import { AuthContext } from "../App";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = (token: string, role: string) => {
    login(token, role);
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <AuthForm type="login" onSuccess={handleLoginSuccess} />
      <p className="mt-4">
        Don't have an account?{" "}
        <span
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => navigate("/signup")}
        >
          Sign up here
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
