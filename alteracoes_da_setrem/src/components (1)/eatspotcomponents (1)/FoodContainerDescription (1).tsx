import styles from "./FoodContainerDescription.module.css";
import { FaHeart } from "react-icons/fa";
import {useNavigate} from 'react-router-dom';
import { useEffect, useState } from "react";

interface FoodContainerDescriptionProps {
  recipeName: string;
  recipeDescription: string;
  recipeLikesAmount: string;
  recipeImageUrl: string;
  recipeId: string;
  recipeUrl: string;
}

export default function FoodContainerDescription(
  props: FoodContainerDescriptionProps
) {
  const [element, setElement] = useState<any>();
  const navigator = useNavigate();

  // useEffect(() => {
  //     const element = document.querySelector(`#${props.recipeId}`);
  //     const recipeDescription = element?.children[2];
  // }, [])

  return (
    <div className={styles.recipeDiv} id={props.recipeId}>
      <div className={styles.recipePhotoDiv}>
        <img
          src={props.recipeImageUrl}
          alt="recipe photo"
          onClick={() => {
            navigator(`/receita/${props.recipeUrl}`);
          }}
        />
      </div>
      <h3 className={styles.recipeTitle}>{props.recipeName}</h3>
      <p className={styles.recipeDescription}>{props.recipeDescription}</p>
      <p className={styles.recipeLikes}>
        <FaHeart className={styles.heartIcon} />
        {props.recipeLikesAmount}
      </p>
    </div>
  );
}
