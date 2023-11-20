import Container from "../layout/Container";
import styles from "./RecipePage.module.css";
import { FaRegClock, FaHeart } from "react-icons/fa";
import Comment from "../eatspotcomponents/comments/Comment";
import { useEffect, useState } from "react";
import { getDataFromCollection } from "../services/firebase/firebaseFirestore";
import { useParams } from "react-router-dom";
import Loading from "../layout/Loading";
import { TbChefHat } from "react-icons/tb";
import { TbMoneybag } from "react-icons/tb";
import { getImageStorage } from "../services/firebase/firebaseStorage";

export default function RecipePage() {
  const [recipeData, setRecipeData] = useState<any>();
  const [recipeImage, setRecipeImage] = useState<any>();
  const [amountOfTime, setAmountOfTime] = useState<any>();
  const { recipeUrl } = useParams();

  const urlFood = "https://source.unsplash.com/featured/800x600?food";
  const urlUser = "https://source.unsplash.com/featured/100x100?person";
  const listaDeIngredientes = ["Farinha", "Fermento", "Cobertura", "Açucar"];
  let key = 0;
  const loremIpsum =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex optio, architecto deleniti quas officiis pariatur aperiam, excepturi amet molestiae aut harum ipsa porro tempora libero quae modi cum illo voluptatibus!";

  useEffect(() => {
    if (!recipeData) {
      getDataFromCollection(
        "recipes",
        "recipeUrl",
        recipeUrl ? recipeUrl : ""
      ).then(async (data) => {
        let recipeDataFirestore: any = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))[0];
        setRecipeData(recipeDataFirestore);
        console.log(recipeDataFirestore);
        setRecipeImage(await getImageStorage(recipeDataFirestore.imagePath));
      });
      return;
    } 
    _setAmoutOfTime();
  }, [recipeData]);

  function _setAmoutOfTime() {
    let _amountOfTime: number = 0;
    if (recipeData) {
      recipeData.recipeTimes.forEach((item: any) => {
        _amountOfTime += parseInt(item.minutes) + (parseInt(item.hours) * 60);
      });
    }
    setAmountOfTime(_amountOfTime);
  }

  return (
    <div>
      {recipeData ? (
        <Container
          customClass={"flexMiddleCol"}
          styleContainer={{
            padding: "50px 0px",
          }}
        >
          <h1 className={styles.recipeTitle}>{recipeData.recipeTitle}</h1>
          <div className={styles.recipeImageDiv}>
            <img src={recipeImage} alt="sla" />
          </div>
          <div className={styles.recipePreparationTimeDiv}>
              <div>
                <FaRegClock className={styles.clockIcon} /> {amountOfTime}min
              </div>
              <div>
                <TbChefHat className={styles.chefHatIcon} /> {recipeData.recipeDifficulty}
              </div>
              <div>
                <TbMoneybag className={styles.moneyStackIcon} /> {recipeData.recipeCost}
              </div>
          </div>
          <div className={styles.divUserAndLikes}>
            <div className={styles.divUser}>
              <img src={urlUser} alt="food" />
              <p>
                Por <br />
                <span>{recipeData.recipeOwnerName}</span>
              </p>
            </div>
            <div className={styles.divLikes}>
              <FaHeart className={styles.heartIcon} />
              <p>
                Quantide de
                <br />
                curtidas: <span>{recipeData.likes}</span>
              </p>
            </div>
          </div>
          <h2 className={styles.recipeIngredientsTitle}>
            Ingredientes ({"Porções 3"})
          </h2>
          <div className={styles.divRecipesGrid}>
            {recipeData.recipeIngredients.map((ingrediente: any) => (
              <div className={styles.divRecipeIngredient} key={ingrediente}>
                <img
                  src="https://source.unsplash.com/featured/100x100?food"
                  alt="food"
                />
                <p>{ingrediente}</p>
              </div>
            ))}
          </div>
          <div className={styles.divRecipesPhases}>
            <h2>Modo de Preparo</h2>
            <div className={styles.mainDivPhases}>
              {recipeData.recipePhasesList.map((fase: any) => (
                <div className={styles.recipePhase} key={fase.phaseNumber}>
                  <div>{fase.phaseNumber}</div>
                  <p>{fase.phaseText}</p>
                </div>
              ))}
            </div>
          </div>
          <h2 className={styles.recipeCommentsTitle}>Comentários</h2>
          <p className={styles.recipeCommentsAmount}>
            <span>300</span> comentários
          </p>
          <div className={styles.recipeComments}>
            <Comment
              commentDate="12/10/2006"
              userImageUrl={urlFood}
              commentText={loremIpsum}
              username="Cristiano Ronaldo Santos Aveiro"
            />
          </div>
        </Container>
      ) : (
        <div className={styles.divLoadingContent}>
          <Loading />
          <h1>Carregando conteúdo</h1>
        </div>
      )}
    </div>
  );
}
