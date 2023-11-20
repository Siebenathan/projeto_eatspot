import styles from "./Comment.module.css";
import { AiTwotoneStar, AiOutlineStar } from "react-icons/ai";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { FaPencilAlt } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import Modal from "../../modal/Modal";
import { ModalProps } from "../../modal/Modal";

interface CommentProps {
  userImageUrl: string;
  username: string;
  commentText: string;
  commentDate: string;
  avaliationNumber: number;
  isCommentOwner?: boolean;
  isTheOwnerOfPost?: boolean;
  exactTime: number;
  deleteComment(exactTime: number): Promise<void>;
}

export default function Comment(props: CommentProps) {
  const [stars, setStars] = useState<boolean[]>([
    true,
    false,
    false,
    false,
    false,
  ]);
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

  useEffect(() => {
    for (let i = 0; i < props.avaliationNumber; i++) {
      stars[i] = true;
      setStars([...stars]);
    }
  }, []);

  function onTrashCanIconClick() {
    console.log("cliquei");
    const settingsModal: ModalProps = {
      isOpen: true,
      text: `Deseja excluir o comentário de ${props.username}, postado no dia ${props.commentDate}?`,
      type: "informacao",
      title: "Deseja excluir o comentário?",
      setIsOpen() {
        setModal({
          isOpen: false,
          setIsOpen() {},
          text: "",
          type: "erro",
          title: "",
        });
      },
      textSecondButton: "Confirmar",
      secondButtonFunction: handleDeleteComment,
      styleSecondButton: {
        backgroundColor: "var(--cor3)",
        cursor: "pointer",
        padding: "10px 20px",
        color: "white",
        borderRadius: "5px",
      }
    };
    setModal(settingsModal);
  }

  function handleDeleteComment() {
    props.deleteComment(props.exactTime);
  }

  return (
    <div className={styles.mainDivComment}>
      <Modal
        isOpen={modal.isOpen}
        setIsOpen={modal.setIsOpen}
        text={modal.text}
        title={modal.title}
        type={modal.type}
        secondButtonFunction={modal.secondButtonFunction}
        styleSecondButton={modal.styleSecondButton}
        textSecondButton={modal.textSecondButton}
      ></Modal>
      <div className={styles.divUserComment}>
        <img src={props.userImageUrl} alt={`Foto do ${props.username}`} />
        <p>{props.username}</p>
      </div>
      <div className={styles.divComment}>
        <div className={styles.divCommentDateAndAvaliation}>
          <div className={styles.divStars}>
            <div>
              {stars &&
                stars.map((star) => {
                  if (star) {
                    return (
                      <AiTwotoneStar
                        className={styles.starIcon}
                        key={uuidv4()}
                      />
                    );
                  }
                  return (
                    <AiOutlineStar className={styles.starIcon} key={uuidv4()} />
                  );
                })}
            </div>
            <small>{props.commentDate}</small>
          </div>
          {props.isTheOwnerOfPost && (
            <div className={styles.divChangeComment}>
              <button
                className={styles.trashcanIcon}
                onClick={onTrashCanIconClick}
              >
                <FaTrashCan />
              </button>
            </div>
          )}
        </div>
        <p>{props.commentText}</p>
      </div>
    </div>
  );
}
