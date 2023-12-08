import styles from "./NewComment.module.css";
import { useState } from "react";
import starFilled from "../../../img/icons8-estrela-100-filled.png";
import starOutline from "../../../img/icons8-estrela-100-outline.png";
import TextArea from "../../forms/TextArea";
import Button from "../../forms/buttons/Button";

interface NewCommentProps {
  userImageUrl: string;
  username: string;
  isUserLogged: boolean;
  handleSubmit(
    commentText: string,
    avaliationNumber: number,
    createCommentDate: string,
    exactTime: number
  ): void;
  isUpdatingDatabase: boolean;
  setIsUpdatingDatabase(trueOrFalse: boolean): void;
}

interface StarProps {
  marked: boolean;
  starNumber: number;
}

export default function NewComment(props: NewCommentProps) {
  const [stars, setStars] = useState<StarProps[]>([
    { marked: true, starNumber: 1 },
    { marked: false, starNumber: 2 },
    { marked: false, starNumber: 3 },
    { marked: false, starNumber: 4 },
    { marked: false, starNumber: 5 },
  ]);
  const [commentText, setCommentText] = useState<string>("");
  const [commentAvaliation, setCommentAvaliation] = useState<number>(1);
  const charLimit = 500;

  function handleStarClick(e: any) {
    const commentAvaliationNumber = parseInt(e.target.id);
    if (commentAvaliationNumber) {
      setCommentAvaliation(commentAvaliationNumber);
    }

    const newStars = stars.map((star) => {
      if (commentAvaliationNumber >= star.starNumber) {
        star.marked = true;
      } else if (commentAvaliationNumber <= star.starNumber) {
        star.marked = false;
      }
      return star;
    });
    setStars(newStars);
  }

  function handleSubmit() {
    const currentDate = new Date();

    let day: any = currentDate.getDate();
    day < 10 ? (day = "0" + day) : (day = day);

    let month: any = currentDate.getMonth() + 1;
    month < 10 ? (day = "0" + day) : (month = month);

    let year: any = currentDate.getFullYear();
    const createCommentDate = `${day}/${month}/${year}`;

    props.handleSubmit(
      commentText,
      commentAvaliation,
      createCommentDate,
      currentDate.getTime()
    );
    setCommentText("");
  }

  return (
    <form
      onSubmit={(e: any) => {
        e.preventDefault();
        if (props.isUpdatingDatabase) {
          return;
        } else {
          props.setIsUpdatingDatabase(true);
          const timeout = setTimeout(() => {
            handleSubmit();
            props.setIsUpdatingDatabase(false);
            clearTimeout(timeout);
          }, 5000);
        }
      }}
    >
      <div className={styles.mainDivComment}>
        <div className={styles.divRecipeAvaliation}>
          <h3>O que achou da receita?</h3>
          <div className={styles.divStars}>
            {stars.map((star) => {
              if (star.marked) {
                return (
                  <img
                    src={starFilled}
                    className={styles.starIcon}
                    id={star.starNumber.toString()}
                    onClick={handleStarClick}
                    key={star.starNumber}
                  />
                );
              } else {
                return (
                  <img
                    src={starOutline}
                    className={styles.starIcon}
                    id={star.starNumber.toString()}
                    onClick={handleStarClick}
                    key={star.starNumber}
                  />
                );
              }
            })}
          </div>
        </div>
        <div className={styles.divRecipeCommentTextAndUser}>
          <div className={styles.divUserPhotoAndName}>
            <img src={props.userImageUrl} alt="user image" />
            <p>{props.username}</p>
          </div>
          <div className={styles.divTextAreaAndSubmitForm}>
            <TextArea
              defaultValue={commentText}
              handleChange={setCommentText}
              name="commentText"
              placeholder="Digite o que achou da receita..."
              required
              maxLength={charLimit}
            />
            <Button
              buttonText="Enviar"
              type="submit"
              style={{
                width: "40%",
                backgroundColor: "var(--cor3)",
                color: "white",
                padding: "1rem 2rem",
                borderRadius: "0px",
                cursor: "pointer",
                fontSize: "1.1em",
              }}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
