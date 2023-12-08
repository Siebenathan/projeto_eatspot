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
import { getDataFromCollection, setDocAlreadyCreated } from "../services/firebase/firebaseFirestore";

export default function LoginPageTest() {
  const location = useLocation();
  const message = location.state?.message;
  const messageType = location.state?.type;
  const [value, setValue] = useLocalStorage("userId", "");
  const [email, setEmail] = useState<string>("");
  const [logingWithOAuth, setLogingWithOAuth] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  async function verifyUserInFirestore(userUid: string) {
    const result = await getDataFromCollection("users", "userId", userUid);

    if (!result.empty) {
      return result;
    } else {
      return "Não tem conta criada!";
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
    if (!logingWithOAuth) {
      const loginType = "Google SignIn"
      setLogingWithOAuth(true);
      const provider = new GoogleAuthProvider();
      let result: any = undefined;
      try {
        result = await signInWithPopup(auth, provider);
      } catch(err) {
        setLogingWithOAuth(false);
        return;
      }
      
      const userHasAcc = await verifyUserInFirestore(result.user.uid);
      if (userHasAcc == "Não tem conta criada!") {
        navigate("/criar-conta", {
          state: {
            message: loginType,
            username: result.user.displayName,
            userUid: result.user.uid,
            email: result.user.email,
          },
        });
      } else if ("Já tem conta criada!") {
        const user: any = userHasAcc.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))[0];
        
        let alreadyHaveType = false;
        user.registerType.forEach((type: string) => {
          if(type == loginType) {
            alreadyHaveType = true;
            return;
          }
        })

        if(!alreadyHaveType) {
          user.registerType.push(loginType);
          await setDocAlreadyCreated("users", userHasAcc.docs[0].id, user);
        }

        setValue(result.user.uid);
        const timeout = setTimeout(() => {
          navigate("/perfil/meuperfil");
          clearTimeout(timeout);
        }, 100);
      }
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


        // const user: any = userHasAcc.docs.map((doc) => ({
        //   ...doc.data(),
        //   id: doc.id,
        // }))[0];

        // user.registerType.push(loginType);


        // console.log(result);