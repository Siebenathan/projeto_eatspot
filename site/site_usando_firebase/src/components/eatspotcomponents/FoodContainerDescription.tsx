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
  const [element, setElement] = useState<any>();
  const recipeUrl = "https://source.unsplash.com/featured/400x350?food";

    useEffect(() => {
        const element = document.querySelector(`#${props.recipeId}`);
        const recipeDescription = element?.children[2];
        console.log(recipeDescription?.clientHeight);
    }, [])


  return (
    <div className={styles.recipeDiv} id={props.recipeId}>
      <div className={styles.recipePhotoDiv}>
        <img src={recipeUrl} alt="recipe photo" onClick={() => {
        //TODO:
        }}/>
      </div>
      <h3 className={styles.recipeTitle}>{props.recipeName}</h3>
      <p className={styles.recipeDescription}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta tempora
        maiores, dolor mollitia quos tempore libero id eaque architecto ex
        itaque eius ab, voluptatum expedita nam porro rerum blanditiis quo.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempora, nobis
        aspernatur eum labore blanditiis ipsum, eos amet excepturi aperiam iure
        eveniet commodi quibusdam architecto? Illo ducimus necessitatibus
        possimus repellat illum.
      </p>
      <p className={styles.recipeLikes}>
        <FaHeart className={styles.heartIcon} />
        300
      </p>
    </div>
  );
}
