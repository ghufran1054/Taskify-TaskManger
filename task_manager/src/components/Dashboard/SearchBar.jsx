import { useState, useEffect } from 'react';
import { Search, Filter, X, Plus, Calendar, Check, ChevronDown } from 'lucide-react';
import { useCategories } from '../../context/CategoryContext';
import { useTasks } from '../../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
const SearchBar = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const {categories} = useCategories();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [afterDate, setAfterDate] = useState('');
  const [beforeDate, setBeforeDate] = useState('');
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const {setSearchQuery, searchQuery} = useTasks();
  const [searchValue, setSearchValue] = useState(searchQuery.title || '');

  const navigate = useNavigate();
  // Update active filters count
  useEffect(() => {
    const count = selectedCategories.length + (afterDate ? 1 : 0) + (beforeDate ? 1 : 0);
    setActiveFiltersCount(count);
  }, [selectedCategories, afterDate, beforeDate]);


  const handleRemoveSelectedCategory = (categoryToRemove) => {
    setSelectedCategories(selectedCategories.filter(cat => cat !== categoryToRemove));
  };

  const handleCategorySelect = (category) => {
    category = category.name
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setAfterDate('');
    setBeforeDate('');
  };

  const handleSearch = () => {
    // This is where you'll handle the search logic
    // Match the selected categories name and get their id from the categories

    const categoryIds = categories.filter(cat => selectedCategories.includes(cat.name)).map(cat => cat._id);
    const query = {
      title: searchValue,
      categories: categoryIds,
      page: 1,
      limit: 10,
      start: afterDate,
      end: beforeDate,
    }


    setSearchQuery(query);

    // If already on searchResultPage no need to navigate
    if (window.location.pathname === '/search') return;
    navigate('/search');

  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="flex items-center bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="flex-1 flex items-center px-4 py-3">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full text-gray-700 placeholder-gray-400 focus:outline-none text-base"
            />
          </div>
          
          {/* Filter Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`relative px-4 py-3 border-l border-gray-200 transition-colors ${
              isFilterOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Menu */}
      {isFilterOpen && (
        <div className="mt-4 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories Section */}
            <div className="mb-8">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Categories</h4>
              
              {/* Selected Categories as Chips */}
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedCategories.map((category) => (
                    <div key={category} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      <span>{category}</span>
                      <button
                        onClick={() => handleRemoveSelectedCategory(category)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Category Selection Dropdown */}
              <div className="relative mb-4">
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white flex items-center justify-between"
                >
                  <span className="text-gray-700">Select categories</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isCategoryDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {categories.length === 0 ? (
                      <div className="px-3 py-2 text-gray-500 text-sm">No categories available</div>
                    ) : (
                      categories.map((category) => (
                        <button
                          key={category._id}
                          onClick={() => {
                            handleCategorySelect(category);
                            setIsCategoryDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between ${
                            selectedCategories.includes(category.name) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                          }`}
                        >
                          <span>{category.name}</span>
                          {selectedCategories.includes(category) && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              
            </div>

            {/* Date Range Section */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Deadline Date Range</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-2">After Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={afterDate}
                      onChange={(e) => setAfterDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Before Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={beforeDate}
                      onChange={(e) => setBeforeDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleClearFilters}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Clear Filters
              </button>
                <Button className="flex-1"
                onClick={() => {
                  setIsFilterOpen(false);
                  handleSearch();
                }}
              >
                Apply Filters
              </Button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;