import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/Auth/AuthLayout";
import AuthForm from "../components/Auth/AuthForm";
import { useAuthController } from "../controllers/AuthController";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();
  const { signup } = useAuthController();

  const handleSignup = async (e) =>  {
    e.preventDefault();
    const res = await signup(email, password, username);
    if (res.success) navigate("/login");
    else alert(res.message);

  };

  return (
    <AuthLayout>
      <AuthForm
        type="signup"
        email={email}
        username={username}
        setUsername={setUsername}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onSubmit={handleSignup}
        extra={<Link to="/login" className="text-blue-600 hover:underline">Already have an account? Login</Link>}
      />
    </AuthLayout>
  );
};

export default SignupPage;
