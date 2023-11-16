import { useParams, NavLink, useNavigate } from "react-router-dom";
import styles from "./Recipes.module.css";
import { useState, useEffect } from "react";
import Container from "../layout/Container";
import FoodContainerDescription from "../eatspotcomponents/FoodContainerDescription";
import {
  getDataWithOrderLimitAndStartAfter,
  getDataWithWhereOrderLimitAndStartAfter,
  getDocsUsingLikeInAField,
} from "../services/firebase/firebaseFirestore";
import { getImageStorage } from "../services/firebase/firebaseStorage";
import BigSearchContainer from "./../eatspotcomponents/searchRecipes/BigSearchContainer";
import InviteToAction from "../eatspotcomponents/InviteToAction";

export default function RecipesPage() {
  const [latestDoc, setLatestDoc] = useState<any>();
  const [recipesData, setRecipesData] = useState<any>([]);
  const [getNewRecipes, setGetNewRecipes] = useState<boolean>(false);
  const [stillHaveRecipes, setStillHaveRecipes] = useState<boolean>(true);
  const navigator = useNavigate();

  const loremIpsum =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis aspernatur blanditiis facere odio saepe eius placeat, obcaecati esse maxime, alias est, ipsa iusto dignissimos totam dolore cum dolorem adipisci quidem.";

  let { categoria, nomeReceita } = useParams();

  useEffect(() => {
    console.log(categoria, nomeReceita);
    if (nomeReceita) {
      nomeReceita = nomeReceita.toLowerCase();
      getRecipesWithName(nomeReceita);
      return;
    }
    getRecipesWithMostLikes();
  }, []);

  useEffect(() => {
    if (getNewRecipes && latestDoc) {
      if(nomeReceita) {
        getRecipesWithName(nomeReceita);
        return;
      }
      getRecipesWithMostLikes();
    }
  }, [getNewRecipes]);

  async function getRecipesWithName(nomeDaReceita: string) {
    let recipesData: any = undefined;
    let recipesDataFirestore: any = undefined;
    if (!latestDoc) {
      recipesDataFirestore = await getDocsUsingLikeInAField(
        "recipes",
        4,
        "recipeTitle",
        nomeDaReceita,
      );
      recipesData = recipesDataFirestore.docs.map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
      }));
    } else {
      recipesDataFirestore = await getDocsUsingLikeInAField(
        "recipes",
        4,
        "recipeTitle",
        nomeDaReceita,
        latestDoc
      );
      recipesData = recipesDataFirestore.docs.map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
      }));
    }

    getRecipeImages(recipesData);
    setLatestDoc(
      recipesDataFirestore.docs[recipesDataFirestore.docs.length - 1]
    );
    console.log(
      recipesDataFirestore.docs[recipesDataFirestore.docs.length - 1]
    );
  }

  async function getRecipesWithCategory() { }

  async function getRecipesWithMostLikes() {
    let recipesData: any = undefined;
    let recipesDataFirestore: any = undefined;
    if (latestDoc) {
      recipesDataFirestore = await getDataWithOrderLimitAndStartAfter(
        "recipes",
        10,
        "likes",
        "desc",
        latestDoc
      );
      recipesData = recipesDataFirestore.docs.map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
      }));
    } else {
      recipesDataFirestore = await getDataWithOrderLimitAndStartAfter(
        "recipes",
        10,
        "likes",
        "desc"
      );
      recipesData = recipesDataFirestore.docs.map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
      }));
    }

    getRecipeImages(recipesData);
    setLatestDoc(
      recipesDataFirestore.docs[recipesDataFirestore.docs.length - 1]
    );
    console.log(
      recipesDataFirestore.docs[recipesDataFirestore.docs.length - 1]
    );
  }

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

  function capitalizeString(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <main>
      <BigSearchContainer />
      <Container
        customClass={"flexMiddleCol"}
        styleContainer={{
          padding: "50px 0px",
        }}
      >
        <h1 className={styles.recipesMainTitle}>
          Todas as receitas do EatSpot
        </h1>
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
                  recipeName={capitalizeString(recipe.recipeTitle)}
                  recipeLikesAmount={recipe.likes}
                  recipeImageUrl={recipe.imagePath}
                  recipeId={recipe.id}
                  key={recipe.id}
                />
              </div>
            ))}
        </div>
        {stillHaveRecipes && (
          <div className={styles.divButtonBringNewRecipes}>
            <button
              onClick={() => {
                setGetNewRecipes(true);
              }}
            >
              Carregar mais receitas
            </button>
          </div>
        )}
      </Container>
    </main>
  );
}
