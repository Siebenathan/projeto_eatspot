import styles from './Footer.module.css';
import logo from '../../img/EatSpot-semfundo.png';

export default function Footer() {
    return(
        <footer className={styles.footerContainer}>
            <h1 className={styles.footerLogoText}>Eat<span>Spot</span></h1>
            <img className={styles.footerLogo} src={logo} alt="logo" />
            <ul className={styles.footerContactList}>
                <li>Contato</li>
                <li>Quem Somos</li>
                <li>Anuncie</li>
            </ul>
        </footer>
    );
}