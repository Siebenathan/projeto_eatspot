import styles from "./FoodContainerDescription.module.css";
import { FaHeart } from "react-icons/fa";
import { useEffect, useState } from "react";

interface FoodContainerDescriptionProps {
  recipeName: string;
  recipeDescription: string;
  recipeLikesAmount: string;
  recipeUrl: string;
  recipeId: string;
}

export default function FoodContainerDescription(
  props: FoodContainerDescriptionProps
) {
  const [element, setElement] = useState<{ width: any; height: any }>();
  const [descriptionArea, setDescriptionArea] = useState<any>();
  const recipeUrl = "https://source.unsplash.com/featured/400x350?food";

  useEffect(() => {
    const element = document.querySelector(`#${props.recipeId}`);
    const recipeDescription = element?.children[2];
    setDescriptionArea({
      width: recipeDescription?.clientWidth,
      height: recipeDescription?.clientHeight,
    });
  }, []);

  return (
    <div
      className={styles.recipeDiv}
      id={props.recipeId}
      onResize={() => console.log("tamanho alterado")}
    >
      <div className={styles.recipePhotoDiv}>
        <img
          src={recipeUrl}
          alt="recipe photo"
          onClick={() => {
            //TODO:
          }}
        />
      </div>
      <h3 className={styles.recipeTitle}>{props.recipeName}</h3>
      <p className={styles.recipeDescription}>{props.recipeDescription}</p>
      <p className={styles.recipeLikes}>
        <FaHeart className={styles.heartIcon} />
        300
      </p>
    </div>
  );
}
