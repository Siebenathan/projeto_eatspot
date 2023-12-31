import Container from "../layout/Container";
import styles from "./CreateRecipePage.module.css";
import { TbChefHat } from "react-icons/tb";
import { GrMoney } from "react-icons/gr";
import { GiMoneyStack } from "react-icons/gi";
import { TbMoneybag } from "react-icons/tb";
import Input from "../forms/inputs/Input";
import { useState, useEffect } from "react";
import InputFileWithPreview from "../forms/inputs/InputFileWithPreview";
import TextArea from "../forms/TextArea";
import Button from "../forms/buttons/Button";
import Modal from "../modal/Modal";
import { ModalProps } from "../modal/Modal";
import { addItemToStorage } from "../services/firebase/firebaseStorage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase/firebase";
import useLocalStorage from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getImageStorage } from "../services/firebase/firebaseStorage";
import { v4 as uuidv4 } from "uuid";
import {
  addDocument,
  getDataFromCollection,
  setDocAlreadyCreated,
  updateDocFirestore,
} from "../services/firebase/firebaseFirestore";
import { serverTimestamp } from "firebase/firestore";

interface RecipeTimeProps {
  period: string;
  minutes?: number;
  hours?: number;
}

interface RecipePhasesProps {
  phaseText: string;
  phaseNumber: number;
}

export default function CreateRecipePage() {
  const location = useLocation();
  const recipeUrl = location.state?.recipeUrl;
  const docId = location.state?.recipeDocId;
  const recipeData = location.state?.recipeData;
  const userData = location.state?.userData;
  const imageStorage = location.state?.recipeImage;
  const [recipeImage, setRecipeImage] = useState<string>("");
  const [userId, setUserId] = useLocalStorage("userId", "");
  const navigate = useNavigate();
  const [titleRecipe, setTitleRecipe] = useState<string>("");
  const [imageFile, setImageFile] = useState<any>(undefined);
  const [imageUrl, setImageUrl] = useState<any>();
  const [recipeTimes, setRecipeTimes] = useState<RecipeTimeProps[]>([
    { period: "Tempo de preparo", minutes: 0, hours: 0 },
    { period: "Tempo de cozimento", minutes: 0, hours: 0 },
    { period: "Tempo de espera", minutes: 0, hours: 0 },
  ]);
  const [recipeDescription, setRecipeDescription] = useState<string>();
  const [recipeIngredients, setRecipeIngredients] = useState<string>();
  const [recipeDifficulty, setRecipeDifficulty] = useState<string>("");
  const [recipeCost, setRecipeCost] = useState<string>("");
  const [requiredRecipePhase, setRequiredRecipePhase] =
    useState<RecipePhasesProps>({ phaseNumber: 1, phaseText: "" });
  const [recipePhasesList, setRecipePhasesList] =
    useState<RecipePhasesProps[]>();
  const [numberOfPorcions, setNumberOfPorcions] = useState<number>(0);
  const [modal, setModal] = useState<ModalProps>({
    isOpen: false,
    text: "",
    type: "erro",
    title: "",
    setIsOpen() {},
    textSecondButton: undefined,
    secondButtonFunction: undefined,
    styleSecondButton: undefined,
  });
  let indexNumber = -1;

  useEffect(() => {
    if (userId == "") {
      redirectToLoginPage();
    }

    console.log(userData);
    //Aqui é caso se usuário estiver editando a receita
    if (recipeData) {
      setTitleRecipe(recipeData.recipeTitle);
      setRecipeImage(imageStorage);
      setRecipeDescription(recipeData.recipeDescription);
      setNumberOfPorcions(recipeData.numberOfPorcions);
      const recipeIngredientsFormatted = recipeData.recipeIngredients.reduce(
        (acc: string, ingredient: string) => {
          acc += `\n${ingredient}`;
          return acc;
        }
      );
      setRecipeIngredients(recipeIngredientsFormatted);
      const optionsQueryDifficulty =
        document.getElementsByName("difficultyOptions");
      optionsQueryDifficulty.forEach((element: any) => {
        if (element.id == recipeData.recipeDifficulty) {
          element.parentNode.style.backgroundColor = "var(--cor5)";
        }
      });
      setRecipeDifficulty(recipeData.recipeDifficulty);
      setRecipeCost(recipeData.recipeCost);
      const optionsQueryCost = document.getElementsByName("recipeCost");
      optionsQueryCost.forEach((element: any) => {
        if (element.id == recipeData.recipeCost) {
          element.parentNode.style.backgroundColor = "var(--cor5)";
        }
      });
      setRecipeTimes([
        {
          period: "Tempo de preparo",
          minutes: recipeData.recipeTimes[0].minutes,
          hours: recipeData.recipeTimes[0].hours,
        },
        {
          period: "Tempo de cozimento",
          minutes: recipeData.recipeTimes[1].minutes,
          hours: recipeData.recipeTimes[1].hours,
        },
        {
          period: "Tempo de espera",
          minutes: recipeData.recipeTimes[2].minutes,
          hours: recipeData.recipeTimes[2].hours,
        },
      ]);
      const [requiredPhase, ...rest] = recipeData.recipePhasesList;
      setRequiredRecipePhase(requiredPhase);
      setRecipePhasesList(rest ? undefined : rest);
    }
  }, []);

  const recipeDifficultyList = [
    "Muito fácil",
    "Fácil",
    "Médio",
    "Difícil",
    "Muito difícil",
  ];

  const recipeCostList = [
    {
      element: <GrMoney className={styles.costIconMoney} />,
      value: "Custo Baixo",
    },
    {
      element: <GiMoneyStack className={styles.costIconMoney} />,
      value: "Custo Médio",
    },
    {
      element: <TbMoneybag className={styles.costIconMoney} />,
      value: "Custo Alto",
    },
  ];

  const recipeTimesList = [
    { period: "Tempo de preparo", required: true },
    { period: "Tempo de cozimento", required: false },
    { period: "Tempo de espera", required: false },
  ];

  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (user.uid != userId) {
        redirectToLoginPage();
      }
    }
  });

  async function getRecipeImage(url: string) {
    const imageStorage = await getImageStorage(url);
    return imageStorage;
  }

  function redirectToLoginPage() {
    navigate("/login", {
      state: {
        message:
          "Ocorreu um erro na autenticação porfavor faça o seu login novamente!",
        type: "error",
      },
    });
  }

  function editRecipeModal(e: any) {
    e.preventDefault();
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
      text: `A sua receita ${recipeData.recipeTitle} vai ser editada`,
      title: `Deseja editar a sua receita?`,
      type: "informacao",
      textSecondButton: "Confirmar",
      secondButtonFunction: editRecipe,
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

  async function editRecipe() {
    if (imageUrl) {
      addItemToStorage(recipeData.imagePath, imageUrl);
    }

    const newRecipePhasesList = [];
    newRecipePhasesList.push(requiredRecipePhase);
    if (recipePhasesList) {
      recipePhasesList.forEach((item) => {
        newRecipePhasesList.push(item);
      });
    }

    const formatRecipePhasesList = newRecipePhasesList?.filter(
      (element) => element.phaseText != ""
    );

    const recipeIngredientesFormated = recipeIngredients
      ?.split("\n")
      .filter((item) => item != "");

    const newRecipeDataFireStore = {
      recipeUrl: recipeData.recipeUrl,
      createdAt: recipeData.createdAt,
      recipeTitle: titleRecipe.toLowerCase(),
      imagePath: recipeData.imagePath,
      recipeDescription: recipeDescription,
      recipeIngredients: recipeIngredientesFormated,
      recipeDifficulty: recipeDifficulty,
      recipeCost: recipeCost,
      recipeTimes: recipeTimes,
      userId: userId,
      recipeOwnerName: userData.name,
      userPhotoUrl: userData.userPhotoUrl,
      likes: recipeData.likes,
      numberOfPorcions: numberOfPorcions,
      comments: recipeData.comments,
      peopleThatLikedRecipe: recipeData.peopleThatLikedRecipe,
      recipePhasesList: formatRecipePhasesList,
    };

    await setDocAlreadyCreated("recipes", docId, newRecipeDataFireStore);
  }

  function handleSubmit(e: any) {
    e.preventDefault();
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
      text: "",
      title: "",
      type: "erro",
    };
    if (recipeDifficulty === "") {
      settingsModal.text = "Dificuldade da receita não foi selecionada!";
      settingsModal.title = "ERRO";
      settingsModal.type = "erro";
      setModal(settingsModal);
      return;
    } else if (recipeCost === "") {
      settingsModal.text = "Custo médio da receita não foi selecionado!";
      settingsModal.title = "ERRO";
      settingsModal.type = "erro";
      setModal(settingsModal);
      return;
    } else if (imageFile === undefined) {
      settingsModal.text =
        "Nenhuma imagem foi selecionada para ser a capa da receita! Você precisa de pelo menos uma imagem para a sua receita.";
      settingsModal.title = "ERRO";
      settingsModal.type = "erro";
      setModal(settingsModal);
      return;
    } else if (!recipeIngredients?.includes("\n")) {
      settingsModal.text =
        "Sua receita está pronta para ser enviada, porém revise se digitou os ingredientes da forma correta, e preciso digitar cada novo ingrediente em uma nova linha!";
      settingsModal.title = "INFORMAÇÃO";
      settingsModal.type = "informacao";
      settingsModal.secondButtonFunction = () => {
        postRecipe();
        setModal({
          isOpen: false,
          setIsOpen() {},
          text: "",
          title: "",
          type: "erro",
        });
      };
      settingsModal.textSecondButton = "Confirmar";
      settingsModal.styleSecondButton = {
        backgroundColor: "var(--cor3)",
        cursor: "pointer",
        padding: "10px 20px",
        color: "white",
        borderRadius: "5px",
      };
      setModal(settingsModal);
      return;
    }

    settingsModal.title = "SUCESSO!";
    settingsModal.text =
      "Sua receita está pronta para ser postada! Para concluir a postagem clique em confirmar.";
    settingsModal.type = "sucesso";
    settingsModal.secondButtonFunction = () => {
      postRecipe();
      setModal({
        isOpen: false,
        setIsOpen() {},
        text: "",
        title: "",
        type: "erro",
      });
    };
    settingsModal.textSecondButton = "Confirmar";
    settingsModal.styleSecondButton = {
      backgroundColor: "var(--cor3)",
      cursor: "pointer",
      padding: "10px 20px",
      color: "white",
      borderRadius: "5px",
    };
    setModal(settingsModal);
  }

  async function postRecipe() {
    const data = await getDataFromCollection("users", "userId", userId);
    const userData: any = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))[0];
    const newNumberOfRecipes = parseInt(userData.numberOfRecipes) + 1;
    const newUserData = {
      bornDate: userData.bornDate,
      createAccountDate: userData.createAccountDate,
      nacionality: userData.nacionality,
      name: userData.name,
      numberOfRecipes: newNumberOfRecipes.toString(),
      roles: userData.roles,
      userId: userData.userId,
    };
    updateDocFirestore("users", data.docs[0].id, newUserData);

    // const storageImgURL = `images/receitas/${userData.name + "-" + newNumberOfRecipes + "-imagemPrincipal"}`;
    const storageImgURL = `images/receitas/${userData.name}/${newNumberOfRecipes}/imagemPrincipal`;
    addItemToStorage(storageImgURL, imageUrl);

    recipePhasesList?.push(
      requiredRecipePhase
        ? requiredRecipePhase
        : { phaseNumber: 1, phaseText: "" }
    );

    const newRecipePhasesList = recipePhasesList?.filter(
      (element) => element.phaseText != ""
    );

    let id = uuidv4();
    let recipeUrl =
      id.replaceAll("-", "") +
      "-" +
      titleRecipe.toLowerCase().replaceAll(" ", "-");

    const recipeIngredientesFormated = recipeIngredients
      ?.split("\n")
      .filter((item) => item != "");

    const recipeData = {
      recipeUrl: recipeUrl,
      createdAt: serverTimestamp(),
      recipeTitle: titleRecipe.toLowerCase(),
      imagePath: storageImgURL,
      recipeDescription: recipeDescription,
      recipeIngredients: recipeIngredientesFormated,
      recipeDifficulty: recipeDifficulty,
      recipeCost: recipeCost,
      recipeTimes: recipeTimes,
      userId: userId,
      recipeOwnerName: userData.name,
      userPhotoUrl: userData.userPhotoUrl,
      likes: 0,
      numberOfPorcions: numberOfPorcions,
      comments: [],
      peopleThatLikedRecipe: [],
      recipePhasesList: newRecipePhasesList,
    };

    await addDocument("recipes", recipeData);
    navigate("/perfil/meuperfil");
  }

  return (
    <Container
      customClass={"flexMiddleCol"}
      styleContainer={{
        background: "var(--cor4)",
        boxShadow: "#00000014 0px 9px 20px 10px",
        paddingTop: "8%",
      }}
    >
      <Modal
        type={modal.type}
        isOpen={modal.isOpen}
        setIsOpen={modal.setIsOpen}
        text={modal.text}
        title={modal.title}
        textSecondButton={modal.textSecondButton}
        secondButtonFunction={modal.secondButtonFunction}
        styleSecondButton={modal.styleSecondButton}
      ></Modal>
      <form
        className={styles.mainForm}
        onSubmit={(e: any) => {
          if (recipeData) {
            editRecipeModal(e);
            return;
          }
          handleSubmit(e);
        }}
      >
        <div className={styles.divTitleInput}>
          <label htmlFor="recipeTitle">Título da receita</label>
          <Input
            name="recipeTitle"
            type="text"
            required
            autocomplete
            value={titleRecipe}
            placeholder="Insira o título da receita..."
            onChange={(e: any) => {
              setTitleRecipe(e.target.value);
            }}
          ></Input>
        </div>
        <div className={styles.divInputInsertImage}>
          <label
            htmlFor="picture_input"
            className={styles.mainInputInsertLabel}
          >
            Insira a imagem de capa da sua receita
          </label>
          <InputFileWithPreview
            imageFile={recipeImage != "" ? recipeImage : imageFile}
            setFile={setImageFile}
            spanText="Clique para inserir uma imagem..."
            setImageUrl={setImageUrl}
          />
        </div>
        <div className={styles.divRecipeApresentation}>
          <label htmlFor="recipeApresentation">Apresentação da Receita</label>
          <TextArea
            defaultValue={recipeDescription}
            handleChange={setRecipeDescription}
            name="recipeApresentation"
            required
            placeholder="Insira a descrição da sua receita..."
          />
        </div>
        <div className={styles.divNumberOfPorcions}>
          <label htmlFor="numberOfPorcions">Insira o número de porções</label>
          <input
            name="numberOfPorcions"
            type="number"
            id="numberOfPorcions"
            required
            value={numberOfPorcions}
            maxLength={2}
            min={1}
            max={30}
            onChange={(e: any) => {
              setNumberOfPorcions(e.target.value);
              console.log(numberOfPorcions);
            }}
          />
        </div>
        <div className={styles.divInsertIngredients}>
          <label htmlFor="insertIngredients">
            Insira os ingredientes{" "}
            <span>
              Insira cada ingrediente em uma linha e use esse formato:
              <strong> Quantidade Nome do Ingrediente</strong>
            </span>
          </label>
          <TextArea
            defaultValue={recipeIngredients}
            handleChange={setRecipeIngredients}
            name="insertIngredients"
            required
            placeholder="Exemplo: 
            3 Ovos
          1kg Feijão
          400g Arroz"
          ></TextArea>
        </div>
        <div className={styles.divLevelOfDificulty}>
          <p>
            Nível de dificuldade da receita: <span>{recipeDifficulty}</span>
          </p>
          <div className={styles.divLevelOfDificultyOptions}>
            {recipeDifficultyList.map((difficulty) => (
              <label htmlFor={difficulty} key={difficulty}>
                <TbChefHat className={styles.chefHatIcon} />
                <input
                  type="radio"
                  name="difficultyOptions"
                  id={difficulty}
                  value={difficulty}
                  onChange={(e: any) => {
                    const optionsQuery =
                      document.getElementsByName("difficultyOptions");
                    optionsQuery.forEach((option: any) => {
                      option.parentNode.style.backgroundColor = "white";
                    });
                    e.target.parentNode.style.backgroundColor = "var(--cor5)";
                    setRecipeDifficulty(e.target.value);
                  }}
                />
              </label>
            ))}
          </div>
        </div>
        <div className={styles.divRecipeCost}>
          <p>
            Custo médio da receita: <span>{recipeCost}</span>
          </p>
          <div className={styles.divRecipeCostOptions}>
            {recipeCostList.map((cost) => (
              <label htmlFor={cost.value} key={cost.value}>
                {cost.element}
                <input
                  type="radio"
                  name="recipeCost"
                  id={cost.value}
                  value={cost.value}
                  onChange={(e: any) => {
                    const optionsQuery =
                      document.getElementsByName("recipeCost");
                    optionsQuery.forEach((option: any) => {
                      option.parentNode.style.backgroundColor = "white";
                    });
                    e.target.parentNode.style.backgroundColor = "var(--cor5)";
                    setRecipeCost(e.target.value);
                  }}
                />
              </label>
            ))}
          </div>
        </div>
        <div className={styles.divRecipeTime}>
          {recipeTimesList.map((time) => {
            indexNumber++;
            return (
              <div className={styles.divRecipeTimeOption} key={time.period}>
                <p>{time.period}</p>
                <label htmlFor={time.period}>
                  Minutos{time.required ? "*" : ""}:
                  <input
                    type="number"
                    name={time.period}
                    max={60}
                    value={recipeTimes[indexNumber].minutes}
                    maxLength={2}
                    required={time.required}
                    min={time.required ? 1 : 0}
                    onChange={(e: any) => {
                      const [first, second, third] = recipeTimes;
                      const newRecipeTimes = [
                        {
                          period: first.period,
                          minutes: first.minutes,
                          hours: first.hours,
                        },
                        {
                          period: second.period,
                          minutes: second.minutes,
                          hours: second.hours,
                        },
                        {
                          period: third.period,
                          minutes: third.minutes,
                          hours: third.hours,
                        },
                      ];
                      for (let i = 0; i < recipeTimes.length; i++) {
                        if (recipeTimes[i].period === e.target.name) {
                          newRecipeTimes[i].minutes = e.target.value;
                        }
                      }
                      setRecipeTimes(newRecipeTimes);
                    }}
                  />
                </label>
                <label htmlFor={time.period}>
                  Horas:
                  <input
                    type="number"
                    name={time.period}
                    value={recipeTimes[indexNumber].hours}
                    maxLength={3}
                    min={0}
                    onChange={(e: any) => {
                      const [first, second, third] = recipeTimes;
                      const newRecipeTimes = [
                        {
                          period: first.period,
                          minutes: first.minutes,
                          hours: first.hours,
                        },
                        {
                          period: second.period,
                          minutes: second.minutes,
                          hours: second.hours,
                        },
                        {
                          period: third.period,
                          minutes: third.minutes,
                          hours: third.hours,
                        },
                      ];
                      for (let i = 0; i < recipeTimes.length; i++) {
                        if (recipeTimes[i].period === e.target.name) {
                          newRecipeTimes[i].hours = e.target.value;
                        }
                      }
                      setRecipeTimes(newRecipeTimes);
                    }}
                  />
                </label>
              </div>
            );
          })}
        </div>
        <div className={styles.divRecipesPhases}>
          <p>Etapas de preparo</p>
          <div className={styles.divRecipePhase}>
            <p>Etapa 1*</p>
            <textarea
              name="recipePhase"
              placeholder={`Descreva a etapa 1...`}
              required
              onChange={(e: any) => {
                setRequiredRecipePhase({
                  phaseNumber: 1,
                  phaseText: e.target.value,
                });
                if (recipePhasesList == null) {
                  setRecipePhasesList([{ phaseText: "", phaseNumber: 2 }]);
                }
              }}
              value={requiredRecipePhase?.phaseText}
            ></textarea>
          </div>
          {recipePhasesList &&
            recipePhasesList.map((phase) => (
              <div className={styles.divRecipePhase} key={phase.phaseNumber}>
                <p>Etapa {phase.phaseNumber}</p>
                <textarea
                  name="recipePhase"
                  placeholder={`Descreva a etapa ${phase.phaseNumber}...`}
                  onChange={(e: any) => {
                    let isTextFilled = true;
                    recipePhasesList.forEach((phaseText) => {
                      if (phaseText.phaseText == "") {
                        isTextFilled = false;
                      }
                    });
                    if (recipePhasesList[phase.phaseNumber - 1]) {
                      phase.phaseText = e.target.value;
                    } else if (!isTextFilled) {
                      phase.phaseText = e.target.value;
                      return;
                    } else {
                      setRecipePhasesList([
                        ...recipePhasesList,
                        { phaseText: "", phaseNumber: phase.phaseNumber + 1 },
                      ]);
                    }
                  }}
                ></textarea>
              </div>
            ))}
        </div>
        <div className={styles.divButtonSubmitForm}>
          <Button
            buttonText={recipeUrl ? "Editar receita" : "Enviar receita"}
            type="submit"
            style={{
              backgroundColor: "var(--cor3)",
              padding: "30px 0px",
              fontSize: "1.5em",
              color: "white",
              cursor: "pointer",
            }}
          ></Button>
        </div>
      </form>
    </Container>
  );
}
