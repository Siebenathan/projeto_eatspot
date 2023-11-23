import styles from "./LoginPageTest.module.css";
import eatSpotLogo from "../../img/EatSpot-semfundo.png";
import InputWithIcon from "../forms/InputWithIcon";
import { IoMail } from "react-icons/io5";
import { IoIosLock } from "react-icons/io";
import Button from "../forms/Button";

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
          <h1><span>Eat</span>Spot</h1>
        </div>
        <div className={styles.rightLoginDiv}>
          <h1>Seja bem vindo</h1>
          <p>Estamos felizes de ver você de volta</p>
          <form onSubmit={handleFormSubmit}>
          <InputWithIcon icon={<IoMail className={styles.mailIcon}/>} name="email" type="email" />
          <InputWithIcon icon={<IoIosLock className={styles.mailIcon}/>} name="password" type="password" />
          <Button type="submit"/>
          </form>
          
        </div>
      </div>
      <div className={styles.mainDivLeft}></div>
      <div className={styles.mainDivRight}></div>
    </div>
  );
}
