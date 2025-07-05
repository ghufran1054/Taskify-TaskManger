const Button = ({ children, onClick, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
  >
    {children}
  </button>
);
export default Button;
