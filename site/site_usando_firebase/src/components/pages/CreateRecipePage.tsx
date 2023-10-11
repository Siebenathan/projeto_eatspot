import Container from "../layout/Container";
import styles from "./CreateRecipePage.module.css";
import { TbChefHat } from "react-icons/tb";
import { GrMoney } from "react-icons/gr";
import { GiMoneyStack } from "react-icons/gi";
import { TbMoneybag } from "react-icons/tb";
import Input from "../forms/Input";
import { useState } from "react";
import InputFileWithPreview from "../forms/InputFileWithPreview";
import TextArea from "../forms/TextArea";
import Button from "../forms/Button";
import Modal from "../modal/Modal";
import { ModalProps } from "../modal/Modal";
import { unescape } from "querystring";

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
  const [titleRecipe, setTitleRecipe] = useState<string>("");
  const [imageFile, setImageFile] = useState<any>(undefined);
  const [recipeDescription, setRecipeDescription] = useState<string>();
  const [recipeIngredients, setRecipeIngredients] = useState<string>();
  const [recipeDifficulty, setRecipeDifficulty] = useState<string>("");
  const [recipeCost, setRecipeCost] = useState<string>("");
  const [requiredRecipePhase, setRequiredRecipePhase] = useState<string>();
  const [recipePhasesList, setRecipePhasesList] =
    useState<RecipePhasesProps[]>();
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
  // const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const recipeTimes: RecipeTimeProps[] = [
    { period: "Tempo de preparo", minutes: undefined, hours: undefined },
    { period: "Tempo de cozimento", minutes: undefined, hours: undefined },
    { period: "Tempo de espera", minutes: undefined, hours: undefined },
  ];

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
    if (recipeDifficulty == "") {
      settingsModal.text = "Dificuldade da receita não foi selecionada!";
      settingsModal.title = "ERRO";
      settingsModal.type = "erro";
      setModal(settingsModal);
      return;
    } else if (recipeCost == "") {
      settingsModal.text = "Custo médio da receita não foi selecionado!";
      settingsModal.title = "ERRO";
      settingsModal.type = "erro";
      setModal(settingsModal);
      return;
    } else if (imageFile == undefined) {
      settingsModal.text =
        "Nenhuma imagem foi selecionada para ser a capa da receita! Você precisa de pelo menos uma imagem para a sua receita.";
      settingsModal.title = "ERRO";
      settingsModal.type = "erro";
      setModal(settingsModal);
      return;
    }

    settingsModal.title = "SUCESSO!";
    settingsModal.text =
      "Sua receita está pronta para ser postada! Para concluir a postagem clique em confirmar.";
    settingsModal.type = "sucesso";
    settingsModal.secondButtonFunction = () => {
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
    console.log(settingsModal);
    setModal(settingsModal);
  }

  return (
    <Container
      customClass={"flexMiddleCol"}
      styleContainer={{
        background: "var(--cor4)",
        boxShadow: "#00000014 0px 9px 20px 10px",
        padding: "30px 0px",
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
      <form className={styles.mainForm} onSubmit={(e: any) => handleSubmit(e)}>
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
            imageFile={imageFile}
            setFile={setImageFile}
            spanText="Clique para inserir uma imagem..."
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
          {recipeTimesList.map((time) => (
            <div className={styles.divRecipeTimeOption} key={time.period}>
              <p>{time.period}</p>
              <label htmlFor={time.period}>
                Minutos{time.required ? "*" : ""}:
                <input
                  type="number"
                  name={time.period}
                  max={60}
                  maxLength={2}
                  required={time.required}
                  min={1}
                  onChange={(e: any) => {
                    for (let i = 0; i < recipeTimes.length; i++) {
                      if (recipeTimes[i].period === e.target.name) {
                        recipeTimes[i].minutes = e.target.value;
                      }
                    }
                  }}
                />
              </label>
              <label htmlFor={time.period}>
                Horas:
                <input
                  type="number"
                  name={time.period}
                  maxLength={3}
                  min={0}
                  onChange={(e: any) => {
                    for (let i = 0; i < recipeTimes.length; i++) {
                      if (recipeTimes[i].period === e.target.name) {
                        recipeTimes[i].hours = e.target.value;
                      }
                    }
                    console.log(recipeTimes);
                  }}
                />
              </label>
            </div>
          ))}
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
                setRequiredRecipePhase(e.target.value);
                if (recipePhasesList == null) {
                  setRecipePhasesList([{ phaseText: "", phaseNumber: 2 }]);
                }
              }}
              value={requiredRecipePhase}
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
            buttonText="Enviar receita"
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
