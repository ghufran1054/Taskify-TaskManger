const InputField = ({ label, type = "text", value, onChange }) => (
  <div className="flex flex-col mb-4">
    <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
);
export default InputField;
