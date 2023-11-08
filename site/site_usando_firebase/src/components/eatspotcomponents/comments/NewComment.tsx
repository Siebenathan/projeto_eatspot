import styles from "./NewComment.module.css";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useEffect, useState } from "react";
import starFilled from "../../../img/icons8-estrela-100-filled.png";
import starOutline from "../../../img/icons8-estrela-100-outline.png";
import TextArea from "../../forms/TextArea";
import Button from "../../forms/Button";
import { useNavigate } from "react-router-dom";

interface NewCommentProps {
  userImageUrl: string;
  username: string;
  isUserLogged: boolean;
  handleSubmit(commentText: string, avaliationNumber: number): void;
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

  function handleSubmit(e: any) {
    e.preventDefault();
    setTimeout(() => {
      props.handleSubmit(commentText, commentAvaliation);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
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
