import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import styles from "./PerfilFoodContainer.module.css";

interface PerfilFoodContainerProps {
  recipeName: string;
  imageFoodUrl: string;
  authorName: string;
  likesAmount: number;
}

export default function PefilFoodContainer(props: PerfilFoodContainerProps) {
  const [stylePhoto, setStylePhoto] = useState<any>();


  function onRecipeClick() {
    
  }

  return (
    <div className={styles.mainContainer}>
      <img
        className={styles.imgFood}
        src={props.imageFoodUrl}
        alt="food image"
        style={stylePhoto}
      />
      <div
        onMouseEnter={() => setStylePhoto({ transform: "scale(1.05)" })}
        onMouseLeave={() => setStylePhoto({})}
        className={styles.divInsideImg}
      >
        <div className={styles.divInsideImgContent}>
          <h2 className={styles.titleOfTheRecipe}>{props.recipeName}</h2>
          <small>
            {props.likesAmount}
            <FaHeart className={styles.heartIcon} />
          </small>
          <p>Por {props.authorName}</p>
          <button className={styles.buttonToAcessRecipe} onClick={() => {
            //TODO
          }}>Acessar</button>
        </div>
      </div>
    </div>
  );
}
