const Button = ({ children, onClick, type = "button", disabled=false, className }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl ${className}`}
  >
    {children}
  </button>
);
export default Button;
