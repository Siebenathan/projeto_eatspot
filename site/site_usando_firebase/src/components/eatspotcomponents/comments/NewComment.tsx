import styles from "./NewComment.module.css";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useEffect, useState } from "react";
import TextArea from "../../forms/TextArea";
import Button from "../../forms/Button";

interface NewCommentProps {
  userImageUrl: string;
  username: string;
  commentText: string;
}

interface StarProps {
  marked: boolean;
  starNumber: number;
}

export default function NewComment() {
  const [stars, setStars] = useState<StarProps[]>([
    { marked: false, starNumber: 1 },
    { marked: false, starNumber: 2 },
    { marked: false, starNumber: 3 },
    { marked: false, starNumber: 4 },
    { marked: false, starNumber: 5 },
  ]);
  const [commentText, setCommentText] = useState<string>();

  const urlUser = "https://source.unsplash.com/featured/100x100?person";

  function handleSubmit(e: any) {
    e.preventDefault();
    console.log(commentText);
  }

  function handleStarClick(e: any) {
    const newStars = stars.map(star => {
        if(e.target.id == star.starNumber) {
            star.marked = true;
        }
        return star;
    });
    setStars(newStars);
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
                  <AiFillStar
                    className={styles.starIcon}
                    id={star.starNumber.toString()}
                    onClick={handleStarClick}
                    key={star.starNumber}
                  />
                );
              }
              return (
                <AiOutlineStar
                  className={styles.starIcon}
                  id={star.starNumber.toString()}
                  onClick={handleStarClick}
                  key={star.starNumber}
                />
              );
            })}
          </div>
        </div>
        <div className={styles.divRecipeCommentTextAndUser}>
          <div className={styles.divUserPhotoAndName}>
            <img src={urlUser} alt="user image" />
            <p>Cristiano Ronaldo</p>
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
