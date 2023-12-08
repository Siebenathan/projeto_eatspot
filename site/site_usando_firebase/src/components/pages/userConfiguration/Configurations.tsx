import styles from "./Configuration.module.css";
import InputWithLabelInside from "../../forms/inputs/InputWithLabelInside";
import ButtonSlide from "../../forms/buttons/ButtonSlide";
import { useState, useEffect } from "react";
import { ModalProps } from "../../modal/Modal";
import { FcGoogle } from "react-icons/fc";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { auth } from "../../services/firebase/firebase";
import { GoogleAuthProvider, UserCredential, signInWithPopup } from "firebase/auth";

interface ConfigurationProps {
  userData: any;
  modal: ModalProps;
  setModal(modal: ModalProps): void;
}

export default function Configuration(props: ConfigurationProps) {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [logingWithOAuth, setLogingWithOAuth] = useState<boolean>(false);
  const [hasExternalProvider, setHasExternalProvider] =
    useState<boolean>(false);

  useEffect(() => {
    props.userData.registerType.forEach((rtype: string) => {
      if (rtype != "EmailAndPassword") {
        setHasExternalProvider(true);
      }
    });
  }, []);

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

    if (props.userData.name != username) {
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

  function deleteAccount() {}

  async function handleFormError(errorName: string) {
    setError(errorName);
    const timeout = setTimeout(() => {
      setError("");
      clearTimeout(timeout);
    }, 5000);
  }

  function verifyRegisterType(rtype: string) {
    if (rtype == "Google SignIn") {
      return (
        <button key={rtype} onClick={handleGoogleSignIn}>
          <FcGoogle className={styles.googleIcon} />
          Logar Pelo Google
        </button>
      );
    }
  }

  async function handleGoogleSignIn() {
    if (!logingWithOAuth) {
      setLogingWithOAuth(true);
      const provider = new GoogleAuthProvider();
      let result: UserCredential | undefined = undefined;
      try {
        result = await signInWithPopup(auth, provider);
      } catch (err) {
        setLogingWithOAuth(false);
        return;
      }
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
        type: "informacao",
        secondButtonFunction: async () => {
          props.setModal({
            isOpen: false,
            setIsOpen() {},
            text: "",
            type: "erro",
            title: "",
          })
          
          await result?.user.delete();
        },
        textSecondButton: "Confirmar Exclusão",
        styleSecondButton: {
          backgroundColor: "var(--cor5)",
          cursor: "pointer",
          padding: "10px 20px",
          color: "white",
          borderRadius: "5px",
        }
      };
      props.setModal(settingsModal);
    }
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
          {hasExternalProvider ? (
            <>
              <p>Faça login novamente na sua conta para deleta-la</p>
              <div className={styles.divLoginExternalProviders}>
                {props.userData.registerType.map((rtype: string) => {
                  return verifyRegisterType(rtype);
                })}
              </div>
            </>
          ) : (
            <>
              <p>Digite seu e-mail e sua senha para deletar sua conta</p>
              <form
                className={styles.deleteAccForm}
                onSubmit={handleDeleteFormSubmit}
              >
                <div className={styles.formRow}>
                  <InputWithLabelInside
                    labelText="Email"
                    nameAndId="email"
                    value={email}
                    setValue={setEmail}
                    type="email"
                    required
                  />
                  <InputWithLabelInside
                    labelText="Senha"
                    nameAndId="password"
                    value={password}
                    setValue={setPassword}
                    type="password"
                    required
                    lockIconForPassword
                  />
                </div>
                <ButtonSlide
                  buttonText="Excluir Conta"
                  nameAndId="excludeAcc"
                  slideDirection="leftDirection"
                  type="submit"
                  beforeColor="redColor"
                />
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
