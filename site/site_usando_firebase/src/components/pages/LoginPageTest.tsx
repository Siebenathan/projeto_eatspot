import styles from "./LoginPageTest.module.css";
import eatSpotLogo from "../../img/EatSpot-semfundo.png";
import InputWithIcon from "../forms/InputWithIcon";
import { IoMail } from "react-icons/io5";
import { IoIosLock } from "react-icons/io";
import Button from "../forms/Button";
import { FcGoogle } from "react-icons/fc";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import LinkWithUnderline from "../forms/LinkWithUnderline";
import InputWithLabelInside from "../forms/InputWithLabelInside";

export default function LoginPageTest() {
  function handleFormSubmit(e: any) {
    e.preventDefault();
    //TODO:
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
          <form onSubmit={handleFormSubmit}>
            <InputWithLabelInside labelText="Email" nameAndId="email" type="email" />
            <Button
              buttonText="Login"
              type="submit"
              style={{
                color: "white",
                backgroundColor: "var(--cor3)",
                fontSize: "1.5em",
                height: "50%",
                boxShadow: "#00000057 1px 1px 11px",
              }}
            />
          </form>
          <div className={styles.divButtonsServicesLogin}>
            <p>Entrar com:</p>
            <div className={styles.servicesIconsDiv}>
              <button>
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
            <LinkWithUnderline linkText="Esqueceu sua senha?" to="/trocar-senha"/>
        </div>
      </div>
      <div className={styles.mainDivLeft}></div>
      <div className={styles.mainDivRight}></div>
    </div>
  );
}

{/* <InputWithIcon
icon={<IoMail className={styles.mailIcon} />}
name="email"
type="email"
placeholderText="Digite seu email..."
/>
<InputWithIcon
icon={<IoIosLock className={styles.mailIcon} />}
name="password"
type="password"
placeholderText="Digite sua senha..."
/> */}