import styles from "./PerfilPage.module.css";
import Container from "../layout/Container";
import PerfilFoodContainer from "../eatspotcomponents/PerfilFoodContainer";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getDataFromCollection,
  getDataWithWhereOrderLimitAndStartAfter,
} from "../services/firebase/firebaseFirestore";
import useLocalStorage from "../hooks/useLocalStorage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase/firebase";
import Loading from "../layout/Loading";
import { Link } from "react-router-dom";
import {
  addItemToStorage,
  getImageStorage,
} from "../services/firebase/firebaseStorage";
import { FaPencilAlt } from "react-icons/fa";
import ModalToPutImage from "../modal/ModalToPutImage";
import defaultUserPhoto from "../../img/EatSpot-semfundo.png";
import Message from "../modal/Message";
import { MessageProps } from "../modal/Message";
import Button from "../forms/buttons/Button";

interface objectSearchProps {
  key: string;
  searchParameter: string;
}

export default function PerfilPage() {
  const [isThePerfilOwner, setIsThePerfilOwner] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>();
  const [recipesData, setRecipeData] = useState<any>();
  const [getMoreRecipes, setGetMoreRecipes] = useState<any>();
  const [latestRecipeSnapshot, setLatestRecipeSnapshot] = useState<any>();
  const [newOwnerPhotoFileUrl, setNewOwnerPhotoFileUrl] = useState<any>();
  const [userPhoto, setUserPhoto] = useState<any>();
  const [message, setMessage] = useState<MessageProps>();
  const location = useLocation();
  const messageState = location.state?.message;
  const messageType = location.state?.type;

  const navigate = useNavigate();
  let { name } = useParams();
  const [modalToChangePhotoOpen, setModalToChangePhotoOpen] =
    useState<boolean>(false);
  const [userId, setUserId] = useLocalStorage("userId", "");

  useEffect(() => {
    const objectSearch: objectSearchProps = { key: "", searchParameter: "" };

    if (name === "meuperfil") {
      if (userId && userId != "") {
        objectSearch.key = "userId";
        objectSearch.searchParameter = userId;
      } else {
        console.log("deu merda");
        return;
      }
    } else {
      name = name?.replace("@", "");
      objectSearch.key = "name";
      objectSearch.searchParameter = String(name);
    }

    getDataFromCollection(
      "users",
      objectSearch.key,
      objectSearch.searchParameter
    ).then((data) => {
      if (data.empty) {
        navigate("/error", {
          state: {
            message:
              "Erro o perfil que você estava buscando não foi encontrado 🕵️",
            errorType: 404,
          },
        });
        return;
      }

      const userDataFirestore: any = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))[0];

      if (userId === userDataFirestore.userId && name !== "meuperfil") {
        navigate("/perfil/meuperfil");
      }

      onAuthStateChanged(auth, (user) => {
        if (user && userDataFirestore.userId == userId) {
          if (user.uid !== userId) {
            // navigate("/");
            return;
          }
          setIsThePerfilOwner(true);
        }
      });
      getUserPhoto(userDataFirestore.userPhotoUrl);
      setUserData(userDataFirestore);
    });
  }, []);

  useEffect(() => {
    if (userData) {
      if (messageState && messageType) {
        setMessage({
          message: messageState,
          type: messageType,
        });
      }
      const observer = new IntersectionObserver((entries) => {
        const element: any = entries[0];
        if (element.isIntersecting) {
          setLatestRecipeSnapshot((currentStateValue: any) => {
            if (currentStateValue) {
              setGetMoreRecipes(true);
              return currentStateValue;
            }
            observer.disconnect();
          });
        }
      });
      getRecipesFirestore().then(() => {
        const elementToObserve: any = document.querySelector("#observer");
        if (elementToObserve) {
          observer.observe(elementToObserve);
        }
      });
      return () => {
        observer.disconnect();
      };
    }
  }, [userData]);

  useEffect(() => {
    if (getMoreRecipes) {
      getRecipesFirestore();
      setGetMoreRecipes(false);
    }
  }, [getMoreRecipes]);

  async function getRecipesFirestore() {
    let recipeDataFirestore: any = null;
    if (latestRecipeSnapshot) {
      console.log("graças a deus caiu aqui");
      recipeDataFirestore = await getDataWithWhereOrderLimitAndStartAfter(
        "recipes",
        9,
        "createdAt",
        "desc",
        "recipeOwnerName",
        userData.name,
        latestRecipeSnapshot
      );
    } else {
      recipeDataFirestore = await getDataWithWhereOrderLimitAndStartAfter(
        "recipes",
        9,
        "createdAt",
        "desc",
        "recipeOwnerName",
        userData.name
      );
    }

    const lastDoc =
      recipeDataFirestore.docs[recipeDataFirestore.docs.length - 1];

    setLatestRecipeSnapshot(lastDoc);

    let recipeData: any = recipeDataFirestore.docs.map((doc: any) => ({
      ...doc.data(),
      id: doc.id,
    }));

    await getRecipeImages(recipeData);
  }

  async function getUserPhoto(url: string) {
    try {
      const userPhotoStorage = await getImageStorage(url);
      setUserPhoto(userPhotoStorage);
    } catch {
      setUserPhoto(defaultUserPhoto);
    }
  }

  async function getRecipeImages(arrayOfRecipes?: any) {
    for (let i = 0; i < arrayOfRecipes.length; i++) {
      const url = await getImageStorage(arrayOfRecipes[i].imagePath);
      arrayOfRecipes[i].imagePath = url;
      if (recipesData) {
        setRecipeData([...recipesData, ...arrayOfRecipes]);
      } else {
        setRecipeData([...arrayOfRecipes]);
      }
    }
  }

  async function changePerfilPhoto() {
    const endPoint = userData.userPhotoUrl;
    await addItemToStorage(endPoint, newOwnerPhotoFileUrl);
    document.location.reload();
  }

  function capitalizeString(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div className={styles.mainPerfilDiv}>
      {userData ? (
        <Container
          customClass={"flexMiddleCol"}
          styleContainer={{
            paddingTop: "4%",
            background: "var(--cor2)",
            boxShadow: "#00000014 0px 9px 20px 10px",
          }}
        >
          {message && <Message type={message.type} message={message.message} />}
          <ModalToPutImage
            setImageFileUrl={setNewOwnerPhotoFileUrl}
            isOpen={modalToChangePhotoOpen}
            setIsOpen={() => setModalToChangePhotoOpen(false)}
            text="Deseja trocar sua foto de perfil? Selecione uma imagem e depois clique em confirmar!"
            title="Trocar foto de perfil"
            type="informacao"
            secondButtonFunction={() => {
              changePerfilPhoto();
            }}
            textSecondButton="Confirmar"
            styleSecondButton={{
              backgroundColor: "var(--cor3)",
              cursor: "pointer",
              padding: "10px 20px",
              color: "white",
              borderRadius: "5px",
            }}
          />
          <div className={styles.divPerfilInformation}>
            <h1 className={styles.divPerfilTitleUserName}>
              {userData && userData.name}
            </h1>
            {isThePerfilOwner ? (
              <div className={styles.divPerfilOwnerImage}>
                <FaPencilAlt
                  className={styles.pencilEditPerfil}
                  onClick={() => {
                    setModalToChangePhotoOpen(true);
                  }}
                />
                <img
                  className={styles.divPerfilInformationImage}
                  src={userPhoto}
                  onError={(e: any) => {
                    e.target.src = defaultUserPhoto;
                  }}
                  alt="user image"
                />
              </div>
            ) : (
              <img
                className={styles.divPerfilInformationImage}
                src={userPhoto}
                onError={(e: any) => {
                  e.target.src = defaultUserPhoto;
                }}
                alt="user image"
              />
            )}

            <h3>
              Receitas postadas:{" "}
              <span className={styles.divPerfilQtdeInformation}>{userData.numberOfRecipes}</span>
            </h3>

          </div>
          {isThePerfilOwner && (
            <div className={styles.ownerFunctionalites}>
              <Link className={styles.linkToCreateRecipe} to="/criar-receita">
                Criar uma nova receita
              </Link>
            </div>
          )}
          <div className={styles.gridContainerFood}>
            {recipesData &&
              recipesData.map((r: any) => {
                return (
                  <PerfilFoodContainer
                    authorName={r.recipeOwnerName}
                    imageFoodUrl={r.imagePath}
                    likesAmount={r.likes}
                    recipeName={capitalizeString(r.recipeTitle)}
                    recipeUrl={r.recipeUrl}
                    key={r.id}
                  />
                );
              })}
          </div>
          <div className={styles.observerIntersection} id="observer"></div>
          {isThePerfilOwner && (
            <div className={styles.ownerFunctionalites}>
              <Button
                buttonText="Deletar minha conta"
                type="button"
                onClick={() => {}}
                style={{
                  width: "fit-content",
                  backgroundColor: "var(--cor4)",
                  color: "white",
                  cursor: "pointer",
                  padding: "2rem 2rem",
                  fontSize: "1.3em",
                }}
              />
              <Button
                buttonText="Editar minha conta"
                type="button"
                onClick={() => {}}
                style={{
                  width: "fit-content",
                  backgroundColor: "orange",
                  color: "white",
                  cursor: "pointer",
                  padding: "2rem 2rem",
                  fontSize: "1.3em",
                }}
              />
            </div>
          )}
        </Container>
      ) : (
        <div className={styles.divLoadingContent}>
          <Loading styleSizeOfTheLoading={{}} />
          <h1>Carregando conteúdo</h1>
        </div>
      )}
    </div>
  );
}
