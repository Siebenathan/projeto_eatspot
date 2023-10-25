import styles from "./Comment.module.css";

interface CommentProps {
    userImageUrl: string;
    username: string;
    commentText: string;
    commentDate: string;
};

export default function Comment(props: CommentProps) {
  return (
    <div className={styles.mainDivComment} >
      <div className={styles.divUserComment}>
        <img src={props.userImageUrl} alt={`Foto do ${props.username}`} />
        <p>{props.username}</p>
      </div>
      <div className={styles.divComment}>
        <small>{props.commentDate}</small>
        <p>{props.commentText}</p>
      </div>
    </div>
  );
}
