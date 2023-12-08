import styles from "./Configuration.module.css";
import InputWithLabelInside from "../../forms/inputs/InputWithLabelInside";
import ButtonSlide from "../../forms/buttons/ButtonSlide";
import { useState } from "react";
import { ModalProps } from "../../modal/Modal";

interface ConfigurationProps {
  userData: any;
  modal: ModalProps;
  setModal(modal: ModalProps): void;
}

export default function Configuration(props: ConfigurationProps) {
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");

  function handleDeleteFormSubmit(e: any) {
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
      text: "Deseja realmente excluir sua conta? Caso clique em confirmar sua conta será permanentemente deletada!",
      title: "Excluir conta",
      type: "erro",
    };

    if(props.userData.name != username) {
      handleFormError("userNameWrong");
      return;
    }

    settingsModal.secondButtonFunction = () => {
      deleteAccount();
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

    props.setModal(settingsModal);
  }

  function deleteAccount() {

  }

  async function handleFormError(errorName: string) {
    setError(errorName);
    const timeout = setTimeout(() => {
        setError("");
        clearTimeout(timeout);
    }, 5000)
  }

  return (
    <div className={styles.mainDiv}>
      <div className={styles.mainDivContent}>
        <div className={styles.divGreetings}>
          <h1>
            Configurações da sua conta <span>{props.userData.name}</span>
          </h1>
          <p>Faça configurações gerais da sua conta aqui</p>
        </div>
        <div className={styles.divDeleteAccount}>
          <h3>Deletar conta</h3>
          <p>Digite seu nome de usuário para deletar sua conta</p>
          <form
            className={styles.deleteAccForm}
            onSubmit={handleDeleteFormSubmit}
          >
            <div className={styles.formRow}>
              <InputWithLabelInside
                labelText="Nome de usuário"
                nameAndId="username"
                value={username}
                setValue={setUsername}
                type="text"
                required
              />
              {error == "userNameWrong" && <p className={styles.textUsernameWrong}>Erro nome de usuário esta incorreto</p>}
            </div>
            <ButtonSlide
              buttonText="Excluir Conta"
              nameAndId="excludeAcc"
              slideDirection="leftDirection"
              type="submit"
              beforeColor="redColor"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
