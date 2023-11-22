import styles from "./LoginPageTest.module.css";
import eatSpotLogo from "../../img/EatSpot-semfundo.png";

export default function LoginPageTest() {
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
        </div>
      </div>
      <div className={styles.mainDivLeft}></div>
      <div className={styles.mainDivRight}></div>
    </div>
  );
}
