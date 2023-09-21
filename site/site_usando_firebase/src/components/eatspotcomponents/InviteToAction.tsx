import styles from "./InviteToAction.module.css";
import logo from "../../img/EatSpot-semfundo.png";
import {Link} from 'react-router-dom';

export default function InviteToAction() {
  return (
    <section className={styles.inviteToActionContainer}>
      <div>
          <div className={styles.imgLogoContainer}>
            <img src={logo} alt="logo" />
            <h2 className={styles.inviteToActionTitle}>
            Crie sua receita <span>você</span> também
          </h2>
          </div>
          <p className={styles.InviteToActionText}>
            Na plataforma EatSpot, permitimos os usuários postarem e divulgarem suas
            receitas para fazer isso basta criar sua conta.
          </p>
          <Link className={styles.InviteToActionBtn} to="/criar-conta">
            Crie sua conta agora mesmo!
          </Link>
      </div>
    </section>
  );
}
