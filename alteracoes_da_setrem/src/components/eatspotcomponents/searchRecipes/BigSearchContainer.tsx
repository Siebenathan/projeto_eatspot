import styles from "./BigSearchContainer.module.css";
import SearchInput from "../../forms/SearchInput";

export default function BigSearchContainer() {
  return (
    <div className={styles.heroContainer}>
    <h1>O que deseja cozinhar hoje?</h1>
    <SearchInput
      placeholder="Pesquise alguma receita..."
      name="searchinput"
      iconSearchStyle={{fontSize: "3em"}}
    />
  </div>
  );
}
