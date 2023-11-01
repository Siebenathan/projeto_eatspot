import { useParams, NavLink, useNavigate } from "react-router-dom";
import styles from "./Recipes.module.css";
import { useState, useEffect } from "react";
import Container from "../layout/Container";
import FoodContainerDescription from "../eatspotcomponents/FoodContainerDescription";
import { getDataWithOrderLimitAndStartAfter } from "../services/firebase/firebaseFirestore";
import { getImageStorage } from "../services/firebase/firebaseStorage";

export default function RecipesPage() {
  const [latestDoc, setLatestDoc] = useState<any>();
  const [recipesData, setRecipesData] = useState<any>([]);
  const [getNewRecipes, setGetNewRecipes] = useState<boolean>(false);
  const navigator = useNavigate();

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
  ];

  useEffect(() => {
    console.log("aaa");
    getDataWithOrderLimitAndStartAfter("recipes", 10, "likes", "desc").then(
      async (data: any) => {
        const recipeData = data.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }));
        getRecipeImages(recipeData);
        setLatestDoc(data.docs[data.docs.length - 1]);
        console.log(data.docs[data.docs.length - 1]);
      }
    );
  }, []);

  useEffect(() => {
    if (getNewRecipes && latestDoc) {
      console.log("caiu aqui");
      getDataWithOrderLimitAndStartAfter(
        "recipes",
        10,
        "likes",
        "desc",
        latestDoc
      ).then(async (newRecipes: any) => {
        const recipeData = newRecipes.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(newRecipes);
        getRecipeImages(recipeData);
        setLatestDoc(newRecipes.docs[newRecipes.docs.length - 1]);
        setGetNewRecipes(false);
      });
    }
  }, [getNewRecipes]);

  async function getRecipeImages(arrayOfRecipes?: any) {
    for (let i = 0; i < arrayOfRecipes.length; i++) {
      const url = await getImageStorage(arrayOfRecipes[i].imagePath);
      arrayOfRecipes[i].imagePath = url;
      if (recipesData) {
        setRecipesData([...recipesData, ...arrayOfRecipes]);
      } else {
        setRecipesData([...arrayOfRecipes]);
      }
    }
  }

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
        {recipesData &&
          recipesData.map((recipe: any) => (
            <div key={recipe.id}>
              <FoodContainerDescription
                recipeUrl={recipe.recipeUrl}
                recipeDescription={recipe.recipeDescription}
                recipeName={recipe.recipeTitle}
                recipeLikesAmount={recipe.likes}
                recipeImageUrl={recipe.imagePath}
                recipeId={recipe.id}
                key={recipe.id}
              />
            </div>
          ))}
      </div>
      <div className={styles.divButtonBringNewRecipes}>
        <button
          onClick={() => {
            setGetNewRecipes(true);
          }}
        >
          Carregar mais receitas
        </button>
      </div>
    </Container>
  );
}
