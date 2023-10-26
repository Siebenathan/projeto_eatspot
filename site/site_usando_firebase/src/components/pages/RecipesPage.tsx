import { useParams } from "react-router-dom";
import styles from "./Recipes.module.css";
import { useState, useEffect } from "react";
import Container from "../layout/Container";
import FoodContainerDescription from "../eatspotcomponents/FoodContainerDescription";

export default function RecipesPage() {
  const loremIpsum =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis aspernatur blanditiis facere odio saepe eius placeat, obcaecati esse maxime, alias est, ipsa iusto dignissimos totam dolore cum dolorem adipisci quidem.";

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
          <div key={recipe}>
            <FoodContainerDescription
              recipeDescription={loremIpsum}
              recipeName={recipe}
              recipeLikesAmount="300"
              recipeUrl="aaa"
              recipeId={recipe}
              key={recipe}
            />
          </div>
        ))}
      </div>
    </Container>
  );
}
