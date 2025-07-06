import InputField from "./InputField";
import Button from "../UI/Button";

const AuthForm = ({ type, email, setEmail, username, setUsername, password, setPassword, onSubmit, extra }) => (
  <form onSubmit={onSubmit}>
    {type === "signup" &&  <InputField label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />}
    <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
    <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
    <Button className="w-full" type="submit">{type === "login" ? "Login" : "Sign Up"}</Button>
    <div className="mt-4 text-center text-sm text-gray-600">{extra}</div>
  </form>
);

export default AuthForm;
