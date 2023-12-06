import styles from "./CreateAccountPage.module.css";
import eatSpotLogo from "../../img/EatSpot-semfundo.png";
import LinkWithUnderline from "../forms/LinkWithUnderline";
import InputWithLabelInside from "../forms/inputs/InputWithLabelInside";
import { useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useNavigate, useLocation } from "react-router-dom";
import SelectWithSearch from "../forms/selects/SelectWithSearch";
import ButtonSlide from "../forms/buttons/ButtonSlide";
import ButtonBeating from "../forms/buttons/ButtonBeating";
import { ModalProps } from "../modal/Modal";
import {
  postUser,
  postUserWhithUserAuthCreated,
} from "../services/firebase/firebase";
import Modal from "../modal/Modal";
import { verifyUserName, verifyIfNameExist, verifyDate, verifyPassword } from "../rules/bussinesRoles";

interface InputErrorsProps {
  username: string;
  password: string;
  bornDate: string;
}

export default function CreateAccountPage() {
  const location = useLocation();
  const [listNations, setListNations] = useState<any>([]);
  const message = location.state?.message;
  const usernameGoogle = location.state?.username;
  const userUid = location.state?.userUid;
  const [loginWithOtherService, setLoginWithOtherService] = useState<boolean>();
  const [value, setValue] = useLocalStorage("userId", "");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rptPassword, setRptPassword] = useState<string>("");
  const [bornDate, setBornDate] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [modal, setModal] = useState<ModalProps>({
    isOpen: false,
    text: "",
    type: "erro",
    title: "",
    setIsOpen() {
      setModal({
        isOpen: false,
        setIsOpen() {},
        text: "",
        type: "erro",
        title: "",
      });
    },
    textSecondButton: undefined,
    secondButtonFunction: undefined,
    styleSecondButton: undefined,
  });
  const [inputErrors, setInputErrors] = useState<InputErrorsProps>({
    username: "",
    bornDate: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        data.sort((a: any, b: any) => {
          const nomeA = a.name.common;
          const nomeB = b.name.common;

          if (nomeA < nomeB) {
            return -1;
          }
          if (nomeA > nomeB) {
            return 1;
          }

          return 0;
        });
        const contryNames: string[] = [];
        data.forEach((country: any) => {
          contryNames.push(country.name.common);
        });
        setListNations(contryNames);
      })
      .catch((err) => console.log(err));

    if (userUid) {
      setLoginWithOtherService(true);
    }
  }, []);

  async function handleFormSubmit(e: any) {
    e.preventDefault();
    const newInputErrors: InputErrorsProps = {username: "", password: "", bornDate: ""}; 
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

    let formDontHaveErrors = await verifyFormErrors();
    if(!formDontHaveErrors) {
      return;
    }

    let response: string = "";

    if (email) {
      response = await postUser({
        name: username,
        bornDate: bornDate,
        email: email,
        nacionality: selectedCountry,
        password: password,
      });

      if (response === "Registro realizado com sucesso!") {
        const timeout = setTimeout(() => {
          navigate("/login");
          clearTimeout(timeout);
        }, 100);
      }
    } else {
      response = await postUserWhithUserAuthCreated({
        bornDate: bornDate,
        userId: userUid,
        name: username,
        nacionality: selectedCountry,
      });

      setValue(userUid);

      if (response === "Registro realizado com sucesso!") {
        const timeout = setTimeout(() => {
          navigate("/perfil/meuperfil");
          clearTimeout(timeout);
        }, 100);
      }
    }
  }

  async function verifyFormErrors() {
    let newInputErrors: InputErrorsProps = { username: "", bornDate: "", password: "" };
    let dontHaveErrors = true;

    const verifyPasswordResult = verifyPassword(password);
    if(verifyPasswordResult != "Certo") {
      newInputErrors.password = verifyPasswordResult;
      dontHaveErrors = false;
    }

    const userVerify = verifyUserName(username);
    if (
      userVerify != "Certo"
    ) {
      newInputErrors.username = userVerify;
      dontHaveErrors = false;
    }

    if (password != rptPassword) {
      newInputErrors.password = "As senhas estão diferentes uma da outra!"; 
      dontHaveErrors = false;
      // settingsModal.isOpen = true;
      // settingsModal.text = "As senhas estão diferentes uma da outra!";
      // settingsModal.title = "ERRO";
      // settingsModal.type = "erro";
      // setModal(settingsModal);
    }
    
    const verifyIfNameExistBool = await verifyIfNameExist(username);
    if(verifyIfNameExistBool == "Um usuário já possui este nome") {
      newInputErrors.username = verifyIfNameExistBool;
      dontHaveErrors = false;
    }

    setInputErrors(newInputErrors);
    return dontHaveErrors;
  }

  return (
    <div className={styles.mainDiv}>
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
      <div className={styles.loginMainDiv}>
        <div className={styles.leftLoginDiv}>
          <div className={styles.divGreetings}>
            <h1>
              {loginWithOtherService
                ? `Conclua a sua conta ${usernameGoogle}`
                : `Crie sua conta`}
            </h1>
            <p>Insira suas informações nos campos abaixo</p>
          </div>
          <form onSubmit={handleFormSubmit} className={styles.createAccountForm}>
            <div className={styles.formInputs}>
              <div className={styles.formInputRow}>
                {!loginWithOtherService && (
                  <InputWithLabelInside
                    labelText="Email"
                    type="email"
                    nameAndId="email"
                    value={email}
                    setValue={setEmail}
                    required
                  />
                )}
                <InputWithLabelInside
                  labelText="Nome de usuário"
                  type="text"
                  nameAndId="username"
                  value={username}
                  setValue={setUsername}
                  required
                  errorText={inputErrors.username}
                />
              </div>
              {!loginWithOtherService && (
                <div className={styles.formInputRow}>
                  <InputWithLabelInside
                    labelText="Senha"
                    type="password"
                    nameAndId="password"
                    value={password}
                    setValue={setPassword}
                    required
                    errorText={inputErrors.password}
                  />
                  <InputWithLabelInside
                    labelText="Repita a senha"
                    type="password"
                    nameAndId="rptPassword"
                    value={rptPassword}
                    setValue={setRptPassword}
                    lockIconForPassword
                    required
                  />
                </div>
              )}
              <div className={styles.formInputRowSelect}>
                <InputWithLabelInside
                  labelText="Data de nascimento"
                  type="date"
                  nameAndId="bornDate"
                  value={bornDate}
                  setValue={setBornDate}
                  required
                  errorText={inputErrors.bornDate}
                />
                <SelectWithSearch
                  options={listNations}
                  value={selectedCountry}
                  setValue={setSelectedCountry}
                  labelText="Nacionalidade"
                  labelColorWhenSelected="cornflowerblue"
                  labelStyle={{
                    fontSize: "0.8em",
                    color: "var(--cor7)",
                    paddingBottom: "5px",
                    display: "block",
                  }}
                />
              </div>
            </div>
            <ButtonSlide
              buttonText={
                loginWithOtherService ? "Finalizar conta" : "Criar conta"
              }
              nameAndId="createaccount"
              slideDirection="leftDirection"
              type="submit"
              beforeColor="greenColor"
            />
          </form>
          {!loginWithOtherService && (
            <div className={styles.divBottom}>
              <ul className={styles.divBottomLoginLiks}>
                <li>
                  <LinkWithUnderline
                    underlineColor="colorBlue"
                    linkText="Já tenho conta"
                    to="/login"
                    linkStyle={{ fontSize: "1em" }}
                  />
                </li>
              </ul>
            </div>
          )}
          <div className={styles.divTermsOfService}>
            <p>
              Antes de {loginWithOtherService ? "finalizar" : "criar"} sua conta
              clique{" "}
              <LinkWithUnderline
                underlineColor="colorBlue"
                linkText="aqui"
                to="/termos-de-servico"
                linkStyle={{
                  fontSize: "1em",
                  color: "cornflowerblue",
                  fontWeight: "bolder",
                }}
              />{" "}
              para ler os termos do site.
            </p>
          </div>
        </div>
        <div className={styles.rightLoginDiv}>
          <img src={eatSpotLogo} alt="" />
          <h1>
            <span>Eat</span>Spot
          </h1>
        </div>
      </div>
      <div className={styles.mainDivLeft}></div>
      <div className={styles.mainDivRight}></div>
    </div>
  );
}
