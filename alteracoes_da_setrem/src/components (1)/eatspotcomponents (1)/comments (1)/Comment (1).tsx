import styles from "./Comment.module.css";
import { AiTwotoneStar, AiOutlineStar } from "react-icons/ai";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface CommentProps {
  userImageUrl: string;
  username: string;
  commentText: string;
  commentDate: string;
  avaliationNumber: number;
}

export default function Comment(props: CommentProps) {
  const [stars, setStars] = useState<boolean[]>([
    true,
    false,
    false,
    false,
    false,
  ]);

  useEffect(() => {
    for (let i = 0; i < props.avaliationNumber; i++) {
      stars[i] = true;
      setStars([...stars]);
    }
  }, []);

  function setCommentStars() {}

  return (
    <div className={styles.mainDivComment}>
      <div className={styles.divUserComment}>
        <img src={props.userImageUrl} alt={`Foto do ${props.username}`} />
        <p>{props.username}</p>
      </div>
      <div className={styles.divComment}>
        <div className={styles.divCommentDateAndAvaliation}>
          <div className={styles.divStars}>
            {stars &&
              stars.map((star) => {
                if (star) {
                  return <AiTwotoneStar className={styles.starIcon} key={uuidv4()} />;
                }
                return <AiOutlineStar className={styles.starIcon} key={uuidv4()} />;
              })}
          </div>
          <small>{props.commentDate}</small>
        </div>
        <p>{props.commentText}</p>
      </div>
    </div>
  );
}
