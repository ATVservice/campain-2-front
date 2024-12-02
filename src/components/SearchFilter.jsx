import React, { useState, useMemo , useEffect} from 'react';



function SearchFilter({ data, columns, onFilter,placeholder }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter((item) => 
      columns.some((column) => {
        const value = item[column];
        return value && 
               value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  const handleChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  };

  // Optional: Only update when search term changes
  useEffect(() => {
    onFilter(filteredData);
  }, [searchTerm]);

  return (
    <input
      type="text"
      placeholder={placeholder}
      className="w-full px-4 py-2 border rounded mb-4 outline-none"
      onChange={handleChange}
      value={searchTerm}
    />
  );
}

export default SearchFilter;