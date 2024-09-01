import { useEffect, useState, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { fetchBrands, fetchCategories, fetchSubCategories } from "../utils/categoryApi";
import baseUrl from "./services/baseUrl";

const FilterDropdown = ({ setProducts }) => {
    const [filters, setFilters] = useState({ brand: '', category: '', subcategory: '', search: '' });
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [filteredBrands, setFilteredBrands] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownRef = useRef(null);
    useEffect(() => {
        fetchProducts();
    }, [filters]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesData = await fetchCategories();
                setCategories(categoriesData);
                setFilteredCategories(categoriesData);

                const brandsData = await fetchBrands();
                setBrands(brandsData);
                setFilteredBrands(brandsData);

                const subCategoriesData = await fetchSubCategories();
                setSubCategories(Array.isArray(subCategoriesData) ? subCategoriesData : []);
                setFilteredSubCategories(Array.isArray(subCategoriesData) ? subCategoriesData : []);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const debounce = (func, delay) => {
        let debounceTimer;
        return (...args) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func(...args), delay);
        };
    };

    const handleSearch = debounce((searchTerm, type) => {
        if (type === 'Brand') {
            setFilteredBrands(brands.filter(brand => brand.name.toLowerCase().includes(searchTerm.toLowerCase())));
        } else if (type === 'Category') {
            setFilteredCategories(categories.filter(category => category.name.toLowerCase().includes(searchTerm.toLowerCase())));
        } else if (type === 'Subcategory') {
            setFilteredSubCategories(subCategories.filter(subCategory => subCategory.name.toLowerCase().includes(searchTerm.toLowerCase())));
        }
    }, 300);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
        if (name === 'search') {
            handleSearch(value, openDropdown);
        }
    };

    const handleFilterSelect = (type, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [type.toLowerCase()]: value
        }));
        setOpenDropdown(null);
    };

    const handleClearSelection = (type, e) => {
        e.stopPropagation(); // Prevent dropdown from toggling
        setFilters(prevFilters => ({
            ...prevFilters,
            [type.toLowerCase()]: ''
        }));
        setOpenDropdown(type); // Keep the dropdown open
    };
    const fetchProducts = async () => {
        let query = new URLSearchParams(filters).toString();
        const response = await fetch(`${baseUrl}/api/products/products-for-pos?${query}`);
        const data = await response.json();
        setProducts(data);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className="grid grid-cols-2 gap-3 w-full">
                {['Brand', 'Category', 'Subcategory'].map((filter, idx) => (
                    <div key={idx} className="relative ">
                        <div
                            className="border border-gray-300 bg-white rounded-md p-2 flex justify-between items-center cursor-pointer h-12"
                            onClick={() => {
                                if (openDropdown === filter) {
                                    setOpenDropdown(null);
                                } else {
                                    setOpenDropdown(filter);
                                }
                            }}
                        >
                            <span className="flex-grow uppercase">
                                {filters[filter.toLowerCase()] || `${filter.toLowerCase()}`}
                            </span>
                            {filters[filter.toLowerCase()] && (
                                <button
                                    className="mr-3 text-gray-600 hover:text-red-600"
                                    onClick={(e) => handleClearSelection(filter, e)}
                                >
                                    &times;
                                </button>
                            )}
                            <IoIosArrowDown
                                className={`w-4 h-4 transition-transform ${openDropdown === filter ? "rotate-180" : ""}`}
                            />
                        </div>
                        {openDropdown === filter && (
                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md max-h-40 overflow-y-auto shadow-lg">
                                <input
                                    type="text"
                                    placeholder={`Search ${filter.toLowerCase()}...`}
                                    className="p-2 w-full border-b border-gray-300"
                                    name="search"
                                    value={filters.search || ""}
                                    onChange={(e) => handleFilterChange(e)}
                                />
                                {(filter === 'Brand' ? filteredBrands : filter === 'Category' ? filteredCategories : filteredSubCategories).length > 0 ? (
                                    (filter === 'Brand' ? filteredBrands : filter === 'Category' ? filteredCategories : filteredSubCategories).map((item) => (
                                        <div
                                            key={item._id || item}
                                            className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer"
                                            onClick={() => handleFilterSelect(filter, item.name)}
                                        >
                                            {item.name}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-2 text-gray-600">No results found</div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                <input
                    type="text"
                    placeholder="Enter Product name / SKU"
                    className="input input-bordered w-full  h-12"
                    name="search"
                    value={filters.search || ""}
                    onChange={handleFilterChange}
                />
            </div>
        </div>
    );
};

export default FilterDropdown;
