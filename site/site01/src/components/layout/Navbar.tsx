import styles from './Navbar.module.css';
import {Link} from 'react-router-dom';
import logo from '../../img/EatSpot_semfundo-80px.png';
import userIcon from '../../img/icones/icons8-cozinheiro-80-verde.png';

export default function NavBar() {
    return (
        <nav className={styles.navContainer}>
            <div className={styles.titleContainer}>
                <img src={logo} alt="logo" />
                <h1 className={styles.titleContainerTitle}>Eat<span>Spot</span></h1>
            </div>
            <ul className={styles.navigationList}>
                <li><Link className={styles.navigationListItem}to='/'>Home</Link></li>
                <li><Link className={styles.navigationListItem} to='/receitas'>Receitas</Link></li>
                <li><Link className={styles.navigationListItem}to='/noticias'>Notícias</Link></li>
            </ul>
            <div className={styles.userContainer}>
                <img src={userIcon} alt="user icon" />
                <p>Usuario </p>
                <button className={styles.dropDownIcon}></button>
            </div>
        </nav>
    );
}