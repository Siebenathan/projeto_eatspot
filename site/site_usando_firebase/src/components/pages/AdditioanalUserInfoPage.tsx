import styles from "./AdditioanalUserInfoPage.module.css";
import { FcCalendar, FcDecision } from "react-icons/fc";
import Button from "../forms/buttons/Button";
import SelectCountrys from "../forms/selects/SelectCountrys";
import Header from "../layout/Header";
import Container from "../layout/Container";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getDataFromCollection } from "../services/firebase/firebaseFirestore";
import { MdEmail } from "react-icons/md";
import padlockLocked from "../../img/icones/icons8-cadeado-2-100.png";
import padLockUnlocked from "../../img/icones/icons8-desbloquear-2-100.png";
import { FaLock } from "react-icons/fa";
import {
  postUser,
  postUserWhithUserAuthCreated,
} from "../services/firebase/firebase";
import Modal from "../modal/Modal";
import { ModalProps } from "../modal/Modal";
import useLocalStorage from "../hooks/useLocalStorage";

export default function AdditionalUserInfoPage() {
  const [selectedCountry, setSelectedCountry] = useState<any>(
    "Selecione a sua nacionalidade..."
  );
  const [listNations, setListNations] = useState<any>([]);
  const [value, setValue] = useLocalStorage("userId", "");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rptPassword, setRptPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [dataNasc, setDataNasc] = useState<any>("");
  const location = useLocation();
  const [padLockIsLocked, setPadLockIsLocked] = useState<boolean>(true);
  const message = location.state?.message;
  const userUid = location.state?.userUid;
  const [loginWithOtherService, setLoginWithOtherService] = useState<boolean>();
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
  const navigate = useNavigate();

  useEffect(() => {
    if(value) {
      navigate("/perfil/meuperfil");
      return;
    }
    if(userUid) {
      verifyUserInFirestore();
      setLoginWithOtherService(true);
    }
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
        setListNations(data);
      })
      .catch((err) => console.log(err));

  }, []);

  useEffect(() => {
    
  }, [value])

  async function verifyUserInFirestore() {
    console.log(userUid);
    const result = await getDataFromCollection("users", "userId", userUid);
    if (result.empty) {
      return;
    } else {
      setValue(userUid);
      const timeout = setTimeout(() => {
        navigate("/perfil/meuperfil");
        clearTimeout(timeout);
      }, 2000)
    }
  }

  async function handleFormSubmit(e: any) {
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
    if (selectedCountry == "Selecione a sua nacionalidade...") {
      settingsModal.isOpen = true;
      settingsModal.text =
        "Porfavor selecione a sua naciolidade para prosseguir com o a conclusão da conta!";
      settingsModal.title = "ERRO";
      settingsModal.type = "erro";
      console.log("caiu aqui");
      setModal(settingsModal);
      return;
    }

    let response: string = "";

    if (email) {
      if(password != rptPassword) {
        console.log("As senhas estão diferentes");
        return;
      }
      response = await postUser({
        name: username,
        bornDate: dataNasc,
        email: email,
        nacionality: selectedCountry,
        password: password,
      });

      if (response === "Registro realizado com sucesso!") {
        console.log(response);
      }
    } else {
      response = await postUserWhithUserAuthCreated({
        bornDate: dataNasc,
        userId: userUid,
        name: username,
        nacionality: selectedCountry
      });

      setValue(userUid);

      if (response === "Registro realizado com sucesso!") {
        console.log(response);
      }
    }
  }

  return (
    <>
      <Header />
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
      <Container customClass={"additionalUserInfo"}>
        <h1 className={styles.additionalInformationTitle}>
          {loginWithOtherService
            ? "Informações adicionais da conta"
            : "Criar conta"}
        </h1>
        <form className={styles.additionalInfoForm} onSubmit={handleFormSubmit}>
          {!loginWithOtherService && (
            <>
              <div className={styles.normalDivForm}>
                <MdEmail className={styles.gmailIcon} />
                <label htmlFor="email">Insira seu email: </label>
                <input
                  type="email"
                  id={"email"}
                  name={"email"}
                  required
                  value={email}
                  onChange={(e: any) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>

              <div className={styles.normalDivForm}>
                <FaLock className={styles.userDoubtIcon} />
                <label htmlFor="password">Insira sua senha:</label>
                <input
                  type="password"
                  id={"password"}
                  name={"password"}
                  required
                  value={password}
                  onChange={(e: any) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>

              <div className={styles.normalDivForm}>
                <FaLock className={styles.userDoubtIcon} />
                <label htmlFor="rptPassword">Repita sua senha:</label>
                <input
                  type={padLockIsLocked ? "password" : "text"}
                  id={"rptPassword"}
                  name={"rptPassword"}
                  required
                  value={rptPassword}
                  onChange={(e: any) => {
                    setRptPassword(e.target.value);
                  }}
                />
                <img
                  className={styles.imgLockedUnlocked}
                  src={padLockIsLocked ? padlockLocked : padLockUnlocked}
                  onClick={() => {
                    setPadLockIsLocked(!padLockIsLocked);
                  }}
                  alt="lockImage"
                />
              </div>
            </>
          )}

          <div className={styles.normalDivForm}>
            <FcDecision className={styles.userDoubtIcon} />
            <label htmlFor="username">Insira seu nome de usuário:</label>
            <input
              type="text"
              id={"username"}
              name={"username"}
              value={username}
              required
              onChange={(e: any) => {
                setUsername(e.target.value);
              }}
            />
          </div>

          <div className={styles.normalDivForm}>
            <FcCalendar className={styles.calendarIcon} />
            <label htmlFor="userBornDate">Insira sua data de nascimento:</label>
            <input
              placeholder="Insira o nome de usuário..."
              type="date"
              id={"userBornDate"}
              name={"userBornDate"}
              required
              value={dataNasc}
              onChange={(e: any) => {
                setDataNasc(e.target.value);
              }}
            />
          </div>

          <div className={styles.divFormNations}>
            <SelectCountrys
              name="nacionality"
              labelText="Nacionalidade: "
              optionsList={listNations}
              labelStyle={{
                fontSize: "1.5em",
                textAlign: "center",
                color: "white",
                paddingBottom: "10px",
              }}
              selectedValue={selectedCountry}
              setSelectedValue={setSelectedCountry}
            />
          </div>

          <Button
            buttonText="Concluir registro"
            type="submit"
            style={{
              width: "60%",
              padding: "1rem 2rem",
              fontSize: "2em",
              backgroundColor: "var(--cor3)",
              color: "white",
              cursor: "pointer",
            }}
          />
        </form>
      </Container>
    </>
  );
}
