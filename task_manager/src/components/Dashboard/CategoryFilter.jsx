const CategoryFilter = ({ setSelectedCategory }) => {
  const categories = ["All", "Work", "Personal", "Learning"]; // Can fetch from API

  return (
    <select
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
    >
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
};

export default CategoryFilter;
