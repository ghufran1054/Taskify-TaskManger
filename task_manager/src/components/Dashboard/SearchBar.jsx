const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search tasks..."
    className="flex-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
  />
);

export default SearchBar;
