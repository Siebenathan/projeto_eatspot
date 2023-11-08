import Container from "../layout/Container";
import styles from "./RecipePage.module.css";
import { FaRegClock, FaHeart } from "react-icons/fa";
import Comment from "../eatspotcomponents/comments/Comment";
import { useEffect, useState } from "react";
import {
  getDataFromCollection,
  setDocAlreadyCreated,
} from "../services/firebase/firebaseFirestore";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../layout/Loading";
import { TbChefHat } from "react-icons/tb";
import { TbMoneybag } from "react-icons/tb";
import { getImageStorage } from "../services/firebase/firebaseStorage";
import useLocalStorage from "../hooks/useLocalStorage";
import NewComment from "../eatspotcomponents/comments/NewComment";
import defaultUserPhoto from "../../img/EatSpot-semfundo.png";

export default function RecipePage() {
  const [recipeData, setRecipeData] = useState<any>();
  const [recipeImage, setRecipeImage] = useState<any>();
  const [userLikingState, setUserLikingState] = useState<{
    changeStyleHeart: boolean;
    updatingDatabase: boolean;
  }>({
    changeStyleHeart: false,
    updatingDatabase: false,
  });
  const [userData, setUserData] = useState<any>();
  const [userPhoto, setUserPhoto] = useState<any>();
  const [amountOfTime, setAmountOfTime] = useState<any>();
  const [userId, setUserId] = useLocalStorage("userId", "");
  const { recipeUrl } = useParams();
  const [ownerOfTheRecipe, setOwnerOfTheRecipe] = useState<boolean>(false);
  const [ownerRecipePhoto, setOwnerRecipePhoto] = useState<string>();
  const navigate = useNavigate();

  const urlFood = "https://source.unsplash.com/featured/800x600?food";
  const urlUser = "https://source.unsplash.com/featured/100x100?person";
  const loremIpsum =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex optio, architecto deleniti quas officiis pariatur aperiam, excepturi amet molestiae aut harum ipsa porro tempora libero quae modi cum illo voluptatibus!";

  useEffect(() => {
    if (userId) {
      getDataFromCollection("users", "userId", userId).then(async (data) => {
        const userDataFirestore: any = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))[0];
        setUserData(userDataFirestore);
        setUserPhoto(await getImageStorage(userDataFirestore.userPhotoUrl));
      });
    }

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
      setRecipeImage(await getImageStorage(recipeDataFirestore.imagePath));
    });
  }, []);

  useEffect(() => {
    if (recipeData) {
      _setAmoutOfTime();
    }
  }, [recipeData]);

  useEffect(() => {
    if (userData && recipeData) {
      if (userData.name == recipeData.recipeOwnerName) {
        setOwnerOfTheRecipe(true);
        return;
      }
      if (!userData.recipesILiked) {
        return;
      } else {
        userData.recipesILiked.forEach((recipe: any) => {
          if (recipe == recipeData.id) {
            setUserLikingState({
              changeStyleHeart: true,
              updatingDatabase: false,
            });
          }
        });
      }
    }
  }, [recipeData, userData]);

  function handleCommentSubmit(commentText: string, avaliationNumber: number) {
    recipeData.comments.push({
      commentText: commentText,
      avaliationNumber: avaliationNumber,
      commentatorName: userData.name,
    });
    console.log("aaa");
    // setDocAlreadyCreated("recipes", recipeData.id, recipeData);
  }

  function _setAmoutOfTime() {
    let _amountOfTime: number = 0;
    if (recipeData) {
      recipeData.recipeTimes.forEach((item: any) => {
        _amountOfTime += parseInt(item.minutes) + parseInt(item.hours) * 60;
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
              <TbChefHat className={styles.chefHatIcon} />{" "}
              {recipeData.recipeDifficulty}
            </div>
            <div>
              <TbMoneybag className={styles.moneyStackIcon} />{" "}
              {recipeData.recipeCost}
            </div>
          </div>
          <div className={styles.divUserAndLikes}>
            <div className={styles.divUser}>
              <img src={urlUser} alt="Imagem do dono da receita" />
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
          <div className={styles.divRecipeDescription}>
            <h2>Descrição da receita</h2>
            <p>{recipeData.recipeDescription}</p>
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
          {!ownerOfTheRecipe && (
            <div className={styles.divToLikeRecipe}>
              <h2>
                Gostou da receita?
                <br />
                Deixe sua curtida!
              </h2>
              <FaHeart
                className={styles.heartIconButton}
                style={userLikingState.changeStyleHeart ? { color: "red" } : {}}
                onClick={() => {
                  if (!userId) {
                    navigate("/login");
                    return;
                  }
                  if (
                    !userLikingState.updatingDatabase &&
                    !userLikingState.changeStyleHeart
                  ) {
                    setUserLikingState({
                      changeStyleHeart: true,
                      updatingDatabase: true,
                    });
                    recipeData.likes += 1;
                    userData.recipesILiked.push(recipeData.id);
                    setUserData(userData);
                    setRecipeData(recipeData);
                    const timeoutLike = setTimeout(() => {
                      setDocAlreadyCreated(
                        "recipes",
                        recipeData.id,
                        recipeData
                      );
                      setDocAlreadyCreated("users", userData.id, userData);
                      setUserLikingState({
                        changeStyleHeart: true,
                        updatingDatabase: false,
                      });
                      clearTimeout(timeoutLike);
                    }, 5000);
                  } else if (
                    !userLikingState.updatingDatabase &&
                    userLikingState.changeStyleHeart
                  ) {
                    setUserLikingState({
                      changeStyleHeart: false,
                      updatingDatabase: true,
                    });
                    recipeData.likes -= 1;
                    userData.recipesILiked = userData.recipesILiked.filter(
                      (recipe: any) => recipe != recipeData.id
                    );
                    setRecipeData(recipeData);
                    setUserData(userData);
                    const timeoutLike = setTimeout(() => {
                      setDocAlreadyCreated(
                        "recipes",
                        recipeData.id,
                        recipeData
                      );
                      setDocAlreadyCreated("users", userData.id, userData);
                      setUserLikingState({
                        changeStyleHeart: false,
                        updatingDatabase: false,
                      });
                      clearTimeout(timeoutLike);
                    }, 5000);
                  }
                }}
              />
              {userLikingState.changeStyleHeart ? (
                <p>Você curtiu essa receita!</p>
              ) : (
                <p>
                  Clique no coração para
                  <br />
                  curtir a receita
                </p>
              )}
            </div>
          )}

          <h2 className={styles.recipeCommentsTitle}>Comentários</h2>
          <p className={styles.recipeCommentsAmount}>
            <span>300</span> comentários
          </p>

          <div className={styles.recipeComments}>
            {!ownerOfTheRecipe && (
              <NewComment
                handleSubmit={handleCommentSubmit}
                userImageUrl={
                  userPhoto == "erro imagem nao encontrada"
                    ? defaultUserPhoto
                    : userPhoto
                }
                isUserLogged={userData ? true : false}
                username={userData ? userData.name : "EatSpot"}
              />
            )}
            <Comment
              commentDate="12/10/2006"
              userImageUrl={urlFood}
              commentText={loremIpsum}
              username="Cristiano Ronaldo Santos Aveiro"
            />
          </div>
          {ownerOfTheRecipe && (
            <div className={styles.recipeOwnerDiv}>
              <h2>Opções para alterar a receita</h2>
              <div className={styles.divRecipeOwnerButtons}>
                <button
                  className={styles.recipeOwnerButtonEditRecipe}
                  onClick={() => {
                    //TODO:
                  }}
                >
                  Editar
                </button>
                <button
                  className={styles.recipeOwnerButtonDeleteRecipe}
                  onClick={() => {
                    //TODO:
                  }}
                >
                  Excluir
                </button>
              </div>
            </div>
          )}
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
