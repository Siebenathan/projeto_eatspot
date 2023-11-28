import styles from "./LoginPageTest.module.css";
import eatSpotLogo from "../../img/EatSpot-semfundo.png";
import { FcGoogle } from "react-icons/fc";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import LinkWithUnderline from "../forms/LinkWithUnderline";
import InputWithLabelInside from "../forms/inputs/InputWithLabelInside";
import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { signIn } from "../services/firebase/firebaseAuth";
import { auth } from "../services/firebase/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import ButtonSlide from "../forms/buttons/ButtonSlide";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDataFromCollection } from "../services/firebase/firebaseFirestore";

export default function LoginPageTest() {
  const location = useLocation();
  const message = location.state?.message;
  const messageType = location.state?.type;
  const [value, setValue] = useLocalStorage("userId", "");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  async function verifyUserInFirestore(userUid: string) {
    const result = await getDataFromCollection("users", "userId", userUid);
    if (result.empty) {
      return "Não criou a conta ainda!";
    } else {
      return "Já tem conta criada!";
    }
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    const userUid = await signIn(password, email);
    if (userUid == "erro") {
      alert("erro");
      return;
    }
    setValue(userUid.user.uid);
    const timeout = setTimeout(() => {
      navigate("/perfil/meuperfil");
      clearTimeout(timeout);
    }, 100);
  }

  async function handleGoogleSignIn() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const userHasAcc = await verifyUserInFirestore(result.user.uid);
    if (userHasAcc == "Não criou a conta ainda!") {
      navigate("/criar-conta", {
        state: {
          message: "Google SignIn",
          username: result.user.displayName,
          userUid: result.user.uid,
        },
      });
    } else if ("Já tem conta criada!") {
      setValue(result.user.uid);
      const timeout = setTimeout(() => {
        navigate("/perfil/meuperfil");
        clearTimeout(timeout);
      }, 100);
    }
  }

  return (
    <div className={styles.mainDiv}>
      <div className={styles.loginMainDiv}>
        <div className={styles.leftLoginDiv}>
          <img src={eatSpotLogo} alt="" />
          <h1>
            <span>Eat</span>Spot
          </h1>
        </div>
        <div className={styles.rightLoginDiv}>
          <div className={styles.topRightLoginLogo}>
            <img src={eatSpotLogo} alt="" />
            <h1>
              <span>Eat</span>Spot
            </h1>
          </div>
          <div className={styles.divGreetings}>
            <h1>Seja bem vindo</h1>
            <p>Estamos felizes de ver você de volta</p>
          </div>
          <form onSubmit={handleSubmit}>
            <InputWithLabelInside
              labelText="Email"
              nameAndId="email"
              type="email"
              value={email}
              required
              setValue={setEmail}
            />
            <InputWithLabelInside
              labelText="Senha"
              nameAndId="password"
              type="password"
              required
              value={password}
              setValue={setPassword}
              lockIconForPassword
            />
            <ButtonSlide
              type="submit"
              buttonText="Login"
              nameAndId="Login"
              beforeColor="greenColor"
              slideDirection="leftDirection"
            />
          </form>
          <div className={styles.divButtonsServicesLogin}>
            <p>Entrar com:</p>
            <div className={styles.servicesIconsDiv}>
              <button
                onClick={() => {
                  handleGoogleSignIn();
                }}
              >
                <FcGoogle className={styles.googleIcon} />
              </button>
              <button>
                <FaSquareFacebook className={styles.facebookIcon} />
              </button>
              <button>
                <FaSquareXTwitter className={styles.twitterXIcon} />
              </button>
            </div>
          </div>
          <ul className={styles.divBottomLoginLiks}>
            <li>
              <LinkWithUnderline
                underlineColor="colorBlue"
                linkText="Esqueci minha senha"
                to="/trocar-senha"
              />
            </li>
            <li>
              <LinkWithUnderline
                underlineColor="colorBlue"
                linkText="Não tenho conta"
                to="/criar-conta"
                linkStyle={{ fontSize: "1em" }}
              />
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.mainDivLeft}></div>
      <div className={styles.mainDivRight}></div>
    </div>
  );
}
