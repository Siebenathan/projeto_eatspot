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

interface RecipeTimeProps {
  period: string;
  minutes?: number;
  hours?: number;
}

export default function CreateRecipePage() {
  const [titleRecipe, setTitleRecipe] = useState<string>("");
  const [imageFile, setImageFile] = useState<any>();
  const [recipeDescription, setRecipeDescription] = useState<string>();
  const [recipeIngredients, setRecipeIngredients] = useState<string>();
  const [recipeDifficulty, setRecipeDifficulty] = useState<string>();
  const [recipeCost, setRecipeCost] = useState<string>();
  const [recipePhases, setRecipePhases] = useState<any>();

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

  return (
    <Container
      customClass={"flexMiddleCol"}
      styleContainer={{
        background: "var(--cor4)",
        boxShadow: "#00000014 0px 9px 20px 10px",
        padding: "30px 0px",
      }}
    >
      <form className={styles.mainForm}>
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
            required
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
                  required
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
                  required
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
                    console.log(recipeTimes);
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
            <TextArea
              name="recipePhase"
              defaultValue={""}
              handleChange={() => {}}
              placeholder={"Descreva a etapa 1..."}
              required
            />
          </div>
        </div>
      </form>
    </Container>
  );
}
