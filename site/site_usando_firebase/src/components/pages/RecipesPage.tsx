import { useParams } from "react-router-dom";
import styles from "./Recipes.module.css";
import { useState, useEffect } from "react";
import Container from "../layout/Container";
import { GiStalactites } from "react-icons/gi";

export default function RecipesPage() {
  const { categoria } = useParams();
  const recipesNames = [
    "Bolo de chocolate",
    "Pizza",
    "Hamburguer",
    "Churrasco",
    "Lasanha",
    "Salada de Frutas",
    "Feijão",
    "Arroz",
    "Ovo Frito com manteiga",
    "Frango empanado",
    "Ovo cozido",
  ];

  const recipeUrl = "https://source.unsplash.com/featured/400x350?food";

  useEffect(() => {
    console.log(categoria);
  });

  return (
    <Container
      customClass={"flexMiddleCol"}
      styleContainer={{
        padding: "50px 0px",
      }}
    >
      <h1 className={styles.recipesMainTitle}>Todas as receitas do EatSpot</h1>
      <h2 className={styles.recipesWithMostLikesTitle}>
        RECEITAS COM MAIS CURTIDAS
      </h2>
      <div className={styles.recipesMainDiv}>
        {recipesNames.map((recipe) => (
          <div className={styles.recipeDiv}>
            <div className={styles.recipePhotoDiv}>
              <img src={recipeUrl} alt="recipe photo" />
            </div>
            <h3 className={styles.recipeTitle}>{recipe}</h3>
            <p className={styles.recipeDescription}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
              tempora maiores, dolor mollitia quos tempore libero id eaque
              architecto ex itaque eius ab, voluptatum expedita nam porro rerum
              blanditiis quo. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempora, nobis aspernatur eum labore blanditiis ipsum, eos amet excepturi aperiam iure eveniet commodi quibusdam architecto? Illo ducimus necessitatibus possimus repellat illum.
            </p>
          </div>
        ))}
      </div>
    </Container>
  );
}
