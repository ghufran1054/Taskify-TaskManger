const AuthLayout = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white shadow-md rounded-md p-6 w-full max-w-sm">
            <h1 className="text-2xl text-center font-bold text-indigo-600 hover:text-indigo-700 transition-colors duration-200">Welcome to Taskify!</h1>

      {children}
    </div>
  </div>
);
export default AuthLayout;
