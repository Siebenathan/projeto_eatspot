import { useState } from "react";
import styles from "./SearchInput.module.css";

interface SearchInputProps {
  placeholder: string;
  name: string;
}

export default function SearchInput(props: SearchInputProps) {
  const [search, setSearch] = useState<string>("");

  function handleSearchClick() {
    //TO DO
    console.log(search);
  }

  return (
    <div className={styles.searchContainer}>
      <input
        className={styles.searchingInput}
        type="text"
        placeholder={props.placeholder}
        id={props.name}
        name={props.name}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        className={styles.buttonSearch}
        onClick={handleSearchClick}
      ></button>
    </div>
  );
}
