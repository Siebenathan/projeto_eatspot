import styles from "./Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../img/EatSpot_semfundo-80px.png";
import { FaUserSlash, FaUserCheck } from "react-icons/fa";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import useLocalStorage from "../hooks/useLocalStorage";
import { auth } from "../services/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import SearchInput from "../forms/SearchInput";
import { signOutUser } from "../services/firebase/firebaseAuth";
import LinkWithUnderline from "../forms/LinkWithUnderline";

export default function NavBar() {
  const [userId, setUserId] = useLocalStorage("userId", "");
  const [isUserLogged, setIsUserLogged] = useState<boolean>(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user?.uid === userId) {
        setIsUserLogged(true);
      } else {
        setIsUserLogged(false);
      }
    });
  }, []);

  const navigate = useNavigate();
  const [active, setActive] = useState<boolean>(false);

  return (
    <nav className={styles.navContainer}>
      <Link className={styles.titleContainer} to="/">
        <img src={logo} alt="logo" />
        <h1 className={styles.titleContainerTitle}>
          Eat<span>Spot</span>
        </h1>
      </Link>
      <SearchInput
        placeholder={"Pesquise alguma receita..."}
        name={"searchInput"}
        formStyle={{ minHeight: "65%", width: "50%", fontSize: "0.5em" }}
      />
      <div className={styles.userContainer}>
        {isUserLogged === false ? (
          <div
            className={styles.mainContainerDropDown}
            onClick={() => {
              navigate("/login");
            }}
          >
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
                <li>
                  <LinkWithUnderline
                    to="/perfil/meuperfil"
                    linkText="Perfil"
                    underlineColor="colorBlue"
                  />
                </li>
                <li>
                  <LinkWithUnderline
                    to="/configuracao-de-conta"
                    linkText="Configurações"
                    underlineColor="colorBlue"
                    navigationState={{userId: userId}}
                  />
                </li>
                <li
                  onClick={() => {
                    localStorage.removeItem("userId");
                    signOutUser();
                  }}
                >
                  Logout
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

{
  /* <ul className={styles.navigationList}>
<li>
  <Link reloadDocument className={styles.navigationListItem} to="/">
    Home
  </Link>
</li>
<li>
  <Link
    reloadDocument
    className={styles.navigationListItem}
    to="/receitas"
  >
    Receitas
  </Link>
</li>
<li>
  <Link
    reloadDocument
    className={styles.navigationListItem}
    to="/noticias"
  >
    Notícias
  </Link>
</li>
</ul> */
}

{
  /* <li onClick={() => navigate("/perfil/meuperfil")}>Perfil</li>
<li>Configurações</li>
<li
  onClick={() => {
    localStorage.removeItem("userId");
    signOutUser();
  }}
>
  Logout
</li> */
}
