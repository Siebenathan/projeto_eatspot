import styles from "./PerfilPage.module.css";
import Container from "../layout/Container";
import PerfilFoodContainer from "../eatspotcomponents/PerfilFoodContainer";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDataFromCollection } from "../services/firebase/firebaseFirestore";
import useLocalStorage from "../hooks/useLocalStorage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase/firebase";
import Loading from "../layout/Loading";
import { Link } from "react-router-dom";
import { getImageStorage } from "../services/firebase/firebaseStorage";

interface objectSearchProps {
  key: string;
  searchParameter: string;
}

export default function PerfilPage() {
  const [isThePerfilOwner, setIsThePerfilOwner] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>();
  const [recipesData, setRecipeData] = useState<any>();
  const [recipeImages, setRecipeImages] = useState<string[]>();
  const navigate = useNavigate();
  let { name } = useParams();
  const [userId, setUserId] = useLocalStorage("userId", "");

  onAuthStateChanged(auth, (user) => {
    if (user && name === "meuperfil") {
      if (user.uid !== userId) {
        navigate("/");
        return;
      }
      setIsThePerfilOwner(true);
    }
  });

  useEffect(() => {
    const objectSearch: objectSearchProps = { key: "", searchParameter: "" };

    if (name === "meuperfil") {
      if (userId) {
        objectSearch.key = "userId";
        objectSearch.searchParameter = userId;
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
    ).then(async (data) => {
      if (data.empty) {
        //Mandar para uma página de erro 404 pois nada foi encontrado no banco de dados
        // navigate("/pagina_de_erro");
        console.log("deu M");
        return;
      }

      const userDataFirestore: any = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))[0];

      const recipeDataFirestore = await getDataFromCollection(
        "recipes",
        "userId",
        userDataFirestore.userId
      );

      let recipeData: any = recipeDataFirestore.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      //Transforma em URL para o src da imagem
      for (let i = 0; i < recipeData.length; i++) {
        const url = await getImageStorage(recipeData[i].imagePath);
        recipeData[i].imagePath = url;
      }

      setRecipeData(recipeData);

      if (userId == userDataFirestore.userId && name == "meuperfil") {
        //Deu tudo certo
        console.log("Você está na sua página de perfil");
        setUserData(userDataFirestore);
      } else if (userId == userDataFirestore.userId) {
        //Direcionar para o perfil do usuário caso ele esteja logado
        document.location.href = "/perfil/meuperfil";
      } else {
        console.log(
          `Você está na página de perfil de ${userDataFirestore.name}`
        );
        setUserData(userDataFirestore);
      }
    });
  }, []);

  //Lista de informações.
  const names = [
    "Alessandro",
    "Maria",
    "Matheus",
    "João",
    "Wesley",
    "Bernardo",
    "Luisa",
    "Luiz",
    "Pedro",
  ];
  let key = 0;
  const urlFood = "https://source.unsplash.com/featured/400x300?food";

  return (
    <div>
      {userData ? (
        <Container
          customClass={"flexMiddleCol"}
          styleContainer={{
            background: "var(--cor2)",
            boxShadow: "#00000014 0px 9px 20px 10px",
          }}
        >
          <div className={styles.divPerfilInformation}>
            <h1 className={styles.divPerfilTitleUserName}>
              {userData && userData.name}
            </h1>
            <img
              className={styles.divPerfilInformationImage}
              src="https://source.unsplash.com/featured/300x300?person"
              alt="user image"
            />
            <h3>
              Receitas postadas:{" "}
              <span className={styles.divPerfilQtdeInformation}>300</span>
            </h3>
            <h3>
              Curtidas no perfil:{" "}
              <span className={styles.divPerfilQtdeInformation}>300</span>
            </h3>
          </div>
          <div className={styles.gridContainerFood}>
            {recipesData.map((r: any) => {
              key++;
              return (
                <PerfilFoodContainer
                  authorName={r.recipeOwnerName}
                  imageFoodUrl={r.imagePath}
                  likesAmount={r.likes}
                  recipeName={r.title}
                  recipeUrl={r.recipeUrl}
                  key={key}
                />
              );
            })}
          </div>
          {isThePerfilOwner && (
            <div className={styles.ownerFunctionalites}>
              <Link className={styles.linkToCreateRecipe} to="/criar-receita">
                Criar uma nova receita
              </Link>
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
