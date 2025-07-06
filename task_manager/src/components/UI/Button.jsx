const Button = ({ children, onClick, type = "button", color="indigo", disabled=false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`w-full bg-${color}-600 text-white py-2 rounded-md hover:bg-${color}-700 transition`}
  >
    {children}
  </button>
);
export default Button;
