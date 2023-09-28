import styles from "./Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../img/EatSpot_semfundo-80px.png";
import { FaUserSlash, FaUserCheck } from "react-icons/fa";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import useLocalStorage from "../hooks/useLocalStorage";
import { GetUserAuth, singOut } from "../services/firebase/firebaseAuth";
import { useState } from "react";

export default function NavBar() {
  const [userId, setUserId] = useLocalStorage("userId", "");
  const user = GetUserAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState<boolean>(false);

  return (
    <nav className={styles.navContainer}>
      <div className={styles.titleContainer}>
        <img src={logo} alt="logo" />
        <h1 className={styles.titleContainerTitle}>
          Eat<span>Spot</span>
        </h1>
      </div>
      <ul className={styles.navigationList}>
        <li>
          <Link className={styles.navigationListItem} to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className={styles.navigationListItem} to="/receitas">
            Receitas
          </Link>
        </li>
        <li>
          <Link className={styles.navigationListItem} to="/noticias">
            Notícias
          </Link>
        </li>
      </ul>
      <div className={styles.userContainer}>
        {user == null ? (
          <div className={styles.mainContainerDropDown} onClick={() => {navigate("/login")}}>
            <FaUserSlash className={styles.userIcon} />
            <span className={styles.dropDownSpan}>Usuário</span>
          </div>
          
        ) : (
          <div
          className={styles.mainContainerDropDown}
          onClick={() => {
            setActive(!active);
          }}
        >
          <FaUserCheck className={styles.userIcon} />
          <span className={styles.dropDownSpan}>Usuário</span>
          <button className={styles.buttonDropDown}>
            <BsFillArrowDownCircleFill className={styles.dropDownIcon} />
          </button>
          {active && (
            <ul className={styles.dropDownOptions}>
              <li onClick={() => navigate("/perfil")}>Perfil</li>
              <li onClick={() => {singOut()}}>Logout</li>
            </ul>
          )}
        </div>
        )}
      </div>
    </nav>
  );
}
