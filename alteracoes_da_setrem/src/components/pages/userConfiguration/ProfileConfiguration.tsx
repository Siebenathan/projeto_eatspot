import styles from "./ProfileConfiguration.module.css";
import InputWithLabelInside from "../../forms/inputs/InputWithLabelInside";
import SelectWithSearch from "../../forms/selects/SelectWithSearch";
import { useState, useEffect } from "react";
import ButtonSlide from "../../forms/buttons/ButtonSlide";
import InputFileWithPreview from "../../forms/inputs/InputFileWithPreview";
import { ModalProps } from "../../modal/Modal";
import { addItemToStorage } from "../../services/firebase/firebaseStorage";
import {
  getDataFromCollection,
  updateDocFirestore,
} from "../../services/firebase/firebaseFirestore";
import { verifyUserName } from "../../rules/bussinesRoles";
import { verifyIfNameExist } from "../../rules/bussinesRoles";
import { verifyDate } from "../../rules/bussinesRoles";
import { recoverPassword } from "../../services/firebase/firebaseAuth";

interface ProfileConfigurationProps {
  userData: any;
  userImage: string;
  nations: any;
  modal: ModalProps;
  setModal(modal: ModalProps): void;
}

interface FormErrosProps {
  username: string;
  bornDate: string;
  email: string;
}

export default function ProfileConfigurationPage(
  props: ProfileConfigurationProps
) {
  const [newBornDate, setNewBornDate] = useState<string>(
    props.userData.bornDate
  );
  const [changeUsername, setChangeUsername] = useState<string>(
    props.userData.name
  );
  const [selectedNation, setSelectedNation] = useState<string>(
    props.userData.nacionality
  );
  const [imageFile, setImageFile] = useState<any>("");
  const [usernameConfirm, setUserNameConfirm] = useState<string>();
  const [formError, setFormError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<any>();
  const [inputErrors, setInputErrors] = useState<FormErrosProps>({
    username: "",
    bornDate: "",
    email: "",
  });

  useEffect(() => {
    setImageFile(props.userImage);
  }, []);

  async function handleChangesFormSubmit(e: any) {
    e.preventDefault();
    const settingsModal: ModalProps = {
      isOpen: true,
      setIsOpen() {
        props.setModal({
          isOpen: false,
          setIsOpen() {},
          text: "",
          type: "erro",
          title: "",
        });
      },
      text: "Nenhuma mudança foi feita, não há nenhuma mudança para ser efetuada!",
      title: "ERRO",
      type: "erro",
    };

    if (props.userData.name != usernameConfirm) {
      handleFormError("userNameWrong");
      return;
    }

    const inputsAreOk = await verifyFormErrors();
    if (!inputsAreOk) {
      return;
    }

    let formChangeText =
      "Deseja mudar suas informações? Mudanças que serão feitas: ";

    if (changeUsername != props.userData.name) {
      formChangeText += `o nome de usuário será trocado de ${props.userData.name} para ${changeUsername} `;
    }

    if (newBornDate != props.userData.bornDate) {
      let data_brasileira1 = props.userData.bornDate
        .split("-")
        .reverse()
        .join("/");
      let data_brasileira2 = newBornDate.split("-").reverse().join("/");
      formChangeText += `sua data de nascimento será trocada de ${data_brasileira1} para ${data_brasileira2} `;
    }

    if (selectedNation != props.userData.nacionality) {
      formChangeText += `seu país de nascimento será trocado de ${props.userData.nacionality} para ${selectedNation} `;
    }

    if (imageUrl) {
      formChangeText += `sua foto de perfil será trocada`;
    }

    if (
      "Deseja mudar suas informações? Mudanças que serão feitas: " ==
      formChangeText
    ) {
      props.setModal(settingsModal);
      return;
    }

    settingsModal.secondButtonFunction = async () => {
      await changeAccount();
      props.setModal({
        isOpen: false,
        setIsOpen() {},
        text: "",
        title: "",
        type: "erro",
      });
    };
    settingsModal.textSecondButton = "Confirmar";
    settingsModal.styleSecondButton = {
      backgroundColor: "var(--cor5)",
      cursor: "pointer",
      padding: "10px 20px",
      color: "white",
      borderRadius: "5px",
    };
    settingsModal.text = formChangeText;
    settingsModal.type = "sucesso";
    settingsModal.title = "Mudar Informações";

    props.setModal(settingsModal);
  }

  async function handlePasswordChangeFormSubmit(e: any) {
    e.preventDefault();
    const newInputErrors: FormErrosProps = {
      bornDate: "",
      email: "",
      username: "",
    };
    if (props.userData.email != email) {
      newInputErrors.email = "O seu email está incorreto!";
      setInputErrors(newInputErrors);
      return;
    }

    const passwordChangeResult = recoverPassword(props.userData.email);
    console.log(passwordChangeResult);

    setInputErrors(newInputErrors);
  }

  async function handleFormError(errorName: string) {
    setFormError(errorName);
    const timeout = setTimeout(() => {
      setFormError("");
      clearTimeout(timeout);
    }, 5000);
  }

  async function changeAccount() {
    if (props.userData.name != changeUsername) {
      const nameAlreadyExist = await verifyIfNameExist(changeUsername);

      if (nameAlreadyExist == "Um usuário já possui este nome") {
        return;
      }

      const recipesData = await getDataFromCollection(
        "recipes",
        "recipeOwnerName",
        props.userData.name
      );

      if (!recipesData.empty) {
        const recipes: any = recipesData.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const newRecipesInfo = recipes.map((recipe: any) => {
          recipe.userPhotoUrl = `images/perfil/${changeUsername}/fotoDePerfil`;
          recipe.recipeOwnerName = changeUsername;
          return recipe;
        });

        for (let i = 0; i < recipes.length; i++) {
          await updateDocFirestore(
            "recipes",
            recipesData.docs[i].id,
            newRecipesInfo[i]
          );
        }
      }
    }

    const userInfo = await getDataFromCollection(
      "users",
      "userId",
      props.userData.userId
    );
    const docId = userInfo.docs[0].id;

    const { name, nacionality, bornDate, userPhotoUrl, ...rest } =
      props.userData;
    name == changeUsername
      ? (rest["name"] = name)
      : (rest["name"] = changeUsername);
    nacionality == selectedNation
      ? (rest["nacionality"] = nacionality)
      : (rest["nacionality"] = selectedNation);
    bornDate == newBornDate
      ? (rest["bornDate"] = bornDate)
      : (rest["bornDate"] = newBornDate);
    rest["userPhotoUrl"] = `images/perfil/${changeUsername}/fotoDePerfil`;

    if (imageUrl != undefined) {
      await changePerfilPhoto();
    }

    await updateDocFirestore("users", docId, rest);
  }

  async function changePerfilPhoto() {
    const endPoint = props.userData.userPhotoUrl;
    await addItemToStorage(endPoint, imageUrl);
  }

  async function verifyFormErrors() {
    let newInputErrors: FormErrosProps = {
      username: "",
      bornDate: "",
      email: "",
    };

    let dontHaveErrors = true;
    const userVerify = verifyUserName(changeUsername);
    if (userVerify != "Certo") {
      newInputErrors.username = userVerify;
      dontHaveErrors = false;
    }

    const dateVerify = verifyDate(newBornDate);
    if (dateVerify != "Certo") {
      newInputErrors.bornDate = dateVerify;
      dontHaveErrors = false;
    }

    setInputErrors(newInputErrors);

    return dontHaveErrors;
  }

  return (
    <div className={styles.mainDiv}>
      <div className={styles.mainDivContent}>
        <div className={styles.divGreetings}>
          <h1>
            Edite sua conta <span>{props.userData.name}</span>
          </h1>
          <p>Preencha o formulário abaixo e mude suas informações</p>
        </div>
        <form
          onSubmit={handleChangesFormSubmit}
          className={styles.formInputsToEdit}
        >
          <div className={styles.formRow}>
            <InputWithLabelInside
              labelText="Nome de usuário"
              nameAndId="username"
              value={changeUsername}
              setValue={setChangeUsername}
              type="text"
              required
              errorText={inputErrors.username}
            />
            <InputWithLabelInside
              labelText="Data de nascimento"
              nameAndId="bornDate"
              value={newBornDate}
              setValue={setNewBornDate}
              type="date"
              required
              errorText={inputErrors.bornDate}
            />
          </div>
          <div className={styles.formRow}>
            <SelectWithSearch
              labelText="Nacionalidade"
              options={props.nations}
              value={selectedNation}
              setValue={setSelectedNation}
              labelColorWhenSelected="cornflowerblue"
              labelStyle={{
                fontSize: "0.8em",
                padding: "0",
                height: "fit-content",
                color: "var(--cor7)",
                display: "block",
              }}
            />
          </div>
          <div className={styles.formUserImage}>
            <p>Clique abaixo para trocar sua foto de perfil</p>
            <InputFileWithPreview
              imageFile={imageFile ? imageFile : ""}
              setFile={setImageFile}
              spanText="Clique para inserir imagem..."
              setImageUrl={setImageUrl}
            />
          </div>
          <h3 className={styles.passwordTitle}>
            Digite seu nome de usuário para confirmar as mudanças
          </h3>
          <div className={`${styles.formRow} ${styles.usernameConfirm}`}>
            <InputWithLabelInside
              labelText="Nome de usuário"
              nameAndId="usernameConfirm"
              value={usernameConfirm}
              setValue={setUserNameConfirm}
              type="text"
              required
            />
            {formError == "userNameWrong" && (
              <p className={styles.textUserNameWrong}>
                Erro nome de usuário esta incorreto
              </p>
            )}
          </div>
          <ButtonSlide
            buttonText="Editar perfil"
            nameAndId="editProfile"
            slideDirection="leftDirection"
            type="submit"
            beforeColor="greenColor"
          />
        </form>
        {props.userData.registerType == "EmailAndPassword" && (
          <>
            <div className={styles.divGreetings2}>
              <h1>
                Troque sua senha <span>{props.userData.name}</span>
              </h1>
              <p>
                Preencha o campo abaixo com o seu email, que você receberá um
                código de verificação no mesmo
              </p>
            </div>

            <form
              onSubmit={handlePasswordChangeFormSubmit}
              className={styles.formInputsToEdit}
            >
              <div className={styles.formRow}>
                <InputWithLabelInside
                  labelText="Email"
                  nameAndId="emailPasswordChange"
                  value={email}
                  setValue={setEmail}
                  type="email"
                  required
                  errorText={inputErrors.email}
                />
              </div>
              <ButtonSlide
                buttonText="Trocar senha"
                nameAndId="editProfile"
                slideDirection="leftDirection"
                type="submit"
                beforeColor="greenColor"
              />
            </form>
          </>
        )}
      </div>
    </div>
  );
}
