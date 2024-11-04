import React from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from './SearchBar.module.scss';

const SearchBar = ({ onSearch, placeholder = "搜尋教師..." }) => {
  const handleSearch = (event) => {
    event.preventDefault();
    const searchValue = event.target.elements.search.value;
    onSearch(searchValue);
  };

  return (
    <form onSubmit={handleSearch} className={styles.searchBar}>
      <input
        type="search"
        name="search"
        placeholder={placeholder}
        className={styles.formControl}
      />
      <button type="submit" className={styles.btnCustom}>
        <FaSearch className={styles.searchIcon} />
      </button>
    </form>
  );
};

export default SearchBar;
