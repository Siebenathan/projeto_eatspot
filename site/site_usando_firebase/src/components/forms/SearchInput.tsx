import { useState } from "react";
import styles from "./SearchInput.module.css";
import { useNavigate } from "react-router-dom";

interface SearchInputProps {
  placeholder: string;
  name: string;
}

export default function SearchInput(props: SearchInputProps) {
  const [search, setSearch] = useState<string>("");
  const navigate = useNavigate();

  function handleSubmit(e: any) {
    e.preventDefault();
    navigate(`/receitas/${search}`);
    document.location.reload();
  }

  return (
    <form onSubmit={handleSubmit} className={styles.searchContainer}>
      <input
        className={styles.searchingInput}
        type="text"
        placeholder={props.placeholder}
        id={props.name}
        required
        name={props.name}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button className={styles.buttonSearch} type="submit"></button>
    </form>
  );
}
