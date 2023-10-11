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

interface objectSearchProps {
  key: string;
  searchParameter: string;
}

export default function PerfilPage() {
  const [isThePerfilOwner, setIsThePerfilOwner] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>();
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
      } else {
        //Direcionar para uma página de erro
        console.log("Você não está logado!");
        navigate("/");
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
        //Mandar para uma página de erro 404 pois nada foi encontrado no banco de dados
        // navigate("/pagina_de_erro");
        console.log("deu M");
        return;
      }

      console.log(data.docs[0].id);

      const userDataFirestore: any = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      if (userId == userDataFirestore[0].userId && name == "meuperfil") {
        //Deu tudo certo
        console.log("Você está na sua página de perfil");
        setUserData(userDataFirestore[0]);
      } else if (userId == userDataFirestore[0].userId) {
        //Direcionar para o perfil do usuário caso ele esteja logado
        document.location.href = "/perfil/meuperfil";
      } else {
        console.log(
          `Você está na página de perfil de ${userDataFirestore[0].name}`
        );
        setUserData(userDataFirestore[0]);
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
  const urlFood = "https://source.unsplash.com/featured/300x300?food";

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
              src="https://source.unsplash.com/featured/200x200?person"
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
            {names.map((name) => {
              key++;
              return (
                <PerfilFoodContainer
                  authorName={name}
                  imageFoodUrl={urlFood}
                  likesAmount={300}
                  recipeName={name}
                  key={key}
                />
              );
            })}
          </div>
          {isThePerfilOwner && (
            <div className={styles.ownerFunctionalites}>
              <Link className={styles.linkToCreateRecipe} to="/criar-receita">Criar uma nova receita</Link>
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
