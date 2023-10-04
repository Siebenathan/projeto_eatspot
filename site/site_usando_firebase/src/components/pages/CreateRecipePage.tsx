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

export default function CreateRecipePage() {
  const [titleRecipe, setTitleRecipe] = useState<string>("");
  const [imageFile, setImageFile] = useState<any>();
  const [recipeDescription, setRecipeDescription] = useState<string>();
  const [recipeIngredients, setRecipeIngredients] = useState<string>();
  const [recipeDifficulty, setRecipeDifficulty] = useState<string>();

  const [optionStyle, setOptionStyle] = useState<any>();

  const recipeDifficultyList = [
    "Muito fácil",
    "Fácil",
    "Médio",
    "Difícil",
    "Muito difícil",
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
              <label htmlFor={difficulty} key={difficulty} style={optionStyle}>
                <TbChefHat className={styles.chefHatIcon} />
                <input
                  type="radio"
                  name="difficultyOptions"
                  id={difficulty}
                  value={difficulty}
                  onClick={(e: any) => {
                    if (e.target.checked) {
                      e.target.style.backgroundColor = "green";
                    } else {
                      setOptionStyle({ backgroundColor: "white" });
                    }
                    setRecipeDifficulty(e.target.value);
                  }}
                />
              </label>
            ))}
          </div>
        </div>
      </form>
    </Container>
  );
}
