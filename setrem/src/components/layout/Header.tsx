import styles from "./Header.module.css";
import logo from "../../img/EatSpot-semfundo.png";

export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <h1>
          Eat<span>Spot</span>
        </h1>
        <img src={logo} alt="logo" />
      </div>
    </header>
  );
}
