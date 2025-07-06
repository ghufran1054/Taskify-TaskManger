const AuthLayout = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white shadow-md rounded-md p-6 w-full max-w-sm">
      <h1 className="text-2xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
        Welcome to Taskify!
      </h1>

      {children}
    </div>
  </div>
);
export default AuthLayout;
