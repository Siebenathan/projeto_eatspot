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
import { v4 as uuidv4 } from "uuid";
import defaultUserPhoto from "../../img/EatSpot-semfundo.png";
import Button from "../forms/buttons/Button";
import Modal from "../modal/Modal";
import defaultImageRecipeIngredient from "../../img/vasilha_com_colher_desenho.jpg";
import { ModalProps } from "../modal/Modal";
import { deleteDocument } from "../services/firebase/firebaseFirestore";
import { updateDocFirestore } from "../services/firebase/firebaseFirestore";

interface RecipeComment {
  commentText: string;
  avaliationNumber: number;
  commentatorName: string;
  commentatorPhotoUrl: any;
  commentDate: string;
  exactTime: number;
  isTheOwnerOfPost?: boolean;
}

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
  const [recipeId, setRecipeId] = useState<string>();
  const [userData, setUserData] = useState<any>();
  const [userPhoto, setUserPhoto] = useState<any>();
  const [amountOfTime, setAmountOfTime] = useState<any>();
  const [userId, setUserId] = useLocalStorage("userId", "");
  const { recipeUrl } = useParams();
  const [ownerOfTheRecipe, setOwnerOfTheRecipe] = useState<boolean>(false);
  const [recipeComments, setRecipeComments] = useState<RecipeComment[]>([]);
  const [startAtComment, setStartAtComment] = useState<number>(0);
  const [isUpdatingDatabase, setIsUpdatingDatabase] = useState<boolean>(false);
  const [ownerRecipePhoto, setOwnerRecipePhoto] = useState<string>();
  const [modal, setModal] = useState<ModalProps>({
    isOpen: false,
    text: "",
    type: "erro",
    title: "",
    setIsOpen() {
      setModal({
        isOpen: false,
        setIsOpen() {},
        text: "",
        type: "erro",
        title: "",
      });
    },
    textSecondButton: undefined,
    secondButtonFunction: undefined,
    styleSecondButton: undefined,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      getDataFromCollection("users", "userId", userId).then(async (data) => {
        const userDataFirestore: any = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))[0];
        setUserData(userDataFirestore);
        setUserPhoto(await getUserPhoto(userDataFirestore.userPhotoUrl));
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
      if (!data.empty) {
        recipeDataFirestore.recipePhasesList = orderRecipePhases(
          recipeDataFirestore.recipePhasesList
        );
        const recipeIdString = data.docs[0].id ? data.docs[0].id : "";
        setRecipeId(recipeIdString);
        setRecipeData(recipeDataFirestore);
        setRecipeImage(await getImageStorage(recipeDataFirestore.imagePath));
        setOwnerRecipePhoto(
          await getUserPhoto(recipeDataFirestore.userPhotoUrl)
        );
      } else {
        navigate("/error", {
          state: {
            errorType: 404,
            message:
              "Erro a receita que você estava buscando não foi encontrada 😭",
          },
        });
        return;
      }
    });
  }, []);

  useEffect(() => {
    if (userData && recipeData) {
      if (userData.name == recipeData.recipeOwnerName) {
        setOwnerOfTheRecipe(true);
        _setAmoutOfTime();
        getRecipeComments();
        return;
      }
      _setAmoutOfTime();
      userAlreadyLikedRecipe();
      getRecipeComments();
    }
  }, [recipeData, userData]);

  async function handleCommentSubmit(
    commentText: string,
    avaliationNumber: number,
    createCommentDate: string,
    exactTime: number
  ) {
    const newComment: RecipeComment = {
      avaliationNumber: avaliationNumber,
      commentatorName: userData.name,
      commentatorPhotoUrl: userData.userPhotoUrl,
      commentText: commentText,
      commentDate: createCommentDate,
      exactTime: exactTime,
    };
    recipeData.comments.push(newComment);

    const imagePath = userData.userPhotoUrl;
    const imageReadyToGo = await getUserPhoto(imagePath);
    newComment.commentatorPhotoUrl = imageReadyToGo;
    newComment.isTheOwnerOfPost = true;

    if (recipeData.comments[0] == undefined) {
      recipeComments.push(newComment);
      setRecipeComments([...recipeComments]);
    } else {
      recipeComments.unshift(newComment);
      setRecipeComments([...recipeComments]);
    }

    setDocAlreadyCreated("recipes", recipeData.id, recipeData);
  }

  function userAlreadyLikedRecipe() {
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

  async function getRecipeComments() {
    if (recipeData.comments) {
      const organizeByTime = (a: RecipeComment, b: RecipeComment) =>
        b.exactTime - a.exactTime;
      let commentsSplitAllSorted: RecipeComment[] =
        recipeData.comments.sort(organizeByTime);
      let commentsSplit: RecipeComment[] = [];
      let _startAtComment = startAtComment;
      for (let i = 0; i <= 2; i++) {
        if (recipeData.comments[_startAtComment]) {
          commentsSplit[i] = commentsSplitAllSorted[_startAtComment];
          _startAtComment++;
          setStartAtComment(_startAtComment);
        }
      }

      for (let i = 0; i < commentsSplit.length; i++) {
        await getUserPhoto(commentsSplit[i].commentatorPhotoUrl).then(
          (userPhoto) => {
            commentsSplit[i].commentatorPhotoUrl = userPhoto;
            if (commentsSplit[i].commentatorName == userData.name)
              commentsSplit[i].isTheOwnerOfPost = true;
            if (userData.name == recipeData.recipeOwnerName)
              commentsSplit[i].isTheOwnerOfPost = true;
            recipeComments.push(commentsSplit[i]);
            setRecipeComments([...recipeComments]);
          }
        );
      }
    }
  }

  async function getUserPhoto(imageUrl: string) {
    let userPhoto: any = null;
    userPhoto = await getImageStorage(imageUrl);
    if (userPhoto == "erro imagem nao encontrada") {
      userPhoto = defaultUserPhoto;
    }
    return userPhoto;
  }

  function _setAmoutOfTime() {
    let _amountOfTime: number = 0;
    if (recipeData) {
      recipeData.recipeTimes.forEach((item: any) => {
        let hours = 0;
        let minutes = 0;
        // _amountOfTime += parseInt(item.minutes) + parseInt(item.hours) * 60;
        if(item.hours) {
          hours = parseInt(item.hours) * 60;
        }
        if(item.minutes) {
          minutes = parseInt(item.minutes);
        }
        _amountOfTime += hours + minutes;
      });
    }
    setAmountOfTime(_amountOfTime);
  }

  function orderRecipePhases(recipePhases: any) {
    const compareOrderPhase = (a: any, b: any) => a.phaseNumber - b.phaseNumber;
    return recipePhases.sort(compareOrderPhase);
  }

  async function handleDeleteComment(commentExactTime: number): Promise<void> {
    // console.log(commentExactTime);
    const newRecipeComments = recipeData.comments.filter(
      (recipe: any) => recipe.exactTime != commentExactTime
    );
    setRecipeComments([...newRecipeComments]);
    // console.log(newRecipeComments);
    recipeData.comments = newRecipeComments;
    // console.log(recipeData.comments);
    setRecipeData(recipeData);
    setDocAlreadyCreated("recipes", recipeData.id, recipeData);
  }

  function deleteRecipeModal() {
    const settingsModal: ModalProps = {
      isOpen: true,
      setIsOpen() {
        setModal({
          isOpen: false,
          setIsOpen() {},
          text: "",
          type: "erro",
          title: "",
        });
      },
      text: `A sua receita ${recipeData.recipeTitle} vai ser permanentemente deletada, os comentários e os likes também.`,
      title: `Deseja deletar a sua receita?`,
      type: "informacao",
      textSecondButton: "Confirmar",
      secondButtonFunction: handleDeleteRecipe,
      styleSecondButton: {
        backgroundColor: "orange",
        cursor: "pointer",
        padding: "10px 20px",
        color: "white",
        borderRadius: "5px",
      },
    };
    setModal(settingsModal);
  }

  async function handleDeleteRecipe() {
    const {numberOfRecipes, ...rest} = userData;
    rest["numberOfRecipes"] = numberOfRecipes - 1;
    await updateDocFirestore("users", userData.userId, rest);
    const result = await deleteDocument("recipes", recipeId ?? "");
    if (!result) {
      navigate("/perfil/meuperfil", {
        state: {
          message: `A sua receita ${recipeData.recipeTitle} foi deletada com sucesso!`,
          type: "success",
        },
      });
    }
  }

  function editRecipeModal() {
    const settingsModal: ModalProps = {
      isOpen: true,
      setIsOpen() {
        setModal({
          isOpen: false,
          setIsOpen() {},
          text: "",
          type: "erro",
          title: "",
        });
      },
      text: `A sua receita ${recipeData.recipeTitle} vai ser permanentemente deletada, os comentários e os likes também.`,
      title: `Deseja deletar a sua receita?`,
      type: "informacao",
      textSecondButton: "Confirmar",
      secondButtonFunction: handleDeleteRecipe,
      styleSecondButton: {
        backgroundColor: "orange",
        cursor: "pointer",
        padding: "10px 20px",
        color: "white",
        borderRadius: "5px",
      },
    };
  }

  function capitalizeString(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
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
          <Modal
            isOpen={modal.isOpen}
            setIsOpen={modal.setIsOpen}
            text={modal.text}
            title={modal.title}
            type={modal.type}
            secondButtonFunction={modal.secondButtonFunction}
            styleSecondButton={modal.styleSecondButton}
            textSecondButton={modal.textSecondButton}
          />
          <h1 className={styles.recipeTitle}>{capitalizeString(recipeData.recipeTitle)}</h1>
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
              <img
                src={ownerRecipePhoto}
                alt="Imagem do dono da receita"
                onClick={() =>
                  navigate(`/perfil/@${recipeData.recipeOwnerName}`)
                }
              />
              <p>
                Por <br />
                <span
                  onClick={() =>
                    navigate(`/perfil/@${recipeData.recipeOwnerName}`)
                  }
                >
                  {recipeData.recipeOwnerName}
                </span>
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
            Ingredientes ({`Porções ${recipeData.numberOfPorcions}`})
          </h2>
          <div className={styles.divRecipesGrid}>
            {recipeData.recipeIngredients.map((ingrediente: any) => (
              <div className={styles.divRecipeIngredient} key={ingrediente}>
                <img
                  src={defaultImageRecipeIngredient}
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
                    recipeData.peopleThatLikedRecipe.push(userData.name);
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
                    recipeData.peopleThatLikedRecipe =
                      recipeData.peopleThatLikedRecipe.filter(
                        (people: any) => people != userData.name
                      );
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
            {recipeData.comments[0] ? (
              <span className={styles.spanStyleWithComments}>
                {recipeData.comments.length}{" "}
              </span>
            ) : (
              <span className={styles.spanStyleWithoutComment}>Não há </span>
            )}
            comentários
          </p>

          <div className={styles.recipeComments}>
            {!ownerOfTheRecipe && (
              <NewComment
                handleSubmit={handleCommentSubmit}
                isUpdatingDatabase={isUpdatingDatabase}
                setIsUpdatingDatabase={setIsUpdatingDatabase}
                userImageUrl={userPhoto}
                isUserLogged={userData ? true : false}
                username={userData ? userData.name : "EatSpot"}
              />
            )}
            {isUpdatingDatabase && (
              <div className={styles.addingNewComment}>
                <Loading
                  styleSizeOfTheLoading={{ width: "100px", height: "100px" }}
                />
                <p>Adicionando novo comentário...</p>
              </div>
            )}
            {recipeData.comments[0] == undefined && !ownerOfTheRecipe && (
              <h3 className={styles.beTheFirstToCommentOnThePost}>
                Seja o primeiro a comentar nessa postagem!
              </h3>
            )}
            {recipeData.comments[0] && (
              <>
                {recipeComments.map((comment) => (
                  <Comment
                    exactTime={comment.exactTime}
                    commentDate={comment.commentDate}
                    userImageUrl={comment.commentatorPhotoUrl}
                    commentText={comment.commentText}
                    username={comment.commentatorName}
                    avaliationNumber={comment.avaliationNumber}
                    isTheOwnerOfPost={comment.isTheOwnerOfPost}
                    key={uuidv4()}
                    deleteComment={handleDeleteComment}
                  />
                ))}
                {recipeComments[recipeData.comments.length - 1] ==
                  undefined && (
                  <Button
                    buttonText="Carregar mais comentários"
                    type="button"
                    style={{
                      marginTop: "1rem",
                      backgroundColor: "var(--cor1)",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "2em",
                      padding: "2rem 3rem",
                    }}
                    onClick={() => {
                      getRecipeComments();
                    }}
                  />
                )}
              </>
            )}
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
                    deleteRecipeModal();
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
