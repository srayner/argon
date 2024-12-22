import styles from "./searchInput.module.css";

const SearchInput = ({ handleSearchChange }) => {
  return (
    <>
      <label className={styles.searchLabel}>Search</label>
      <input
        className={styles.searchInput}
        type="text"
        onChange={handleSearchChange}
      />
    </>
  );
};

export default SearchInput;
