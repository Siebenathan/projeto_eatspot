import styles from "./UserConfigurationPage.module.css";
import Container from "../../layout/Container";
import { useState, useEffect } from "react";
import { getDataFromCollection } from "../../services/firebase/firebaseFirestore";
import { getImageStorage } from "../../services/firebase/firebaseStorage";
import defaultUserPhoto from "../../../img/EatSpot-semfundo.png";
import { FaUser, FaCog } from "react-icons/fa";
import { IoIosExit } from "react-icons/io";
import ProfileConfigurationPage from "./ProfileConfiguration";
import Configuration from "./Configurations";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/firebase/firebase";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import LeaveSection from "./LeaveSection";
import { ModalProps } from "../../modal/Modal";
import Modal from "../../modal/Modal";
import { ModalToPutImageProps } from "./../../modal/ModalToPutImage";

export default function UserConfigurationPage() {
  const [userData, setUserData] = useState<any>();
  const [listNations, setListNations] = useState<any>();
  const [userPhoto, setUserPhoto] = useState<any>();
  const [userDocId, setUserDocId] = useState<string>("");
  const [currentActive, setCurrentActive] = useState<string>("Usuario");
  const [userId, setUserId] = useLocalStorage("userId", "");
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
    if (userId) {
      onAuthStateChanged(auth, (user) => {
        if (user && userId == userId) {
          if (user.uid !== userId) {
            navigate("/");
            return;
          }
        }
      });
    }
    getDataFromCollection("users", "userId", userId).then(async (data) => {
      const userDataFirestore: any = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))[0];
      setUserDocId(data.docs[0].id);
      setUserData(userDataFirestore);
      setUserPhoto(await getUserPhoto(userDataFirestore.userPhotoUrl));
    });

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
  }, []);

  async function getUserPhoto(imageUrl: string) {
    let userPhoto: any = null;
    userPhoto = await getImageStorage(imageUrl);
    if (userPhoto == "erro imagem nao encontrada") {
      userPhoto = defaultUserPhoto;
    }
    return userPhoto;
  }

  return (
    <Container
      customClass={"flexForUserConfigurationPage"}
      styleContainer={{
        padding: "100px 0px 0px 0px",
      }}
    >
      {userData && userPhoto && (
        <>
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
          <div className={styles.navigation}>
            <ul>
              <li
                className={`${styles.list} ${
                  currentActive == "Usuario" ? styles.active : ""
                }`}
              >
                <button
                  onClick={() => {
                    setCurrentActive("Usuario");
                  }}
                >
                  <span className={styles.icon}>
                    <FaUser className={styles.faIcons} />
                  </span>
                  <span className={styles.title}>Usuario</span>
                </button>
              </li>
              <li
                className={`${styles.list} ${
                  currentActive == "Configurações" ? styles.active : ""
                }`}
              >
                <button
                  onClick={() => {
                    setCurrentActive("Configurações");
                  }}
                >
                  <span className={styles.icon}>
                    <FaCog className={styles.faIcons} />
                  </span>
                  <span className={styles.title}>Configurações</span>
                </button>
              </li>
              <li
                className={`${styles.list} ${
                  currentActive == "Sair" ? styles.active : ""
                }`}
              >
                <button
                  onClick={() => {
                    setCurrentActive("Sair");
                  }}
                >
                  <span className={styles.icon}>
                    <IoIosExit className={styles.exitIcon} />
                  </span>
                  <span className={styles.title}>Sair</span>
                </button>
              </li>
            </ul>
          </div>
          <div className={styles.divContent}>
            {currentActive == "Usuario" && (
              <ProfileConfigurationPage
                userData={userData}
                nations={listNations ?? []}
                userImage={userPhoto}
                modal={modal}
                setModal={setModal}
                userDocId={userDocId}
              />
            )}
            {currentActive == "Configurações" && (
              <Configuration
                userData={userData}
                userDocId={userDocId}
                modal={modal}
                setModal={setModal}
              />
            )}
            {currentActive == "Sair" && (
              <LeaveSection modal={modal} setModal={setModal} />
            )}
          </div>
        </>
      )}
    </Container>
  );
}
