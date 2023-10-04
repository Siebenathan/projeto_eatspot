import styles from './SmallFoodContainer.module.css';
import {FaHeart} from 'react-icons/fa';

interface SmallFoodContainerProps {
    imageUrl: string;
    recipeName: string;
    authorName: string;
    likesAmount: number;
}

export default function SmallFoodContainer(props: SmallFoodContainerProps) {
  return (
    <div className={styles.smallFoodContainer}>
      <img className={styles.imgFoodContainer} src={props.imageUrl} alt="food image" />
      <p className={styles.authorName}>Por <span>{props.authorName}</span></p>
      <p><FaHeart className={styles.iconHeart}/>{props.likesAmount}</p>
    </div>
  );
}
