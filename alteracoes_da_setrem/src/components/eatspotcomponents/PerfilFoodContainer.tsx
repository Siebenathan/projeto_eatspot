import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import styles from "./PerfilFoodContainer.module.css";
import { useNavigate } from "react-router-dom";

interface PerfilFoodContainerProps {
  recipeName: string;
  imageFoodUrl: string;
  authorName: string;
  recipeUrl: string;
  likesAmount: number;
}

export default function PefilFoodContainer(props: PerfilFoodContainerProps) {
  const [stylePhoto, setStylePhoto] = useState<any>();
  const navigate = useNavigate();

  function onRecipeClick() {
    navigate(`/receita/${props.recipeUrl}`);
  }

  return (
    <div className={styles.mainContainer}>
      <img
        className={styles.imgFood}
        src={props.imageFoodUrl}
        alt="Imagem da receita"
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
          <p>Por <span className={styles.authorNameSpan}>{props.authorName}</span></p>
          <button
            className={styles.buttonToAcessRecipe}
            onClick={onRecipeClick}
          >
            Acessar
          </button>
        </div>
      </div>
    </div>
  );
}
