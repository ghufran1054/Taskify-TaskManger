import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/Auth/AuthLayout";
import AuthForm from "../components/Auth/AuthForm";
import { useAuthController } from "../controllers/AuthController";

const LoginPage = () => {
  const { login } = useAuthController();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) navigate("/dashboard");
    else alert(res.message);
  };

  return (
    <AuthLayout>
      <AuthForm
        type="login"
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onSubmit={handleLogin}
        extra={<Link to="/signup" className="text-blue-600 hover:underline">Don't have an account? Sign up</Link>}
      />
    </AuthLayout>
  );
};

export default LoginPage;
