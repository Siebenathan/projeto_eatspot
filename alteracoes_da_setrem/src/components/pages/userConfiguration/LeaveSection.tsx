import styles from "./LeaveSection.module.css";
import ButtonSlide from "../../forms/buttons/ButtonSlide";
import { ModalProps } from "../../modal/Modal";
import { signOutUser } from "../../services/firebase/firebaseAuth";

interface LeaveSectionProps {
  modal: ModalProps;
  setModal(modal: ModalProps): void;
}

export default function LeaveSection(props: LeaveSectionProps) {
  function handleLeaveAccFunction() {
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
      text: "Deseja sair da sua conta? Caso clique em confirmar será necessário entrar na sua conta de novo para conseguir acessa-la novamente.",
      title: "Sair da conta",
      type: "informacao",
    };

    settingsModal.secondButtonFunction = () => {
      leaveAccount();
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
      backgroundColor: "var(--cor3)",
      cursor: "pointer",
      padding: "10px 20px",
      color: "white",
      borderRadius: "5px",
    };

    props.setModal(settingsModal);
  }

  function leaveAccount() {
    localStorage.removeItem("userId");
    signOutUser();
  }

  return (
    <div className={styles.mainDiv}>
      <div className={styles.mainDivContent}>
        <div className={styles.divLeaveAcc}>
          <h1>
            Clique no botão abaixo para <span>sair</span> da sua conta
          </h1>
          <ButtonSlide
            buttonText="Sair da conta"
            nameAndId="excludeAcc"
            onClick={handleLeaveAccFunction}
            slideDirection="leftDirection"
            type="submit"
            beforeColor="redColor"
          />
        </div>
      </div>
    </div>
  );
}
