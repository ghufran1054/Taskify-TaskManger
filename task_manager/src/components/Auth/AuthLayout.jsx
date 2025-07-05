const AuthLayout = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white shadow-md rounded-md p-6 w-full max-w-sm">
      <h2 className="text-center text-2xl font-bold mb-4">Smart Task Manager</h2>
      {children}
    </div>
  </div>
);
export default AuthLayout;
