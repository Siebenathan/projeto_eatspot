import styles from "./Header.module.css";
import logo from "../../img/EatSpot-semfundo.png";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <h1>
          Eat<span>Spot</span>
        </h1>
        <img
          src={logo}
          alt="logo"
          onClick={() => {
            navigate("/");
          }}
        />
      </div>
    </header>
  );
}
