import styles from "./BigFoodContainer.module.css";
import { FaHeart } from "react-icons/fa";
import userIcon from "../../img/icones/icons8-cozinheiro-80.png";

interface BigFoodContainerProps {
  imageUrl: string;
  recipeName: string;
  authorName: string;
  likesAmount: number;
}

export default function BigFoodContainer(props: BigFoodContainerProps) {
  return (
    <div className={styles.bigFoodContainer}>
      <div className={styles.imgContainer}>
        <div>
          <img src={userIcon} alt="usericon" />
        </div>
        <img
          className={styles.bigFoodContainerImg}
          src={props.imageUrl}
          alt="food image"
        />
      </div>
      <h3 className={styles.titleRecipe}>{props.recipeName}</h3>
      <p className={styles.authorName}>
        Por <span>{props.authorName}</span>
      </p>
      <p>
        <FaHeart className={styles.heartIcon} />
        {props.likesAmount}
      </p>
    </div>
  );
}
